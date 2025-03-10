import glob from 'fast-glob';
import {
  Content as MarkdownToken,
  Root as MarkdownRoot,
  Paragraph as MarkdownParagraph,
} from 'mdast';
import {
  resolve as resolvePath,
  dirname as resolveDirname,
  relative as resolveRelativePath,
} from 'path';
import {
  fsExists,
  generateHeadingId,
  generateLegacyHeadingId,
  markdownTokenToHtml,
  parseMarkdown,
  parseMarkdownMeta,
  removeMarkdownMeta,
} from '../utils';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { resolveRepoTypings } from '../typings/resolveRepoTypings';
// @ts-ignore
import { makeCacheManager } from '../../../tools/esbuild-plugin-semcore/cache-manager';
import watch from 'node-watch';

const __dirname = resolveDirname(fileURLToPath(import.meta.url));
const repoRoot = resolvePath(__dirname, '../../..');
const emailPackagePath = resolvePath(__dirname, '../../../semcore/email');

let typingsResolvingTask: Promise<void> | null = null;
let repoTypings = await resolveRepoTypings();

if (process.env.WATCH_TYPES) {
  watch(
    [resolvePath(repoRoot, 'semcore'), resolvePath(repoRoot, 'tools')],
    {
      filter: (path, skip) => {
        if (/\/node_modules/.test(path)) return skip;
        if (/\/lib/.test(path)) return skip;
        return /\.(d\.)?ts$/.test(path);
      },
      recursive: true,
    },
    async () => {
      typingsResolvingTask = (async () => {
        repoTypings = await resolveRepoTypings();
      })();
      await typingsResolvingTask;
    },
  );
}

export const getRepoTyping = async (typingName: string, debuggingPosition: string) => {
  await typingsResolvingTask;
  const typing = repoTypings[typingName];

  if (!typing) {
    throw new Error(
      `Unable to find typescript exported type alias or interface "${typingName}" in whole repository. Maybe you forgot to export it? (from ${debuggingPosition})`,
    );
  }

  const processedDependencies = {};
  const resolveDependencies = (dependencies) =>
    Object.fromEntries(
      dependencies
        .filter(
          (dependency) =>
            repoTypings[dependency] &&
            !dependencies[dependency] &&
            !processedDependencies[dependency],
        )
        .map((dependency) => {
          processedDependencies[dependency] = true;
          const typing = repoTypings[dependency];
          const properties = typing.declaration.properties.map(
            ({ name, isOptional, type, description, params }) => ({
              name,
              isOptional,
              type,
              params,
              description: markdownTokenToHtml(parseMarkdown(description)),
            }),
          );
          return [
            dependency,
            {
              declaration: {
                ...typing.declaration,
                properties,
              },
              dependencies: resolveDependencies(typing.dependencies ?? []),
            },
          ];
        }),
    );
  const dependencies = resolveDependencies(typing.dependencies ?? []);

  const properties = typing.declaration.properties.map(
    ({ name, isOptional, type, description, params }) => ({
      name,
      isOptional,
      type,
      params,
      description: markdownTokenToHtml(parseMarkdown(description)),
    }),
  );

  const declaration = {
    ...typing.declaration,
    properties,
  };

  const { dependencyFiles, filepath } = typing;

  return { declaration, dependencies, dependencyFiles, filepath };
};

let uniqueId = 0;
const mathVersionRegex = /\[(.*)\]/;
const normalizeMarkdown = (
  ast: MarkdownRoot,
  relativePath: string,
  existingRoutes: { [routName: string]: boolean },
) => {
  const imagesUrls: { [id: string]: string } = {};
  const traverseTokens = (token: MarkdownToken | MarkdownRoot) => {
    if (token.type === 'image') {
      const id = `image_url_${uniqueId++}`;
      let url = token.url;
      if (url.startsWith('/')) {
        url = relativePath + url;
      } else if (!url.startsWith('./')) {
        url = `./${url}`;
      }
      imagesUrls[id] = url;
      token.url = `---------~~~~~~${id}~~~~~~---------`;
    }
    if (token.type === 'link') {
      if (token.url.startsWith('/')) {
        let path = token.url.substring(1);
        let route = path;
        if (route.includes('#')) route = route.substring(0, route.indexOf('#'));
        if (route.includes('?')) route = route.substring(0, route.indexOf('?'));
        if (route.endsWith('/')) route = route.substring(0, route.length - 1);
        if (existingRoutes && !existingRoutes[route]) {
          throw Error(
            `Link ${path} (${JSON.stringify(
              token.children,
            )}) from ${relativePath} references to non-existing page.`,
          );
        }
        if (!path.endsWith('/') && !path.includes('?') && !path.includes('#')) {
          path += '/';
        }
        token.url = (process.env.PUBLIC_PATH || '/') + path;
      }
    }
    if ('children' in token) {
      token.children.forEach(traverseTokens);
    }
  };
  ast.children.forEach(traverseTokens);

  return { imagesUrls };
};

const stringifyTokenPosition = (fullPath: string, token: MarkdownToken, metaHeight: number) => {
  const line = token.position.start.line + metaHeight;
  const column = token.position.start.column;

  return `${fullPath}:${line}:${column}`;
};

type ComponentChangelogBlock = {
  title: string;
  version: string;
  changes: { type: string; text: string }[];
  id: string;
  level: number;
  route: string;
};
const makeChangelog = (
  markdownAst: MarkdownRoot,
  fullPath: string,
  metaHeight: number,
  route: string,
) => {
  const blocks: ComponentChangelogBlock[] = [];
  let currentBlock: ComponentChangelogBlock | null = null;
  let currentType = 'Unknown';

  for (const token of markdownAst.children) {
    if (token.type === 'heading' && token.depth === 2) {
      const title = markdownTokenToHtml(token.children[0]);
      const matchVersion = title.match(mathVersionRegex);
      const version = matchVersion?.[1] ?? '';
      const id = generateHeadingId(`v.${version}`);
      currentBlock = {
        title,
        version,
        changes: [],
        id,
        level: token.depth,
        route,
      };
      blocks.push(currentBlock);
    } else if (currentBlock) {
      if (token.type === 'heading' && token.depth === 3) {
        currentType = markdownTokenToHtml(token.children[0]);
      } else if (token.type === 'list') {
        for (const listItem of token.children) {
          currentBlock.changes.push({
            type: currentType,
            text: markdownTokenToHtml({
              type: 'root',
              children: listItem.children,
            }),
          });
        }
      } else {
        const position = stringifyTokenPosition(fullPath, token, metaHeight);

        throw new Error(`Unexpected markdown token ${token.type} in ${position}`);
      }
    }
  }

  return blocks;
};

type GlobalChangelogBlock = {
  title: string;
  version: string;
  components: {
    title: string;
    component: string;
    changes: {
      type: string;
      text: string;
    }[];
  }[];
  id: string;
  level: number;
  route: string;
};

const makeChangelogByComponent = (
  markdownAst: MarkdownRoot,
  fullPath: string,
  metaHeight: number,
  route: string,
) => {
  const blocks: GlobalChangelogBlock[] = [];
  let currentBlock: GlobalChangelogBlock | null = null;
  let currentComponent: GlobalChangelogBlock['components'][0] | null = null;

  for (const token of markdownAst.children) {
    if (token.type === 'heading' && token.depth === 2) {
      const title = markdownTokenToHtml(token.children[0]);
      const matchVersion = title.match(mathVersionRegex);
      const version = matchVersion?.[1] ?? '';
      const id = generateHeadingId(`v.${version}`);
      currentBlock = {
        title,
        version,
        components: [],
        id,
        level: token.depth,
        route,
      };
      blocks.push(currentBlock);
    } else if (currentBlock) {
      if (token.type === 'heading' && token.depth === 3) {
        const component = markdownTokenToHtml(token.children[0]);
        const title = component.replace('@semcore/', '');
        currentComponent = {
          title,
          component,
          changes: [],
        };
        currentBlock.components.push(currentComponent);
      } else if (currentComponent && token.type === 'list') {
        for (const listItem of token.children) {
          const text = listItem.children[0] as MarkdownParagraph;
          const typeNode = text.children[0] as any as MarkdownParagraph;
          currentComponent.changes.push({
            type: markdownTokenToHtml(typeNode.children[0]),
            text: markdownTokenToHtml({
              type: 'paragraph',
              children: text.children.slice(1),
            }),
          });
        }
      } else {
        const position = stringifyTokenPosition(fullPath, token, metaHeight);

        throw new Error(`Unexpected markdown token ${token.type} in ${position}`);
      }
    }
  }

  return blocks;
};

const cacheManager = makeCacheManager('website-articles');
await cacheManager.init();

if (process.argv.includes('--reset-cache')) {
  await cacheManager.reset();
}

type HeadingToken = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  route: string;
  id: string;
  html: string;
};

type Token =
  | MarkdownToken
  | HeadingToken
  | {
      type: 'example';
      raw: string;
      relativePath: string;
      filePath: string;
      load: string;
    }
  | {
      type: 'import';
      props: { [propName: string]: unknown };
      filePath: string;
      load: string;
    }
  | {
      type: 'embedded_video';
      url: string;
    }
  | {
      type: 'email_html';
      raw: string;
      compiled: string;
    }
  | {
      type: 'changelogByComponent';
      blocks: GlobalChangelogBlock[];
    }
  | {
      type: 'changelog';
      blocks: ComponentChangelogBlock[];
    }
  | {
      type: 'typescriptDeclaration';
      declaration: unknown;
      dependencies: { [dependantName: string]: unknown };
      route: string;
    }
  | {
      type: 'text';
      html: string;
    };

export const buildArticle = async (
  docsDir: string,
  fullPath: string,
  relativePath: string,
  existingRoutes?: { [routName: string]: boolean },
): Promise<{
  tokens: Token[];
  title: string;
  fileSource: string;
  sourcePath: string;
  beta: boolean;
  imagesUrls: { [id: string]: string };
  legacyHeaderHashes: { [legacyHash: string]: string };
  dependencies: string[];
  headings: Token[];
}> => {
  const text = await readFile(fullPath, 'utf-8');
  const meta = parseMarkdownMeta(text);
  const textWithoutMeta = removeMarkdownMeta(text);
  const metaHeight = text.split('\n').length - textWithoutMeta.split('\n').length;

  const markdownAst = parseMarkdown(textWithoutMeta);
  const { imagesUrls } = normalizeMarkdown(markdownAst, docsDir, existingRoutes);

  const dependencies: string[] = [];
  const legacyHeaderHashes: { [legacyHash: string]: string } = {};

  const tokensMetadata = new Map<Token, { caption: string }>();

  const headings = [];

  const tokens = (
    await Promise.all(
      markdownAst.children.map(async (token, index): Promise<Token | Token[]> => {
        const position = stringifyTokenPosition(fullPath, token, metaHeight);
        if (token.type === 'heading') {
          if (!token.children[0]) {
            throw new Error(`Unable to serialize html header from ${position}`);
          }
          const html = markdownTokenToHtml(token.children[0]);
          const id = generateHeadingId(html);
          legacyHeaderHashes[generateLegacyHeadingId(html)] = html;

          const tokenHead: HeadingToken = {
            type: 'heading',
            level: token.depth,
            route: resolveDirname(relativePath),
            id,
            html,
          };

          if (tokenHead.level === 2) {
            headings.push(tokenHead);
          }

          return tokenHead;
        }

        if (token.type === 'paragraph') {
          const child = token.children[0];
          if (child.type === 'text' && child.value.startsWith('@')) {
            const text = child.value;
            if (text.startsWith('@page ')) return null;
            if (text.startsWith('@#')) {
              const level: any = text.substring(1, text.indexOf(' ')).length;
              const html = text.substring(text.indexOf(' ') + 1);
              const id = generateHeadingId(html);
              legacyHeaderHashes[generateLegacyHeadingId(html)] = html;
              const tokenHead: HeadingToken = {
                type: 'heading',
                level,
                route: resolveDirname(relativePath),
                id,
                html,
              };

              if (tokenHead.level === 2) {
                headings.push(tokenHead);
              }

              return tokenHead;
            }
            if (text.startsWith('@example ')) {
              const fileName = text.substring('@example '.length);
              const documentDir = resolveDirname(fullPath);
              const filePath = resolvePath(documentDir, 'examples', `${fileName}.tsx`);
              if (!(await fsExists(filePath))) {
                throw new Error(`Unable to find "${fileName}" as ${filePath} from ${position}`);
              }
              const fileContent = await readFile(filePath, 'utf-8');
              dependencies.push(filePath);

              return {
                type: 'example',
                raw: fileContent,
                relativePath: [
                  relativePath.replace(/\/[\w-]+\..+/, ''),
                  'examples',
                  `${fileName}.tsx`,
                ].join('/'),
                filePath,
                load: `~~~%%%${filePath}%%%~~~`,
              };
            }
            if (text.startsWith('@import ')) {
              const [, fileName] = text.split(' ');
              const propsString = text.substring(`@import ${fileName} `.length);
              const props = propsString ? JSON.parse(propsString) : {};
              const documentDir = resolveDirname(fullPath);
              let filePath = resolvePath(documentDir, 'components', fileName);
              for (const extension of ['.jsx', '.tsx']) {
                if (await fsExists(filePath + extension)) {
                  filePath += extension;
                  break;
                }
              }
              dependencies.push(filePath);

              if (!(await fsExists(filePath))) {
                throw new Error(`Unable to find "${fileName}" as ${filePath} from ${position}`);
              }

              return {
                type: 'import',
                props,
                filePath,
                load: `~~~%%%${filePath}%%%~~~`,
              };
            }
            if (text.startsWith('@include ')) {
              const fileName = text.substring('@include '.length);
              const documentDir = resolveDirname(fullPath);
              const filePath = resolvePath(documentDir, `${fileName}.md`);
              if (!(await fsExists(filePath))) {
                throw new Error(`Unable to find "${fileName}" as ${filePath} from ${position}`);
              }

              const subArticle = await buildArticle(
                docsDir,
                filePath,
                resolveRelativePath(docsDir, filePath),
                existingRoutes,
              );

              dependencies.push(filePath, ...subArticle.dependencies);

              return subArticle.tokens;
            }
            if (text.startsWith('@embedded_video ')) {
              const link = token.children[1];
              if (link && link.type === 'link') {
                let { url } = link;

                if (url.startsWith('https://www.loom.com/share/')) {
                  url = `https://www.loom.com/embed/${url.substring(
                    'https://www.loom.com/share/'.length,
                  )}`;
                }
                if (url.startsWith('https://www.youtube.com/watch?v=')) {
                  const urlParams = new URLSearchParams(
                    url.substring('https://www.youtube.com/watch?'.length),
                  );
                  url = `https://www.youtube.com/embed/${urlParams.get('v')}`;
                }

                return {
                  type: 'embedded_video',
                  url,
                };
              }
            }
            if (text.startsWith('@email_html ')) {
              const paths = text.substring('@email_html '.length);
              const [compiledRelativePath, rawRelativePath] = paths.split(' ');
              const compiledPath = resolvePath(emailPackagePath, compiledRelativePath);
              const rawPath = resolvePath(emailPackagePath, rawRelativePath);

              for (const filePath of [compiledPath, rawPath]) {
                if (!(await fsExists(filePath))) {
                  throw new Error(`Unable to find "${filePath}" from ${position}`);
                }
              }
              dependencies.push(compiledPath, rawPath);
              const compiled = await readFile(compiledPath, 'utf-8');
              const raw = await readFile(rawPath, 'utf-8');

              return {
                type: 'email_html',
                raw,
                compiled,
              };
            }
            if (text.startsWith('@changelog ')) {
              const headingsChangelog = [];
              headings.push(headingsChangelog);

              const componentName = text.substring('@changelog '.length);
              const searchPattern = `*/${componentName}/CHANGELOG.md`;
              const files = (await glob(searchPattern, { cwd: repoRoot })).filter(
                (filePath) => !filePath.startsWith('node_modules'),
              );
              if (files.length !== 1) {
                if (files.length === 0) {
                  throw new Error(
                    `Unable to find changelog for "${componentName}" (searching for "${searchPattern}" from ${repoRoot}) from ${position}`,
                  );
                } else if (files.length > 1) {
                  const filesList = files.join(', ');
                  throw new Error(
                    `Unable to find changelog for "${componentName}" cause found multiple matching changelogs (${filesList}) from ${position}`,
                  );
                }
              }
              const filePath = resolvePath(repoRoot, files[0]);
              const changelogText = await readFile(filePath, 'utf-8');
              const markdownAst = parseMarkdown(changelogText);

              dependencies.push(filePath);

              if (componentName === 'ui') {
                const route = resolveDirname(relativePath);
                const blocks = makeChangelogByComponent(markdownAst, fullPath, metaHeight, route);
                blocks.forEach((block) => {
                  const tokenHead = {
                    type: 'heading',
                    level: block.level,
                    id: block.id,
                    html: block.title,
                  };
                  headingsChangelog.push(tokenHead);
                });

                return {
                  type: 'changelogByComponent',
                  blocks,
                };
              } else {
                const route = resolveDirname(relativePath);
                const blocks = makeChangelog(markdownAst, fullPath, metaHeight, route);
                blocks.forEach((block) => {
                  const tokenHead = {
                    type: 'heading',
                    level: block.level,
                    id: block.id,
                    html: block.title,
                  };
                  headingsChangelog.push(tokenHead);
                });

                return {
                  type: 'changelog',
                  blocks,
                };
              }
            }
            if (text.startsWith('@typescript ')) {
              const typingName = text.substring('@typescript '.length);
              const typing = await getRepoTyping(typingName, position);
              dependencies.push(...typing.dependencyFiles, typing.filepath);

              return {
                type: 'typescriptDeclaration',
                declaration: typing.declaration,
                dependencies: typing.dependencies,
                route: resolveDirname(relativePath),
              };
            }
            if (text.startsWith('@table-caption ')) {
              const nextToken = markdownAst.children[index + 1];
              if (nextToken.type !== 'table') {
                // rome-ignore lint/nursery/noConsoleLog:
                console.log(nextToken);
                throw new Error(
                  '@table-caption at-rule is only allowed right before tables, what was found see above',
                );
              }
              const caption = text.substring('@table-caption '.length);
              tokensMetadata.set(nextToken, { caption });

              return null;
            }
          }
        }

        return {
          type: 'text',
          html: markdownTokenToHtml(token, tokensMetadata.get(token)),
        };
      }),
    )
  )
    .filter((token) => token !== null)
    .flat();

  const sourcePath = relativePath.startsWith('./')
    ? relativePath.substring('./'.length)
    : relativePath;
  const beta = Boolean(meta.beta);

  return {
    tokens,
    title: meta.title,
    fileSource: meta.fileSource,
    sourcePath,
    beta,
    imagesUrls,
    legacyHeaderHashes,
    dependencies,
    headings: headings.flat(),
  };
};

export const serializeArticle = (pageData) => {
  const { tokens, title, fileSource, sourcePath, beta, legacyHeaderHashes, headings } = pageData;

  let stringified = JSON.stringify({
    tokens,
    headings,
    title,
    fileSource,
    sourcePath,
    beta,
    legacyHeaderHashes,
  });

  stringified = stringified.replace(/---------~~~~~~/g, '" + ');
  stringified = stringified.replace(/~~~~~~---------/g, ' + "');
  stringified = stringified.replace(/"~~~%%%/g, '() => import("');
  stringified = stringified.replace(/%%%~~~"/g, '")');

  return stringified;
};

export const bundleArticle = async (docsDir: string, relativePath: string) => {
  await typingsResolvingTask;

  const fullPath = resolvePath(docsDir, relativePath);

  const cache = await cacheManager.hasInCache(fullPath);

  if (cache) {
    return cache;
  }

  const pageData = await buildArticle(docsDir, fullPath, relativePath);

  const stringified = serializeArticle(pageData);
  const imageImports = Object.entries(pageData.imagesUrls)
    .map(([varName, url]) => `import ${varName} from "${url}";`)
    .join('\n');

  const contents = `${imageImports}\n\nconst page = ${stringified};\nexport default page;`;

  await cacheManager.addToCache(fullPath, contents, pageData.dependencies);

  return contents;
};

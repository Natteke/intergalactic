# Changelog

CHANGELOG.md standards are inspired by [keepachangelog.com](https://keepachangelog.com/en/1.0.0/).

## [4.4.1] - 2023-08-21

### Changed

- Version prepatch update due to children dependencies update (`@semcore/flex-box` [5.3.0 ~> 5.3.1], `@semcore/core` [2.3.0 ~> 2.3.1]).

## [4.4.0] - 2023-08-18

### Changed

- Version preminor update due to children dependencies update (`@semcore/utils` [4.2.0 ~> 4.3.0], `@semcore/flex-box` [5.2.1 ~> 5.3.0], `@semcore/core` [2.2.1 ~> 2.3.0]).

## [4.3.2] - 2023-08-18

### Changed

- Version prepatch update due to children dependencies update (`@semcore/neighbor-location` [4.2.0 ~> 4.2.1]).

## [4.3.1] - 2023-08-16

### Changed

- Version prepatch update due to children dependencies update (`@semcore/utils` [4.1.0 ~> 4.2.0], `@semcore/flex-box` [5.2.0 ~> 5.2.1], `@semcore/core` [2.2.0 ~> 2.2.1]).

## [4.3.0] - 2023-08-07

### Changed

- Version minor update due to children dependencies update (`@semcore/utils` [4.0.0 ~> 4.1.0], `@semcore/flex-box` [5.1.0 ~> 5.2.0]).

## [4.2.0] - 2023-08-01

### Changed

- Version minor update due to children dependencies update (`@semcore/flex-box` [5.0.0 ~> 5.1.0]).

## [4.1.0] - 2023-07-27

### Changed

- Use `event.key` instead of `event.code` for better support of non QWERTY keyboard layouts.

## [4.0.1] - 2023-07-24

### Fixed

- `Input` and `Input.Value` props strictness.

## [4.0.0] - 2023-07-17

### Break

- Strict, backward incompatible typings.

## [3.7.2] - 2023-06-30

## [3.7.1] - 2023-06-27

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.53.4 ~> 3.54.0], `@semcore/flex-box` [4.7.31 ~> 4.7.32]).

## [3.7.0] - 2023-06-22

### Changed

- Input now catches focus after keyboard events happened inside of the input container if no other element on page has focus.

## [3.6.32] - 2023-06-14

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.53.3 ~> 3.53.4], `@semcore/flex-box` [4.7.30 ~> 4.7.31]).

## [3.6.31] - 2023-06-12

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.53.2 ~> 3.53.3], `@semcore/flex-box` [4.7.29 ~> 4.7.30]).

## [3.6.30] - 2023-06-09

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.53.1 ~> 3.53.2], `@semcore/flex-box` [4.7.28 ~> 4.7.29]).

## [3.6.29] - 2023-06-07

### Changed

- Descend combobox related aria attributes from input wrapper to the input itself.

## [3.6.28] - 2023-05-31

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.52.0 ~> 3.53.0], `@semcore/flex-box` [4.7.26 ~> 4.7.27]).

## [3.6.27] - 2023-05-25

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.51.1 ~> 3.52.0], `@semcore/flex-box` [4.7.25 ~> 4.7.26]).

## [3.6.26] - 2023-05-24

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.51.0 ~> 3.51.1], `@semcore/flex-box` [4.7.24 ~> 4.7.25]).

## [3.6.25] - 2023-05-22

### Changed

- Updated border-color for invalid and valid states. Made them more contrast according to accessibility recommendations.

## [3.5.25] - 2023-05-11

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.50.6 ~> 3.50.7], `@semcore/flex-box` [4.7.22 ~> 4.7.23]).

## [3.5.24] - 2023-05-04

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.50.5 ~> 3.50.6], `@semcore/flex-box` [4.7.21 ~> 4.7.22]).

## [3.5.22] - 2023-04-28

### Fixed

- Moved paddings from container to `<Input.Value />` and `<Input.Addon />` to fix addons in inputs of large size.
- `<Input.Addon />` now automatically takes size of `<Input />`.
- Fixed right border duplication when last addon is build on top of `<Button />`.

## [3.5.20] - 2023-04-14

### Changed

- Fixed outline styles so that they work even if the `Value` is wrapped in other elements.

## [3.5.19] - 2023-04-14

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.49.1 ~> 3.50.2], `@semcore/flex-box` [4.7.17 ~> 4.7.19]).

## [3.5.8] - 2023-02-09

### Changed

- Renamed rounding design token (`--intergalactic-rounded-medium` -> `--intergalactic-control-rounded`).

## [3.5.7] - 2023-01-20

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.45.0 ~> 3.46.0], `@semcore/flex-box` [4.7.6 ~> 4.7.7]).

## [3.5.5] - 2023-01-10

## [3.5.4] - 2023-01-09

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.44.1 ~> 3.44.2], `@semcore/flex-box` [4.7.3 ~> 4.7.4]).

## [3.5.1] - 2022-12-13

### Changed

- Added `react-dom` to peer dependencies.

## [3.5.0] - 2022-12-12

### Added

- Design tokens based theming.

## [3.4.2] - 2022-12-06

### Added

- Added type `IInputCtx` for export.

## [3.4.1] - 2022-11-30

### Fixed

- Fix style for disabled state.

## [3.4.0] - 2022-11-30

### Changed

- Updated border-color in focus state from `--blue-400` to `--blue-500`, `--red-400` to `--red-500`, `--green-400` to `--green-500`.

## [3.3.1] - 2022-11-30

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.40.0 ~> 3.41.0], `@semcore/flex-box` [4.6.3 ~> 4.6.4]).

## [3.3.0] - 2022-11-17

### Added

- Added `aria-invalid` for input in invalid state.

## [3.2.3] - 2022-10-28

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.40.0 ~> 3.40.0], `@semcore/flex-box` [4.6.2 ~> 4.6.3]).

## [3.2.0] - 2022-10-10

### Changed

- Added support for React 18 🔥

## [3.1.0] - 2022-10-07

### Changed

- Updated major dependency `@semcore/neighbor-location` [2.3.15 ~> 3.0.0]
- Remove useless styles for Addons.

## [3.0.16] - 2022-10-04

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.37.1 ~> 3.37.2], `@semcore/flex-box` [4.5.11 ~> 4.5.12]).

## [3.0.14] - 2022-08-23

### Added

- Added missing type `defaultValue` in `index.d.ts`.

## [3.0.13] - 2022-08-18

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.36.0 ~> 3.37.0], `@semcore/flex-box` [4.5.9 ~> 4.5.10]).

## [3.0.10] - 2022-07-22

### Changed

- Fixed `Input.Addon` css classes were missing during server-side rendering.

## [3.0.9] - 2022-07-22

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.34.0 ~> 3.35.0], `@semcore/flex-box` [4.5.6 ~> 4.5.7]).

## [3.0.8] - 2022-07-14

### Fixed

- Fixed the reaction when interacting with the keyboard for the correct work of other components with keyboard support.

## [3.0.7] - 2022-07-13

### Fixed

- Fixed applying `border-radius` for outline.

## [3.0.6] - 2022-07-07

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.33.0 ~> 3.34.0], `@semcore/flex-box` [4.5.5 ~> 4.5.6]).

## [3.0.0] - 2022-05-17

### BREAK

- Updated styles according to the library redesign policy.
- Remove value "xl"/"s"" for "size".

## [2.2.5] - 2022-03-14

### Changed

- Version patch update due to children dependencies update (`@semcore/utils` [3.31.2 ~> 3.31.2], `@semcore/flex-box` [4.5.0 ~> 4.5.1]).

## [2.2.4] - 2022-02-24

### Added

- Added repository field to package.json file.

## [2.2.3] - 2021-12-23

### Changed

- Changed `line-height` from 1.2 to 1.1 for correct display in all browsers.

## [2.2.2] - 2021-8-26

### Changed

- Add 'sideEffect=false' for more optimal build via webpack

## [2.2.1] - 2021-08-18

### Fixed

- Changed height of the inner real input to fix horizontal display with adjacent elements.

## [2.2.0] - 2021-04-26

### Changed

- Version of dependence `@semcore/core` has been changed to `1.11`.
- Improved performance. Removed one component wrapper.
- The style processing system has been changed.
- Removed the ability to apply media styles via a plugin `babel-plugin-react-semcore`.

## [2.1.3] - 2021-04-16

### Changed

- Changed line-height value

## [2.1.2] - 2021-01-28

### Fixed

- Fixed type of second argument(event) for `onChange` prop

## [2.1.1] - 2020-12-17

### Added

- Added supported react@17.

## [2.0.3] - 2020-10-29

### Fixed

- Added the placeholder for ID style tag to improve collision protection.

## [2.0.2] - 2020-09-08

### Fixed

- Fixed possible styles collisions between components with different versions, but same styles

## [2.0.1] - 2020-07-13

### Changed

- Теперь z-index изменяется на +1 при фокусе, для правильного отображения бордера с соседними элементами.

## [2.0.0] - 2020-05-29

### BREAK

- Изменения описаны в [migration guide](/internal/migration-guide)

### Changed

- Изменился цвет Addon по ховеру, c 16% на 12%

## [1.7.1] - 2020-02-13

### Fixed

- Переименовали сбилженные файлы с 'sm.style.css' -> 'style.css'

## [1.7.0] - 2020-02-12

### Added

- Добавлена тема `sellerly`, фокус у контрола по умолчанию цвета `light-ultramarine`

## [1.6.2] - 2020-02-04

### Fixed

- `ref` компонента `Input` теперь возвращает ноду, а не инстанс класса

## [1.6.1] - 2019-12-17

### Fixed

- Исправлен транспайл цветовых переменных для стилей без префиксов (build.css)

## [1.6.0] - 2019-12-12

### Added

- Появилась возможность добавления различных стилистических тем через css переменные
- Появилась возможность оптицонально подключать адаптивноссть
- Появилась возможность изолировать стили даже в пределах одной страницы

### Changed

- Изменен алгоритм вставки стилей в head

### Removed

- Убраны относительные единицы измерения(rem), которые использовались для адаптивности

## [1.5.2] - 2019-11-28

### Changed

- переписан `Input.Value` на функцию с пробросом `ref`

## [1.5.1] - 2019-11-25

### Fixed

- Исправлен тип `size` для `Input.Value`

## [1.5.0] - 2019-11-14

### Added

- Добавлена адаптивность на маленьких экранах(<768px)

## [1.4.0] - 2019-10-11

### Added

- Добавлен `forwardRef` на компонент

## [1.3.2] - 2019-09-30

### Changed

- Нужные зависимости перенесены в `utils`, размер должен стать меньше

## [1.3.1] - 2019-08-21

### Fixed

- Исправлено отображение бордеров инпута при автозаполнении.

## [1.3.0] - 2019-08-07

### Added

- Добавлен `disabled` для `<Input.Addon/>`

## [1.2.4] - 2019-07-31

### Fixed

- Исправлена сборка для рендера css на сервере

### Changed

- Добавлен `line-height: 1;` для `Input.Value`

## [1.2.3] - 2019-07-05

### Fixed

- Убрана специфика у классов размера у `Addon`

## [1.2.2] - 2019-07-05

### Fixed

- Привели цвет placeholdre'a в соответствие с макетом

## [1.2.1] - 2019-06-25

### Changed

- Обновлена версия `@semcore/utils`

## [1.2.0] - 2019-06-24

### Fixed

- Исправлены ошибки в типизации
- Испавлен цвет disable placeholdre'a с gray70 на gray20 с .3 alpha

### Added

- `Input.Value` обернут в HOC `EnhancedWithAutoFocus`

### Changed

- Изменен цвет интерактивного аддона с `gray70` на `stone`
- Изменен цвет hover'a интерактивного аддона с `gray70 .3 alpha` на `stone .3 alpha`

## [1.1.1] - 2019-06-03

### Added

- Добавлено css-свойство `font-family: inherit;`

## [1.1.0] - 2019-05-14

### Added

- Добавлен `vertical-align: middle` для выравнивания с другими элементами формы

## [1.0.5] - 2019-04-01

### Fixed

- Исправлена не корректная верстка при использовании Addon для Firefox

## [1.0.4] - 2019-03-29

### Fixed

- Исправлены отступы у `Input.Addon`

## [1.0.3] - 2019-03-15

### Fixed

- Исправлено наследование интерфейса `Input.Addon`

## [1.0.2] - 2019-03-15

### Fixed

- стили для `Input.Addon`

## [1.0.1] - 2019-02-26

### Fixed

- Исправлена проблема с z-index

## [1.0.0] - 2019-01-18

### Added

- Initial release

import React from 'react';
import cx from 'classnames';
import styles from './Color.module.css';
import Copy from '../components/Copy';

import cssVariableFile from '!!raw-loader!@semcore/utils/style/var.css';

const cssVariable = Object.fromEntries(
  cssVariableFile
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('--') && line.endsWith(';'))
    .map((line) => {
      const [name, value] = line.split(': ');
      // remove ";"
      return [name, value.slice(0, -1)];
    }),
);

const Color = ({ name, className, ...other }) => {
  const varValue = cssVariable[name];
  const value = varValue || name;

  return (
    <Copy
      toCopy={varValue ? `${name}: ${value}` : value}
      title={
        <span>
          Click to copy:
          <br />
          {varValue ? `${name}: "${value}"` : value}
        </span>
      }
    >
      <span
        className={cx(styles.paintedElement, className)}
        {...other}
        value={value}
        style={{ ...(other.style ?? {}), backgroundColor: value }}
      />
    </Copy>
  );
};

export default Color;

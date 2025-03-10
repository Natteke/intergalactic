import React, { useState } from 'react';
import Button from '@semcore/button';
import { Flex } from '@semcore/flex-box';
import Checkbox from '@semcore/checkbox';
import fire from '@semcore/utils/lib/fire';
import Input from '@semcore/input';
import Select from '@semcore/select';
import CopyM from '@semcore/icon/Copy/m';
import Radio, { RadioGroup } from '@semcore/radio';
import Pills from '@semcore/pills';
import { createPlayground, Playground } from '../components/playground';
import Code from '../components/Code';
import Copy from '../components/Copy';
import styles from './PlaygroundGeneration.module.css';
import { ThemeProvider } from '@semcore/utils/lib/ThemeProvider';
import lightThemeTokens from '@semcore/utils/lib/themes/light.json';
import darkThemeTokens from '@semcore/utils/lib/themes/dark.json';

Playground.createWidget('empty', () => {
  return null;
});

Playground.createWidget(
  'boolBtn',
  ({ value, onChange, label, positiveLabel, negativeLabel, ...others }) => {
    return (
      <label className={styles.field}>
        <div className={styles.control}>
          <Button w='100%' onClick={() => onChange(!value)} theme='hollow' type='muted' {...others}>
            {(value ? positiveLabel : negativeLabel) || label}
          </Button>
        </div>
      </label>
    );
  },
);

Playground.createWidget(
  'bool',
  ({ value, onChange, label, positiveLabel, negativeLabel, ...others }) => {
    return (
      <label className={styles.field}>
        <div className={styles.label}>{(value ? positiveLabel : negativeLabel) || label}</div>
        <div className={styles.control}>
          <Checkbox>
            <Checkbox.Value checked={value} onChange={() => onChange(!value)} {...others} />
          </Checkbox>
        </div>
      </label>
    );
  },
);

Playground.createWidget(
  'text',
  ({ value, onChange, label, positiveLabel, negativeLabel, ...others }) => {
    return (
      <label className={styles.field}>
        <div className={styles.label}>{(value ? positiveLabel : negativeLabel) || label}</div>
        <div className={styles.control}>
          <Input>
            <Input.Value checked={value} value={value} onChange={(v) => onChange(v)} {...others} />
          </Input>
        </div>
      </label>
    );
  },
);

Playground.createWidget(
  'select',
  ({ value, onChange, label, options, positiveLabel, negativeLabel, ...others }) => {
    return (
      <label className={styles.field}>
        <div className={styles.label}>{(value ? positiveLabel : negativeLabel) || label}</div>
        <div className={styles.control}>
          <Select value={value} onChange={(value) => onChange(value)} {...others}>
            <Select.Trigger />
            <Select.Menu>
              {options.map((o, i) => {
                const option = typeof o === 'string' ? { value: o, name: o } : o;
                return (
                  <Select.Option key={option.name} value={option.value}>
                    {option.name}
                  </Select.Option>
                );
              })}
            </Select.Menu>
          </Select>
        </div>
      </label>
    );
  },
);

Playground.createWidget(
  'radio',
  ({ value, onChange, label, options, positiveLabel, negativeLabel, ...others }) => {
    return (
      <label className={styles.field} htmlFor=''>
        <div className={styles.label}>{(value ? positiveLabel : negativeLabel) || label}</div>
        <div className={styles.control}>
          <Pills value={value} onChange={(value) => onChange(value)} behavior='radio' {...others}>
            {options.map((o, i) => {
              const option = typeof o !== 'object' ? { value: o, name: o } : o;
              return (
                <Pills.Item key={option.name} value={option.value}>
                  {String(option.name)}
                </Pills.Item>
              );
            })}
          </Pills>
        </div>
      </label>
    );
  },
);

const PaintPlaygroundView = ({ backgroundColor, onChange, ...other }) => {
  const [color, setColor] = useState(backgroundColor || 'white');

  return (
    <RadioGroup
      aria-hidden='true'
      name='background-color'
      value={color}
      onChange={(color) => {
        setColor(color);
        onChange(color);
      }}
    >
      <Flex
        alignItems='center'
        style={{ position: 'absolute', right: '16px', bottom: '16px' }}
        {...other}
      >
        <Radio mr={2}>
          <Radio.Value style={{ display: 'none' }} value='white' checked={color === 'white'} />
          <div
            className={styles.chooseBackgroundColor}
            style={{
              backgroundColor: 'white',
              borderColor: color === 'white' ? '#2595e4' : '#e3e3e3',
            }}
          />
        </Radio>
        <Radio>
          <Radio.Value style={{ display: 'none' }} value='#1E2231' checked={color === '#1E2231'} />
          <div
            className={styles.chooseBackgroundColor}
            style={{
              backgroundColor: '#1E2231',
              borderColor: color === '#1E2231' ? '#2595e4' : '#e3e3e3',
            }}
          />
        </Radio>
      </Flex>
    </RadioGroup>
  );
};

class PlaygroundView extends React.Component {
  static defaultProps = {
    LayoutPreview: (props) => <div {...props} />,
  };

  constructor(props) {
    super(props);
    this.state = { backgroundColor: props.backgroundColor || 'white' };
  }

  onChangeBackground = (color) => {
    fire(this, 'onChange', color);
    this.setState({ backgroundColor: color });
  };

  render() {
    const { result, source, widgetControls, LayoutPreview } = this.props;
    const { backgroundColor } = this.state;

    const hasWidget = !!widgetControls.length;

    return (
      <div className={styles.wrapperPlayground} aria-hidden='true'>
        <div
          className={styles.workArea}
          style={{ width: !hasWidget ? '100%' : '70%', backgroundColor }}
        >
          <ThemeProvider tokens={backgroundColor === 'white' ? lightThemeTokens : darkThemeTokens}>
            <div className={styles.resultView} style={{ backgroundColor }}>
              <LayoutPreview>{result}</LayoutPreview>
              <PaintPlaygroundView
                backgroundColor={backgroundColor}
                onChange={this.onChangeBackground}
              />
            </div>
          </ThemeProvider>
          <div className={styles.resultCode}>
            <Code lang='jsx' block>
              {source}
            </Code>
            <div className={styles.iconCopy}>
              <Copy toCopy={source} title='Click to copy code'>
                <CopyM />
              </Copy>
            </div>
          </div>
        </div>
        {hasWidget ? (
          <div
            className={styles.widgetsBar}
            ref={(node) => {
              this.container = node;
            }}
          >
            {widgetControls.map((control, i) => {
              return (
                <div className={styles.widgetGroup} key={i}>
                  {control.widgets}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default createPlayground(PlaygroundView);

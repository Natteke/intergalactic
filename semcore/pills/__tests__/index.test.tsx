import React from 'react';
import { snapshot } from '@semcore/testing-utils/snapshot';
import { expect, test, describe, beforeEach, vi } from '@semcore/testing-utils/vitest';
import Globe from '@semcore/icon/Globe/m';
import Badge from '@semcore/badge';

import { render, fireEvent, cleanup, act } from '@semcore/testing-utils/testing-library';
import { axe } from '@semcore/testing-utils/axe';

import Pills from '../src';
import { Intergalactic } from '@semcore/core';
import { assertType } from 'vitest';

describe('PillGroup', () => {
  describe('types', () => {
    const any: any = null;
    test('props nesting', () => {
      const Link: Intergalactic.Component<'a', { xProp1: 1 }> = any;

      assertType<JSX.Element>(<Pills tag={Link} href='https://google.com' xProp1={1} />);
      // @ts-expect-error
      assertType<JSX.Element>(<Pills href='https://google.com' />);
    });
    test('value&onChange relation', () => {
      assertType<JSX.Element>(<Pills value={1} onChange={(value: number) => {}} />);
      // @ts-expect-error
      assertType<JSX.Element>(<Pills value={1} onChange={(value: string) => {}} />);
    });
  });

  beforeEach(cleanup);

  test.concurrent('Should support onChange callback', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <Pills value={1 as number} onChange={spy}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>1</Pills.Item>
        <Pills.Item value={3}>1</Pills.Item>
        <Pills.Item value={4} data-testid={'tab-4'}>
          1
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Should support onClick on Pill', () => {
    const spy = vi.fn();
    const { getByTestId } = render(
      <Pills value={1}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>1</Pills.Item>
        <Pills.Item value={3}>1</Pills.Item>
        <Pills.Item value={4} onClick={spy} data-testid={'tab-4'}>
          1
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Should not call PillGroup onChange after falsy onClick on Pill', () => {
    const spy = vi.fn();
    const spyClick = vi.fn(() => false);
    const { getByTestId } = render(
      <Pills value={1} onChange={spy}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>2</Pills.Item>
        <Pills.Item value={3}>3</Pills.Item>
        <Pills.Item value={4} data-testid={'tab-4'} onClick={spyClick}>
          4
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spyClick).toHaveBeenCalledTimes(1);
  });

  test('Should not support clicks on disabled tab', () => {
    const spy = vi.fn();

    const { getByTestId } = render(
      <Pills value={1} onChange={spy}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>3</Pills.Item>
        <Pills.Item value={3}>4</Pills.Item>
        <Pills.Item value={3} data-testid={'tab-4'} disabled>
          4
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test.concurrent('Should support behavior=tabs', async () => {
    const spyLeft = vi.fn();
    const spyRight = vi.fn();

    const { getByTestId } = render(
      <Pills behavior='tabs'>
        <Pills.Item value={1} onFocus={spyLeft}>
          1
        </Pills.Item>
        <Pills.Item data-testid={'pill'} value={2}>
          2
        </Pills.Item>
        <Pills.Item value={3} onFocus={spyRight}>
          3
        </Pills.Item>
      </Pills>,
    );
    const pill = getByTestId('pill');

    act(() => pill.focus());
    fireEvent.keyDown(pill, { key: 'ArrowRight' });
    expect(spyRight).toHaveBeenCalledTimes(1);

    act(() => pill.focus());
    fireEvent.keyDown(pill, { key: 'ArrowLeft' });
    expect(spyLeft).toHaveBeenCalledTimes(1);
  });

  test('Should support behavior=radio', async () => {
    const spy = vi.fn();

    const { getByTestId } = render(
      <Pills behavior='radio' onChange={spy} value={2}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item data-testid={'pill'} value={2}>
          2
        </Pills.Item>
        <Pills.Item value={3}>3</Pills.Item>
      </Pills>,
    );
    const pill = getByTestId('pill');

    fireEvent.keyDown(pill, { key: 'ArrowLeft' });
    expect(spy).toBeCalledWith(1, expect.anything());

    fireEvent.keyDown(pill, { key: 'ArrowRight' });
    expect(spy).toBeCalledWith(3, expect.anything());
  });

  test.concurrent('Should render correctly states', async ({ task }) => {
    const component = (
      <snapshot.ProxyProps style={{ margin: 5 }}>
        <Pills value={1}>
          <Pills.Item value={1}>1</Pills.Item>
          <Pills.Item value={2} keyboardFocused>
            2
          </Pills.Item>
        </Pills>
        <Pills value={1}>
          <Pills.Item value={1} keyboardFocused>
            1
          </Pills.Item>
          <Pills.Item value={2}>2</Pills.Item>
        </Pills>
        <Pills>
          <Pills.Item value={1}>1</Pills.Item>
          <Pills.Item value={2} disabled>
            2
          </Pills.Item>
        </Pills>
      </snapshot.ProxyProps>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('should support additional elements as props', async ({ task }) => {
    const Addon = React.forwardRef(function ({ forwardRef, Children, Root, ...p }: any, ref) {
      return (
        <span ref={ref} {...p}>
          Addon prop
        </span>
      );
    });
    const component = (
      <Pills value={0}>
        <Pills.Item value={1} addonLeft={Addon} addonRight={Addon}>
          Text
        </Pills.Item>
        <Pills.Item value={2}>
          <Pills.Item.Addon tag={Addon} />
          <Pills.Item.Text>Text</Pills.Item.Text>
          <Pills.Item.Addon tag={Addon} />
        </Pills.Item>
      </Pills>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should support hover', async ({ task }) => {
    await expect(
      await snapshot(
        <Pills>
          <Pills.Item id='item'>Item 1</Pills.Item>
          <Pills.Item>Item 2</Pills.Item>
        </Pills>,
        {
          actions: {
            hover: '#item',
          },
        },
      ),
    ).toMatchImageSnapshot(task);
    await expect(
      await snapshot(
        <Pills>
          <Pills.Item id='item' selected>
            Item 1
          </Pills.Item>
          <Pills.Item>Item 2</Pills.Item>
        </Pills>,
        {
          actions: {
            hover: '#item',
          },
        },
      ),
    ).toMatchImageSnapshot(task);
  });

  test.concurrent('Should support size with Addon', async ({ task }) => {
    const PillsSize = ({ size }: any) => (
      <Pills size={size}>
        <Pills.Item>
          <Pills.Item.Addon>
            <Globe />
          </Pills.Item.Addon>
          <Pills.Item.Text>Item 1</Pills.Item.Text>
          <Pills.Item.Addon>
            <Badge bg='orange'>beta</Badge>
          </Pills.Item.Addon>
        </Pills.Item>
        <Pills.Item>
          <Pills.Item.Addon>
            <Globe />
          </Pills.Item.Addon>
          <Pills.Item.Text>Item 2</Pills.Item.Text>
        </Pills.Item>
        <Pills.Item>
          <Pills.Item.Text>Item 3</Pills.Item.Text>
          <Pills.Item.Addon>
            <Badge bg='orange'>beta</Badge>
          </Pills.Item.Addon>
        </Pills.Item>
        <Pills.Item>Item 4</Pills.Item>
        <Pills.Item>
          <Globe />
        </Pills.Item>
      </Pills>
    );

    await expect(await snapshot(<PillsSize size='m' />)).toMatchImageSnapshot(task);
    await expect(await snapshot(<PillsSize size='l' />)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should correct render for different number Items', async ({ task }) => {
    const component = (
      <snapshot.ProxyProps style={{ margin: 5 }}>
        <Pills>
          <Pills.Item value={1}>1</Pills.Item>
        </Pills>
        <Pills>
          <Pills.Item value={1}>1</Pills.Item>
          <Pills.Item value={2}>2</Pills.Item>
        </Pills>
        <Pills>
          <Pills.Item value={1}>1</Pills.Item>
          <Pills.Item value={2}>2</Pills.Item>
          <Pills.Item value={3}>3</Pills.Item>
        </Pills>
      </snapshot.ProxyProps>
    );

    await expect(await snapshot(component)).toMatchImageSnapshot(task);
  });

  test.concurrent('Should correct render for alone Item, Item.Addon', async ({ task }) => {
    const PillsSize = ({ size }: any) => (
      <>
        <Pills size={size}>
          <Pills.Item value={1}>
            <Pills.Item.Addon tag={Globe} />
          </Pills.Item>
        </Pills>
        <br />
        <Pills size={size}>
          <Pills.Item value={1}>Pill</Pills.Item>
        </Pills>
      </>
    );

    await expect(await snapshot(<PillsSize size='m' />)).toMatchImageSnapshot(task);
    await expect(await snapshot(<PillsSize size='l' />)).toMatchImageSnapshot(task);
  });

  test('a11y', async () => {
    const { getByTestId, container } = render(
      <Pills value={1}>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>2</Pills.Item>
        <Pills.Item value={3}>3</Pills.Item>
        <Pills.Item value={4} data-testid='tab-4'>
          4
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('a11y behavior radio', async () => {
    const { getByTestId, container } = render(
      <Pills value={1} behavior='radio'>
        <Pills.Item value={1}>1</Pills.Item>
        <Pills.Item value={2}>2</Pills.Item>
        <Pills.Item value={3}>3</Pills.Item>
        <Pills.Item value={4} data-testid='tab-4'>
          4
        </Pills.Item>
      </Pills>,
    );

    fireEvent.click(getByTestId('tab-4'));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

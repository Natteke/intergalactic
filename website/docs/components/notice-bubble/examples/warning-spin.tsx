import React from 'react';
import { NoticeBubbleContainer, NoticeBubbleManager } from '@semcore/ui/notice-bubble';
import Button from '@semcore/ui/button';
import Spin from '@semcore/ui/spin';

const manager = new NoticeBubbleManager();

const Demo = () => {
  const handleClick = () => {
    manager.add({
      icon: <Spin size='xs' theme='invert' />,
      children: 'Server connection lost. Reconnecting...',
      type: 'warning',
      initialAnimation: true,
      duration: 3000,
    });
  };

  return (
    <>
      <Button onClick={handleClick}>Show no connection notice</Button>
      <NoticeBubbleContainer manager={manager} />
    </>
  );
};
export default Demo;

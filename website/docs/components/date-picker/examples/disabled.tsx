import React from 'react';
import { DatePicker } from '@semcore/ui/date-picker';

const Demo = () => {
  const today = new Date();
  return (
    <DatePicker disabled={[new Date(today.getFullYear(), 0, 1), [today, false], '* * 6,7']}>
      <DatePicker.Trigger />
      <DatePicker.Popper />
    </DatePicker>
  );
};

export default Demo;

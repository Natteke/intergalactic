import React, { useState } from 'react';
import Button from '@semcore/ui/button';
import { colors, Plot, Venn } from '@semcore/ui/d3-chart';
import { Flex } from '@semcore/ui/flex-box';

const orders = [
  (val1, val2) => val2.radius - val1.radius,
  (val1, val2) => val1.radius - val2.radius,
];

const orientations = [Math.PI / 2, Math.PI];

export default () => {
  const [orientation, setOrientation] = useState(0);
  const [order, setOrder] = useState(0);

  return (
    <Flex alignItems='center' direction='column'>
      <Plot height={300} width={400} data={data}>
        <Venn orientation={orientations[orientation]} orientationOrder={orders[order]}>
          <Venn.Circle dataKey='F' name='F' />
          <Venn.Circle dataKey='S' name='S' color={colors['blue-03']} />
          <Venn.Intersection dataKey='F/S' name='F/S' />
        </Venn>
      </Plot>
      <Flex direction='row'>
        <Button onClick={() => setOrientation(Number(!orientation))} mr={2}>
          Change orientation
        </Button>
        <Button onClick={() => setOrder(Number(!order))}>Change order</Button>
      </Flex>
    </Flex>
  );
};

const data = {
  F: 5,
  S: 7,
  'F/S': 3,
};

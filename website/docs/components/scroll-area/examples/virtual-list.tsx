import React, { useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import ScrollArea from '@semcore/ui/scroll-area';
import { Box, Flex } from '@semcore/ui/flex-box';
import { Text } from '@semcore/ui/typography';
import Button from '@semcore/ui/button';
import { List } from 'react-virtualized';

const Block = styled.div`
  display: inline-flex;
  width: 120px;
  height: 120px;
  border: 1px solid black;
`;

const list = [...new Array(6)];
const renderRow = ({ key, index, style }) => {
  return (
    <Block key={key} style={style}>
      <Text bold size={200} m='auto'>
        {index + 1}
      </Text>
    </Block>
  );
};

const Demo = () => {
  const [data, setData] = useState(list);
  const innerRef = useRef();
  const ref = (node) => {
    node = findDOMNode(node);
    if (node) {
      innerRef.current = node.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
    }
  };

  return (
    <Flex direction='column' inline>
      <Flex alignItems='center' mb={2}>
        <Button
          onClick={() => {
            setData(data.concat(undefined));
          }}
        >
          ADD
        </Button>
        <Button ml='10px' onClick={() => setData(data.slice(0, -1))}>
          REMOVE
        </Button>
        <Text bold ml='10px'>
          Count: {data.length}
        </Text>
      </Flex>
      <Box h={500}>
        {data.length ? (
          <ScrollArea inner={innerRef}>
            <ScrollArea.Container
              ref={ref}
              tag={List}
              height={500}
              rowCount={data.length}
              width={500}
              rowHeight={120}
              rowRenderer={renderRow}
            />
            <ScrollArea.Bar orientation='vertical' />
          </ScrollArea>
        ) : null}
      </Box>
    </Flex>
  );
};

export default Demo;

import React from 'react';
import styled from 'styled-components';
import Scroll from '@semcore/ui/scroll-area';

const Block = styled.div`
  display: inline-block;
  margin: 10px;
  width: 120px;
  height: 120px;
  background-color: ${() => getRandomColor()};
`;

let randomIndex = 1;
const stableRandom = () =>
  Math.abs(Math.sin(Math.exp(Math.PI * randomIndex * Math.cos(100 - randomIndex++))));
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(stableRandom() * 16)];
  }
  return color;
}

class Demo extends React.PureComponent {
  render() {
    return (
      <Scroll h={300}>
        {[...new Array(100)].map((_, index) => (
          <Block ind={index} key={index} />
        ))}
      </Scroll>
    );
  }
}

export default Demo;

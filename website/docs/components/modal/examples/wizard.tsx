import React from 'react';
import Modal from '@semcore/ui/modal';
import Button from '@semcore/ui/button';
import { Flex } from '@semcore/ui/flex-box';
import { Text } from '@semcore/ui/typography';
import CloseM from '@semcore/ui/icon/Close/m';
import CheckM from '@semcore/ui/icon/Check/m';
import ChevronRightM from '@semcore/ui/icon/ChevronRight/m';
import ChevronLeftM from '@semcore/ui/icon/ChevronLeft/m';
import styled from 'styled-components';

const MAP_NAVIGATION = {
  1: 'Domain settings',
  2: 'Device and Location',
  3: 'Competitors',
  4: 'Keywords',
};

const Tab = styled(Flex)`
  cursor: pointer;
  box-shadow: inset -12px 0 20px -16px rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid #fff;
  &:last-child {
    border-bottom: 0;
  }
  ${({ selected }) => (selected ? 'background: #fff; color: #333;' : 'color: #fff')};
`;

const NavigationItem = ({ onClick, value, stepNavigation }) => (
  <Tab
    onClick={onClick}
    selected={value === stepNavigation}
    p='12px 10px 12px 0'
    alignItems='center'
  >
    <Flex w='40px' h='16px' inline justifyContent='center' alignItems='center'>
      {stepNavigation === value ? <CheckM /> : value}
    </Flex>
    <Text size={200}>{MAP_NAVIGATION[value]}</Text>
  </Tab>
);

class Demo extends React.PureComponent {
  state = { visible: false, stepNavigation: 1 };
  onVisibleChange = (visible) => this.setState({ visible });
  closeModal = () => this.onVisibleChange(false);
  openModal = () => this.onVisibleChange(true);

  updateStepNavigation = (step) => {
    MAP_NAVIGATION[step] && this.setState({ stepNavigation: step });
  };

  handleItemClick = (value) => () => {
    this.setState({ stepNavigation: value });
  };

  render() {
    const { visible, stepNavigation } = this.state;

    return (
      <React.Fragment>
        <Button use='primary' onClick={this.openModal}>
          Open Wizard
        </Button>
        <Modal
          visible={visible}
          onClose={this.closeModal}
          closable={false}
          p={0}
          wMax={800}
          wMin={400}
          w='100%'
        >
          <Flex
            direction='column'
            style={{
              position: 'absolute',
              top: '40px',
              left: '-160px',
              width: '160px',
              background: '#64787E',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
            }}
          >
            <NavigationItem
              onClick={this.handleItemClick(1)}
              value={1}
              stepNavigation={stepNavigation}
            />
            <NavigationItem
              onClick={this.handleItemClick(2)}
              value={2}
              stepNavigation={stepNavigation}
            />
            <NavigationItem
              onClick={this.handleItemClick(3)}
              value={3}
              stepNavigation={stepNavigation}
            />
            <NavigationItem
              onClick={this.handleItemClick(4)}
              value={4}
              stepNavigation={stepNavigation}
            />
          </Flex>

          <Flex
            alignItems='center'
            justifyContent='space-between'
            h={40}
            style={{
              background: '#2074b2',
              color: '#fff',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <span />
            <Text size={200}>POSITION TRACKING SETTINGS</Text>
            <CloseM
              title='Close'
              onClick={() => this.closeModal()}
              mr={2}
              style={{ cursor: 'pointer' }}
            />
          </Flex>
          <Flex direction='column' p='16px 32px 32px'>
            <Text size={500}>{MAP_NAVIGATION[stepNavigation]}</Text>
            <Flex
              h='200px'
              w='100%'
              style={{ background: '#ccc' }}
              justifyContent='center'
              alignItems='center'
            >
              <Text size={500}>Content</Text>
            </Flex>
            <Flex justifyContent='space-between' mt={4}>
              <Text
                size={200}
                color='light-blue'
                style={{ cursor: 'pointer' }}
                onClick={() => this.updateStepNavigation(stepNavigation - 1)}
              >
                {MAP_NAVIGATION[stepNavigation - 1] && (
                  <ChevronLeftM mr={1} style={{ verticalAlign: 'middle' }} />
                )}
                {MAP_NAVIGATION[stepNavigation - 1]}
              </Text>

              <Text
                size={200}
                color='light-blue'
                style={{ cursor: 'pointer' }}
                onClick={() => this.updateStepNavigation(stepNavigation + 1)}
              >
                {MAP_NAVIGATION[stepNavigation + 1]}
                {MAP_NAVIGATION[stepNavigation + 1] && (
                  <ChevronRightM ml={1} style={{ verticalAlign: 'middle' }} />
                )}
              </Text>
            </Flex>
          </Flex>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Demo;

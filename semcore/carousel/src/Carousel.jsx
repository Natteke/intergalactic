import React, { useEffect } from 'react';
import createComponent, { Component, sstyled, Root } from '@semcore/core';

import { Box } from '@semcore/flex-box';
import ChevronRight from '@semcore/icon/ChevronRight/l';
import ChevronLeft from '@semcore/icon/ChevronLeft/l';
import uniqueIDEnhancement from '@semcore/utils/lib/uniqueID';
import i18nEnhance from '@semcore/utils/lib/enhances/i18nEnhance';
import { localizedMessages } from './translations/__intergalactic-dynamic-locales';

import style from './style/carousel.shadow.css';

const position = {
  getItemMin: function (items) {
    let indexItem = 0;
    items.forEach(function (item, index) {
      if (item.position < items[indexItem].position) {
        indexItem = index;
      }
    });
    return indexItem;
  },
  getItemMax: function (items) {
    let indexItem = 0;
    items.forEach(function (item, index) {
      if (item.position > items[indexItem].position) {
        indexItem = index;
      }
    });
    return indexItem;
  },
  getMin: function (items) {
    return items[position.getItemMin(items)].position;
  },
  getMax: function (items) {
    return items[position.getItemMax(items)].position;
  },
};

const MAP_TRANSFORM = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

class CarouselRoot extends Component {
  static displayName = 'Carousel';
  static defaultProps = {
    defaultIndex: 0,
    duration: 350,
    step: 100,
    bounded: false,
    i18n: localizedMessages,
    locale: 'en',
  };

  static style = style;
  static enhance = [uniqueIDEnhancement(), i18nEnhance(localizedMessages)];

  refContainer = React.createRef();
  transform = 0;
  positionLeftItem = 0;
  indexIndicator = 0;

  constructor(props) {
    super(props);
    this.isControlled = props.index !== undefined;
    this.state = {
      items: [],
    };
  }

  uncontrolledProps() {
    return {
      index: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { index } = this.asProps;
    if (prevProps.index !== index && this.isControlled) {
      this.slideToValue(prevProps.index, index);
    }
  }

  handlerKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        e.preventDefault();
        const { activeItemIndex } = this.controlTransformItem(MAP_TRANSFORM[e.key]);
        this.handlers.index(activeItemIndex);
      }
    }
  };

  toggleItem = (item, removeItem = false) => {
    const { index } = this.asProps;
    const { items } = this.state;
    if (removeItem) {
      this.updateItems(items.filter((element) => element.node !== item.node));
    } else {
      this.setState(
        (state) => {
          return {
            items: [...state.items, item].map((element, position) => ({
              ...element,
              position,
              transform: 0,
            })),
          };
        },
        () => {
          const { items } = this.state;
          if (items.length > index && index >= 0) {
            this.slideToValue(this.indexIndicator, index);
          }
        },
      );
    }
  };

  updateItems = (items) => {
    this.setState(() => ({ items }));
  };

  transformContainer = (transform) => {
    if (this.refContainer.current) {
      this.refContainer.current.style.transform = `translateX(${transform}%)`;
    }
  };

  getDirection = (currentIndex, nextIndex, bounded) => {
    if (bounded) {
      return currentIndex < nextIndex ? 'right' : 'left';
    }
    const { items } = this.state;
    const listIndex = items.map((_, ind) => ind);
    const tmpArr = [...listIndex];
    const minTmpArr = tmpArr[0];
    const maxTmpArr = tmpArr[tmpArr.length - 1];

    if (tmpArr.length === 2) {
      return currentIndex < nextIndex ? 'right' : 'left';
    }
    if (currentIndex === minTmpArr) {
      tmpArr.unshift(maxTmpArr);
      tmpArr.pop();
    }
    if (currentIndex === maxTmpArr) {
      tmpArr.shift();
      tmpArr.push(minTmpArr);
    }

    const tmpCurrentIndex = tmpArr.indexOf(currentIndex);
    const left = tmpArr.indexOf(nextIndex);

    return left - tmpCurrentIndex < 0 ? 'left' : 'right';
  };

  slideToValue = (currentIndex, nextIndexItem, bounded) => {
    if (currentIndex === nextIndexItem) return false;
    const direction = this.getDirection(
      currentIndex,
      nextIndexItem,
      bounded || this.asProps.bounded,
    );
    let i = currentIndex;
    while (nextIndexItem !== i) {
      const { activeItemIndex } = this.transformItem(direction);
      i = activeItemIndex;
    }
  };

  controlTransformItem = (direction) => {
    const { bounded, index } = this.asProps;
    const { items } = this.state;
    const maxIndexIndicator = items.length - 1;

    if (this.isControlled) {
      if (direction === 'right') {
        if (bounded && index === maxIndexIndicator) {
          return { activeItemIndex: maxIndexIndicator };
        }
        return { activeItemIndex: index === maxIndexIndicator ? 0 : index + 1 };
      }
      if (direction === 'left') {
        if (bounded && index === 0) {
          return { activeItemIndex: 0 };
        }
        return { activeItemIndex: index === 0 ? maxIndexIndicator : index - 1 };
      }
    }
    return this.transformItem(direction);
  };

  transformItem = (direction) => {
    const { bounded, step } = this.asProps;
    const { items } = this.state;
    const maxIndexIndicator = items.length - 1;
    let nextItemPosition = undefined;

    if (direction === 'right') {
      if (bounded && this.positionLeftItem === maxIndexIndicator) {
        return { activeItemIndex: maxIndexIndicator };
      }
      this.positionLeftItem += 1;
      const positionItemMax = position.getMax(items);

      if (this.positionLeftItem > positionItemMax) {
        nextItemPosition = position.getItemMin(items);
        items[nextItemPosition].position = positionItemMax + 1;
        items[nextItemPosition].transform += items.length * step;
        this.updateItems([...items]);
      }

      this.indexIndicator += 1;
      if (this.indexIndicator > maxIndexIndicator) {
        this.indexIndicator = 0;
      }
      this.transform -= step;
    }
    if (direction === 'left') {
      if (bounded && this.positionLeftItem === 0) {
        return { activeItemIndex: 0 };
      }
      this.positionLeftItem -= 1;
      const positionItemMin = position.getMin(items);

      if (this.positionLeftItem < positionItemMin) {
        nextItemPosition = position.getItemMax(items);
        items[nextItemPosition].position = positionItemMin - 1;
        items[nextItemPosition].transform -= items.length * step;
        this.updateItems([...items]);
      }

      this.indexIndicator -= 1;
      if (this.indexIndicator < 0) {
        this.indexIndicator = maxIndexIndicator;
      }
      this.transform += step;
    }

    const activeItemIndex = items.findIndex((item) => item.position === this.positionLeftItem);
    if (items[activeItemIndex]) {
      items[
        activeItemIndex
      ].node.style.transform = `translateX(${items[activeItemIndex].transform}%)`;
    }
    this.transformContainer(this.transform);
    return { activeItemIndex };
  };

  bindHandlerClick = (direction) => {
    return () => {
      const { activeItemIndex } = this.controlTransformItem(direction);
      this.handlers.index(activeItemIndex);
    };
  };

  bindHandlerClickIndicator = (value) => {
    return () => {
      !this.isControlled && this.slideToValue(this.indexIndicator, value, true);
      this.handlers.index(value);
    };
  };

  handlerTouchStart = (e) => {
    this._touchStartCoord = e.changedTouches[0].clientX;
  };

  handlerTouchEnd = (e) => {
    const touchEndCoord = e.changedTouches[0].clientX;
    const delta = touchEndCoord - this._touchStartCoord;
    if (delta > 50) {
      const { activeItemIndex } = this.controlTransformItem('left');
      this.handlers.index(activeItemIndex);
    } else if (delta < -50) {
      const { activeItemIndex } = this.controlTransformItem('right');
      this.handlers.index(activeItemIndex);
    }
  };

  getContainerProps() {
    const { duration } = this.asProps;

    return {
      ref: this.refContainer,
      duration,
    };
  }

  getItemProps(_, index) {
    return {
      toggleItem: this.toggleItem,
      uid: this.asProps.uid,
      index,
      current: index === this.asProps.index,
    };
  }

  bindHandlerKeydownControl = (direction) => (e) => {
    const { key } = e;
    if (key === 'Enter') {
      e.preventDefault();
      this.bindHandlerClick(direction)();
    }
  };

  getPrevProps() {
    const { index, bounded, getI18nText } = this.asProps;
    const { items } = this.state;
    let disabled = false;
    if (items.length && bounded) {
      disabled = index === 0;
    }
    return {
      onClick: this.bindHandlerClick('left'),
      onKeyDown: this.bindHandlerKeydownControl('left'),
      disabled,
      label: getI18nText('prev'),
    };
  }

  getNextProps() {
    const { index, bounded, getI18nText } = this.asProps;
    const { items } = this.state;
    let disabled = false;
    if (items.length && bounded) {
      disabled = index === items.length - 1;
    }
    return {
      onClick: this.bindHandlerClick('right'),
      onKeyDown: this.bindHandlerKeydownControl('right'),
      disabled,
      label: getI18nText('next'),
    };
  }

  getIndicatorsProps() {
    const { items } = this.state;
    const { index } = this.asProps;

    return {
      items: items.map((item, key) => ({
        active: key === index,
        onClick: this.bindHandlerClickIndicator(key),
        key,
      })),
    };
  }

  render() {
    const SCarousel = Root;
    const { styles, Children } = this.asProps;

    return sstyled(styles)(
      <SCarousel
        render={Box}
        role='group'
        onKeyDown={this.handlerKeyDown}
        tabIndex={0}
        onTouchStart={this.handlerTouchStart}
        onTouchEnd={this.handlerTouchEnd}
      >
        <Children />
      </SCarousel>,
    );
  }
}

const Container = (props) => {
  const SContainer = Root;
  const { styles, duration } = props;

  return sstyled(styles)(<SContainer render={Box} role='list' use:duration={`${duration}ms`} />);
};

const Item = (props) => {
  const { styles, toggleItem, index, uid, current } = props;
  const SItem = Root;
  const refItem = React.createRef();
  useEffect(() => {
    // add item
    toggleItem({ node: refItem.current });
    return () => {
      // remove item
      toggleItem({ node: refItem.current }, true);
    };
  }, []);

  return sstyled(styles)(
    <SItem
      render={Box}
      ref={refItem}
      role='listitem'
      id={`igc-${uid}-carousel-item-${index}`}
      aria-current={current}
    />,
  );
};

const Prev = (props) => {
  const { styles, children, label } = props;
  const SPrev = Root;
  return sstyled(styles)(
    <SPrev render={Box}>{children || <ChevronLeft interactive aria-label={label} />}</SPrev>,
  );
};

Prev.defaultProps = () => ({
  top: 0,
});

const Next = (props) => {
  const { styles, children, label } = props;
  const SNext = Root;
  return sstyled(styles)(
    <SNext render={Box}>{children || <ChevronRight interactive aria-label={label} />}</SNext>,
  );
};

Next.defaultProps = () => ({
  top: 0,
});

const Indicators = ({ items, styles, Children }) => {
  const SIndicators = Root;
  if (Children.origin) {
    return sstyled(styles)(
      <SIndicators render={Box} aria-hidden='true'>
        <Children />
      </SIndicators>,
    );
  }
  return sstyled(styles)(
    <SIndicators render={Box} aria-hidden='true'>
      {items.map((item, index) => (
        <Carousel.Indicator key={index} {...item} />
      ))}
    </SIndicators>,
  );
};

const Indicator = ({ styles, Children }) => {
  const SIndicator = Root;
  return sstyled(styles)(
    <SIndicator render={Box}>
      <Children />
    </SIndicator>,
  );
};

const Carousel = createComponent(CarouselRoot, {
  Container,
  Indicators,
  Indicator,
  Item,
  Prev,
  Next,
});

export default Carousel;

import { Component, cloneElement } from 'react';
import interact from 'interact.js';

export default class PointDiv extends Component {
  static defaultProps = {
    draggable: false,
    draggableOptions: {},
  };

  componentDidMount() {
    this.interact = interact(this.node);
    this.setInteractions();
  }

  componentWillReceiveProps() {
    this.interact = interact(this.node);
    this.setInteractions();
  }

  setInteractions() {
    const { draggable, draggableOptions } = this.props;
    if (draggable) this.interact.draggable(draggableOptions);
  }

  render() {
    const { children } = this.props;
    return cloneElement(children, {
      ref: node => {
        this.node = node;
      },
      draggable: false,
    });
  }
}

PointDiv.propTypes = {};

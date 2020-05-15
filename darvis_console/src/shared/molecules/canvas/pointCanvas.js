import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';
import interact from 'interact.js';
import PointDiv from './pointDiv';
import { Draggable } from 'gsap/all';

const StyledImage = styled.img`
  max-width: 100%;
`;

class PointCanvas extends React.Component {
  step = 0.25;

  maxRate = 5;

  minRate = 1;

  draggableOptions = {
    inertia: true,
    restrict: {
      restriction: 'parent',
    },
    onmove: event => {
      const { target } = event;

      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.transform = `translate(${x}px, ${y}px)`;
      target.style.webkitTransform = `translate(${x}px, ${y}px)`;

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      const key = target.getAttribute('pointer-id');
      this.updateDotPosition({ key, x, y });
      // this.drawPolygon();
    },
    onend: event => {
      // const {boundId} = this.props;
      // const divInstance = Draggable.get('#' + boundId + '-div');
      // if(divInstance) {
      //   divInstance.enabled(true);
      // }
    }
  };

  constructor(props) {
    super(props);
    this.p1 = React.createRef();
    this.p2 = React.createRef();
    this.p3 = React.createRef();
    this.p4 = React.createRef();
    this.state = {
      points: {
        p1: { x: 0, y: 0 },
        p2: { x: 0, y: 0 },
        p3: { x: 0, y: 0 },
        p4: { x: 0, y: 0 },
      },
      zoomRate: 1,
    };
    this.canvasRef = React.createRef(); // canvas ref for drawing polygon
    this.backCanvasRef = React.createRef(); //
    this.imageRef = React.createRef(); // image ref
    this.divRef = null; // div wrapper for canvas and image
  }

  componentDidMount() {
    const {boundId} = this.props;
    if (this.divRef) {
      Draggable.create(this.divRef, {
        type: 'x, y',
        bounds: '#' + boundId,
        edgeResistance: 0.9,
        zIndexBoost: false,
        dragClickables: false,
        zIndex:1,
        onPress: function(event) {
          // debugger;
          // if(event.target.tagName === 'IMG') {
          //   const divInstance = Draggable.get('#' + boundId + '-div');
          //   if(divInstance) {
          //     divInstance.enabled(false);
          //   }
          // }
        },
        onDrag: function(event) {

        },
      });
    }
  }

  componentDidUpdate() {
    const { points, zoomRate } = this.state;
    const { canvasWidth, canvasHeight, camerasPoints } = this.props;

    if (camerasPoints && camerasPoints.length > 0 && this.backCanvasRef.current) {
      const canvasRegion = this.backCanvasRef.current.getContext('2d');
      canvasRegion.clearRect(0, 0, canvasWidth * zoomRate, canvasHeight * zoomRate);
      camerasPoints.forEach(item => {
        const pt = this.getPoints(canvasWidth * zoomRate, canvasHeight * zoomRate, item.points);
        if (item.isActive) {
          this.drawPolygon(pt, this.backCanvasRef.current, '#00f');
        } else {
          this.drawPolygon(pt, this.backCanvasRef.current, '#f00');
        }
      });
    }
    this.drawPolygon(points, this.canvasRef.current);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.points !== state.points) {
      return {
        points: props.points,
      };
    }
    return null;
  }

  updateDotPosition = pos => {
    const { updatePoints } = this.props;
    updatePoints(pos);
  };

  drawPolygon = (pt, canvasDiv, fillStyle) => {
    if (canvasDiv) {
      const { zoomRate } = this.state;
      const { canvasWidth, canvasHeight } = this.props;
      // draw polygon
      const canvasRegion = canvasDiv.getContext('2d');

      if (canvasDiv === this.canvasRef.current) {
        canvasRegion.clearRect(0, 0, canvasWidth * zoomRate, canvasHeight * zoomRate);
      }

      canvasRegion.globalAlpha = 0.2;
      if (fillStyle) {
        canvasRegion.fillStyle = fillStyle;
      } else {
        canvasRegion.fillStyle = '#00f';
      }

      canvasRegion.beginPath();
      Object.keys(pt).forEach((item, i) => {
        if (i === 0) {
          canvasRegion.moveTo(pt[item].x + 8, pt[item].y + 8);
        } else {
          canvasRegion.lineTo(pt[item].x + 8, pt[item].y + 8);
        }
      });

      canvasRegion.closePath();
      canvasRegion.fill();
    }
  };

  getPoints = (xRatio, yRatio, pt) => {
    if (pt) {
      return {
        p1: { x: parseInt(pt.p1.x * xRatio, 10), y: parseInt(pt.p1.y * yRatio, 10) },
        p2: { x: parseInt(pt.p2.x * xRatio, 10), y: parseInt(pt.p2.y * yRatio, 10) },
        p3: { x: parseInt(pt.p3.x * xRatio, 10), y: parseInt(pt.p3.y * yRatio, 10) },
        p4: { x: parseInt(pt.p4.x * xRatio, 10), y: parseInt(pt.p4.y * yRatio, 10) },
      };
    }
    return {};
  };

  multiplyPoints = (pt, oldRate, Newrate) => {
    pt.p1.x = (pt.p1.x / oldRate) * Newrate;
    pt.p2.x = (pt.p2.x / oldRate) * Newrate;
    pt.p3.x = (pt.p3.x / oldRate) * Newrate;
    pt.p4.x = (pt.p4.x / oldRate) * Newrate;

    pt.p1.y = (pt.p1.y / oldRate) * Newrate;
    pt.p2.y = (pt.p2.y / oldRate) * Newrate;
    pt.p3.y = (pt.p3.y / oldRate) * Newrate;
    pt.p4.y = (pt.p4.y / oldRate) * Newrate;
    this.setState(pt);
  };

  zoomIn = () => {
    const { zoomRate, points } = this.state;
    const { updateZoomRate, canvasWidth, canvasHeight } = this.props;
    if (zoomRate < this.maxRate) {
      const rate = zoomRate + this.step;
      const w = canvasWidth * rate;
      const h = canvasHeight * rate;

      // re-create canvas
      this.canvasRef.current.width = w;
      this.canvasRef.current.height = h;
      this.divRef.style.transform = `translate(${(canvasWidth - w) / 2}px, ${(canvasHeight - h) / 2}px)`;
      this.divRef.style.webkitTransform = `translate(${(canvasWidth - w) / 2}px, ${(canvasHeight - h) / 2}px)`;
      this.divRef.setAttribute('data-x', (canvasWidth - w) / 2);
      this.divRef.setAttribute('data-y', (canvasHeight - h) / 2);
      // re-calculate points
      const pt = { ...points };
      this.multiplyPoints(pt, zoomRate, rate);

      this.setState({
        zoomRate: rate,
      });
      updateZoomRate(rate);
    }
  };

  zoomOut = () => {
    const { zoomRate, points } = this.state;
    const { updateZoomRate, canvasWidth, canvasHeight } = this.props;
    if (zoomRate > this.minRate) {
      const rate = zoomRate - this.step;
      const w = canvasWidth * rate;
      const h = canvasHeight * rate;

      // re-create canvas
      this.canvasRef.current.width = w;
      this.canvasRef.current.height = h;
      this.divRef.style.transform = `translate(${(canvasWidth - w) / 2}px, ${(canvasHeight - h) / 2}px)`;
      this.divRef.style.webkitTransform = `translate(${(canvasWidth - w) / 2}px, ${(canvasHeight - h) / 2}px)`;
      this.divRef.setAttribute('data-x', (canvasWidth - w) / 2);
      this.divRef.setAttribute('data-y', (canvasHeight - h) / 2);
      // re-calculate points
      const pt = { ...points };
      this.multiplyPoints(pt, zoomRate, rate);

      this.setState({
        zoomRate: rate,
      });
      updateZoomRate(rate);
    }
  };

  render() {
    const { imagePath, canvasWidth, canvasHeight, boundId } = this.props;
    const { points, zoomRate } = this.state;
    const draggableTranslates = [];


    Object.keys(points).forEach(item => {
      draggableTranslates.push({
        transform: `translate(${points[item].x}px, ${points[item].y}px)`,
      });
    });

    this.drawPolygon(points, this.canvasRef.current);
    return (
      <div
        id={boundId}
        className="darvis-plan-canvas-container"
        style={{ overflow: 'hidden' }} /* onWheel={(e) => this.handleMouseWheel(e)} */
      >
        <div className="ab-t-r z-101">
          <span style={{ backgroundColor: '#fff', color: '#000' }}>{zoomRate * 100} %</span>
          <Button color="primary" className="m-l-5" onClick={this.zoomIn} disabled={zoomRate >= 5}>
            +
          </Button>
          <Button color="primary" className="m-l-5" onClick={this.zoomOut} disabled={zoomRate <= 1}>
            -
          </Button>
        </div>
        <div
          ref={r => (this.divRef = r)} 
          style={{ width: `${canvasWidth * zoomRate}px`, height: `${canvasHeight * zoomRate}px` }}
          id={boundId + '-div'}
        >
          {imagePath && (
            <StyledImage src={imagePath} alt="placeholder" className="w-full h-full z-98" ref={this.imageRef} />
          )}
          <canvas
            ref={this.canvasRef}
            className="ab-t-l z-100"
            width={canvasWidth * zoomRate}
            height={canvasHeight * zoomRate}
          />
          <canvas
            ref={this.backCanvasRef}
            className="ab-t-l z-99"
            width={canvasWidth * zoomRate}
            height={canvasHeight * zoomRate}
          />
          {Object.keys(points).map((item, nIndex) => {
            return (
              <PointDiv key={`p${nIndex + 1}`} draggable draggableOptions={this.draggableOptions}>
                <img
                  ref={`p${nIndex + 1}`}
                  src={`/images/zones/p${nIndex + 1}.png`}
                  className="darvis-plan-pointer"
                  pointer-id={item}
                  alt=""
                  style={draggableTranslates[nIndex]}
                  data-x={points[item].x}
                  data-y={points[item].y}
                  data-clickable='true'
                />
              </PointDiv>
            );
          })}
        </div>
      </div>
    );
  }
}
export default PointCanvas;

import React from 'react';
import { Row, Col } from 'reactstrap';
import styles from '../styles.module.scss';

const PointInfo = ({ points, header }) => {
  return (
    <React.Fragment>
      <div className="p-t-20">
        <Row className={styles.point_header}>{header}</Row>
        <Row>
          <Col md={1}>P1x</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p1.x)}
          </Col>
          <Col md={1}>P1y</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p1.y)}
          </Col>
          <Col md={1}>P2x</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p2.x)}
          </Col>
          <Col md={1}>P2y</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p2.y)}
          </Col>
        </Row>
        <Row>
          <Col md={1}>P3x</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p3.x)}
          </Col>
          <Col md={1}>P3y</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p3.y)}
          </Col>
          <Col md={1}>P4x</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p4.x)}
          </Col>
          <Col md={1}>P4y</Col>
          <Col md={1} className={styles.blue}>
            {Math.round(points.p4.y)}
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default PointInfo;

import React, { useState, useEffect, useRef } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Container, Row, Col, Label, Button, ModalFooter, ModalBody, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ORIGIN } from '../../../config';
import styles from '../styles.module.scss';
import PointCanvas from '../../../shared/molecules/canvas/pointCanvas';
import PointInfo from './pointInfo';

const ZoneModal = ({ level, zone, addZone, updateZone, dismiss }) => {
  const planCanvas = useRef(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = useState({
    _id: undefined,
    name: '',
    levelId: undefined,
    levelPath: '/placeholder.png'
  });

  useEffect(() => {
    setFormData({
      _id: zone ? zone._id : undefined,
      name: zone ? zone.name : '',
      levelId: level ? level._id : undefined,
      levelPath: level ? ORIGIN + level.plan : '/placeholder.png'
    });
  }, [zone, level]);

  const [points, setPoints] = useState();

  function getPoints(xRatio, yRatio, pt) {
    if (pt) {
      return {
        p1: { x: pt.p1.x * xRatio, y: pt.p1.y * yRatio },
        p2: { x: pt.p2.x * xRatio, y: pt.p2.y * yRatio },
        p3: { x: pt.p3.x * xRatio, y: pt.p3.y * yRatio },
        p4: { x: pt.p4.x * xRatio, y: pt.p4.y * yRatio },
      };
    }
    return {
      p1: { x: 0.3 * xRatio, y: 0.3 * yRatio },
      p2: { x: 0.5 * xRatio, y: 0.3 * yRatio },
      p3: { x: 0.5 * xRatio, y: 0.5 * yRatio },
      p4: { x: 0.3 * xRatio, y: 0.5 * yRatio },
    };
  }

  useEffect(() => {
    if (planCanvas && planCanvas.current) {
      const xRatio = planCanvas.current.clientWidth;
      const yRatio = planCanvas.current.clientHeight;
      setPoints(getPoints(xRatio, yRatio, zone ? zone.points : undefined));
    }
  }, [planCanvas.current]);
  const [zoomRate, setZoomRate] = useState(1);

  const updateZoomRate = rate => {
    setZoomRate(rate);
  };

  function handleSubmit(event, values) {
    // get canvas div size
    // darvis-plan-div
    if (event && planCanvas.current) {
      const canvasWidth = planCanvas.current.clientWidth;
      const canvasHeight = planCanvas.current.clientHeight;

      const cpoints = { ...points };
      Object.keys(points).forEach(item => {
        cpoints[item].x = points[item].x / (canvasWidth * zoomRate);
        cpoints[item].y = points[item].y / (canvasHeight * zoomRate);
      });

      const z = {
        _id: formData._id,
        name: values.name,
        levelId: formData.levelId,
        points: cpoints,
      };
      const callback = () => {
        setIsSaving(false);
      };
      setIsSaving(true);

      if (formData._id) {
        updateZone(z, () => callback(), () => callback());
      } else {
        addZone(z, () => callback(), () => callback());
      }
    }
  }

  const updatePoints = pos => {
    const newPoints = { ...points };
    newPoints[pos.key] = { x: pos.x, y: pos.y };
    setPoints({
      ...newPoints,
    });
  };

  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalBody className="p-4">
        <Row>
          <Col md={4}>
            <h2 className="m-b-30">{zone ? 'Edit' : 'Add'} Zone</h2>
            <Label for="level">Level : {level ? level.name : ''}</Label>
            <AvField
              name="name"
              label="Name"
              type="text"
              value={formData.name}
              validate={{
                required: { value: true, errorMessage: 'Please enter a valid name' },
                minLength: { value: 3, errorMessage: 'Your name must be between 3 and 50 characters' },
                maxLength: { value: 50, errorMessage: 'Your name must be between 3 and 50 characters' },
              }}
            />

            <Container className={styles.points}>
              <Row>
                <button className={styles.blue} type="button" onClick={() => { }}>
                  <FontAwesomeIcon size="1x" icon="plus-circle" />
                  <span className="pl-1">Put markers on map/plan</span>
                </button>
              </Row>
              <Row>{points && <PointInfo points={points} />}</Row>
            </Container>
          </Col>
          <Col md={8}>
            <div ref={planCanvas} className={`${styles.plan_height} w-full darvis-border darvis-canvas-wrapper`}>
              {planCanvas.current && points && (
                <PointCanvas
                  key={formData.levelId}
                  points={points} // points for the floor
                  updatePoints={updatePoints} // get updated points from canvas
                  updateZoomRate={updateZoomRate} // get zoom rate from canvas
                  canvasWidth={planCanvas.current.clientWidth} // initial canvas width
                  canvasHeight={planCanvas.current.clientHeight} // initial canvas height
                  imagePath={formData.levelPath} // level image path
                />
              )}
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="darvis-bg-gray">
        {isSaving ? (
          <Spinner />
        ) : (
            <React.Fragment>
              <Button type="submit" className="green-button" size="lg">
                {zone ? 'Update' : 'Add'} zone
            </Button>
              <Button type="button" className="green-button m-l-20" onClick={dismiss} size="lg">
                Cancel
            </Button>
            </React.Fragment>
          )}
      </ModalFooter>
    </AvForm>
  );
};

export default ZoneModal;

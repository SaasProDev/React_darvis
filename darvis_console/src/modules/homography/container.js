import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Spinner } from 'reactstrap';

import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import { ORIGIN } from '../../config';
import PointCanvas from '../../shared/molecules/canvas/pointCanvas';
import styles from './styles.module.scss';
import { updateCameraToSite } from '../../shared/services/sites';
import getHomography from './service';

const HomographyContainer = (props) => {
  let site = JSON.parse(localStorage.getItem('selectedSite'));

  const [initialData, setInitialData] = useState({
    camera: {},
    level: {},
    otherCamerasPoints: []
  });

  const getOtherCameras = (current) => {
    const points = [];
    site.cameras.forEach(item => {
      if (item._id !== current._id && item.levelId !== current.levelId && item.floorPlanPoints) {
        points.push({ isActive: item.isActive, points: item.floorPlanPoints });
      }
    });
    return points;
  }
  useEffect(() => {
    const cam = site.cameras.find(c => c._id === props.match.params.cameraId) || {};
    let otherPoints = [];
    if (cam) {
      otherPoints = getOtherCameras(cam);
    }
    setInitialData({
      level: site.levels.find(l => l._id === props.match.params.levelId) || {},
      camera: cam,
      otherCamerasPoints: otherPoints,
    });
  }, []);

  const [state, setState] = useState({
    camPoints: [],
    cameraZoomRate: 1,
    floorZoomRate: 1,
    floorPlanPoints: []
  });

  const cameraRef = useRef(null);
  const floorRef = useRef(null);

  const getSorted = (pts) => {
    const ptsArr = [];
    ptsArr.push(pts.p1);
    ptsArr.push(pts.p2);
    ptsArr.push(pts.p3);
    ptsArr.push(pts.p4);

    ptsArr.sort((a, b) => (a.x + a.y) - (b.x + b.y));
    // top left
    const tl = ptsArr[0];
    const br = ptsArr[3];
    ptsArr.sort((a, b) => (a.x - a.y) - (b.x - b.y));
    const bl = ptsArr[0];
    const tr = ptsArr[3];

    return { p1: tl, p2: tr, p3: br, p4: bl };
  }
  const getPoints = (xRatio, yRatio, pt) => {
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
    if (cameraRef.current && floorRef.current && initialData.camera) {
      const xRatioCam = cameraRef.current.clientWidth;
      const yRatioCam = cameraRef.current.clientHeight;
      const xRatioFl = floorRef.current.clientWidth;
      const yRatioFl = floorRef.current.clientHeight;
      setState({
        ...state,
        camPoints: initialData.camera.cameraPoints ? getPoints(xRatioCam, yRatioCam, initialData.camera.cameraPoints) : getPoints(xRatioCam, yRatioCam, undefined),
        floorPlanPoints: initialData.camera.floorPlanPoints ? getPoints(xRatioFl, yRatioFl, initialData.camera.floorPlanPoints) : getPoints(xRatioFl, yRatioFl, undefined)
      });
    }
  }, [cameraRef.current, floorRef.current, initialData.camera]);

  const updateCameraPoints = pos => {
    const newPoints = state.camPoints;
    newPoints[pos.key] = { x: pos.x, y: pos.y };
    setState({
      ...state,
      camPoints: newPoints
    });
  };

  const updateFloorPoints = pos => {
    const newPoints = state.floorPlanPoints;
    newPoints[pos.key] = { x: pos.x, y: pos.y };
    setState({
      ...state,
      floorPlanPoints: newPoints
    });
  };

  const updateCameraZoomRate = rate => {
    setState({
      ...state,
      cameraZoomRate: rate
    });
  };

  const updateFloorZoomRate = rate => {
    setState({
      ...state,
      floorZoomRate: rate
    });
  };

  async function savePoints() {
    if (initialData.camera && initialData.level) {
      let cpoints = { ...state.camPoints };
      let fpoints = { ...state.floorPlanPoints };

      if (!cameraRef.current || !floorRef.current) {
        // error case
      } else {
        const cameraWidth = cameraRef.current.clientWidth;
        const cameraHeight = cameraRef.current.clientHeight;

        Object.keys(state.camPoints).forEach(item => {
          cpoints[item].x = parseFloat(state.camPoints[item].x / (cameraWidth * state.cameraZoomRate));
          cpoints[item].y = parseFloat(state.camPoints[item].y / (cameraHeight * state.cameraZoomRate));
        });

        const floorWidth = floorRef.current.clientWidth;
        const floorHeight = floorRef.current.clientHeight;

        Object.keys(state.floorPlanPoints).forEach(item => {
          fpoints[item].x = parseFloat(state.floorPlanPoints[item].x / (floorWidth * state.floorZoomRate));
          fpoints[item].y = parseFloat(state.floorPlanPoints[item].y / (floorHeight * state.floorZoomRate));
        });
      }

      // points ordering
      // cpoints = getSorted(cpoints);
      // fpoints = getSorted(fpoints);

      const homography = await getHomography(cpoints, fpoints);

      if (!homography || homography === 'error') {
        // show error
      } else {
        await updateCameraToSite(site._id, initialData.camera, cpoints, fpoints, homography.homography_points);
      }
      // redirect
      props.history.goBack();
    }
  }

  function cancelPoints() {
    props.history.goBack();
  }
  return (
    <DashboardTemplate>
      {initialData.camera && initialData.level ? (
        <React.Fragment>
          <Row className="m-b-10">
            <Col md={4}>
              <h4 className="m-l-50">{initialData.level && `Level : ${initialData.level.name}`}</h4>
            </Col>
            <Col md={4}>
              <h4 className="m-l-50">{initialData.level && `Camera : ${initialData.camera.name}`}</h4>
            </Col>
            <Col md={4}>
              <div style={{ float: 'right' }}>
                <h5>{}</h5>
                <Button color="success" onClick={savePoints}>
                  Done
                </Button>
                <Button color="success" className="m-l-10" onClick={cancelPoints}>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div ref={floorRef} className={`${styles.plan_floor_height} darvis-border darvis-canvas-wrapper`}>
                {floorRef.current && (
                  <PointCanvas
                    key={initialData.level._id}
                    points={state.floorPlanPoints} // points for the floor
                    camerasPoints={initialData.otherCamerasPoints} // other cameras points
                    updatePoints={updateFloorPoints} // get updated points from canvas
                    updateZoomRate={updateFloorZoomRate} // get zoom rate from canvas
                    canvasWidth={floorRef.current.clientWidth} // initial canvas width
                    canvasHeight={floorRef.current.clientHeight} // initial canvas height
                    imagePath={ORIGIN + initialData.level.plan} // level image path
                    boundId='floorDiv'
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row className='m-t-10'>
            <Col md={12}>
              <div ref={cameraRef} className={`${styles.plan_camera_height} darvis-border darvis-canvas-wrapper`}>
                {cameraRef.current && (
                  <PointCanvas 
                    key={initialData.camera._id}
                    points={state.camPoints}
                    updatePoints={updateCameraPoints}
                    camerasPoints={undefined}
                    updateZoomRate={updateCameraZoomRate}
                    canvasWidth={cameraRef.current.clientWidth}
                    canvasHeight={cameraRef.current.clientHeight}
                    imagePath={ORIGIN + initialData.camera.image}
                    boundId='cameraDiv'
                  />
                )}
              </div>
            </Col>
          </Row>
        </React.Fragment>
      ) : (
          <Spinner />
        )}
    </DashboardTemplate>
  );
};

export default HomographyContainer;

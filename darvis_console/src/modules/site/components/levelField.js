import React, { useState, useEffect } from 'react';
import { Col, Row, CustomInput } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ConfirmationContext from '../../../shared/modules/confirmationModal/context';
import HrDivider from '../../../shared/atoms/hrDivider';
import styles from '../styles.module.scss';

const LevelField = ({ site,
  index,
  levelDetail,
  updateLevel,
  deleteLevel,
  addZone,
  updateZone,
  deleteZone,
  attachCamera,
  detachCamera,
  editPoint,
  enableCamera }) => {

  const [state, setState] = useState({});
  useEffect(() => {
    const cameras = site.cameras.filter(x => x.levelId === levelDetail._id);
    setState({
      cameras: cameras
    });
  }, [site]);

  const renderZone = () => {
    return (
      <React.Fragment>
        {(levelDetail && levelDetail.zones && levelDetail.zones.length > 0) && (
          levelDetail.zones.map(z => (
            <Row key={z._id} className='p-t-5'>
              <Col key={z.name} md={6}>
                <span className='p-l-20'>{z.name}</span>
              </Col>
              <Col md={{ size: 4, offset: 2 }}>
                <button className={`${styles.blue} p-r-5`} type="button" onClick={() => updateZone(z)}>
                  <FontAwesomeIcon size="sm" icon="pen" />
                </button>
                <button className={`${styles.times}`} type="button" onClick={() => deleteZone(z)}>
                  <FontAwesomeIcon size="sm" icon="times" />
                </button>
              </Col>
            </Row>
          ))
        )}
        <Row className='p-t-5'>
          <Col md={12} className='p-l-30'>
            <button className={styles.blue} type="button" onClick={() => addZone()}>
              <FontAwesomeIcon size="1x" icon="plus-circle" />
              <span className="p-l-5">Add new zone</span>
            </button>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  const renderCamera = () => {
    return (
      <React.Fragment>
        {(levelDetail && state.cameras && state.cameras.length > 0 && state.cameras.map(cam => (
          <Row key={cam._id} className='p-t-5'>
            <Col md={9} className='p-l-20'>
              <CustomInput
                type='switch'
                name='status'
                id={cam._id}
                label={cam.name}
                defaultChecked={cam.isActive}
                onChange={() => { enableCamera(cam._id) }}
              />

            </Col>
            <Col md={3}>
              <span>
                <button className={styles.editButton}><FontAwesomeIcon icon="cog" onClick={() => {editPoint(levelDetail._id, cam._id)}} /></button>
                <ConfirmationContext.Consumer>
                  {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                    <button
                      className={styles.trashButton}
                      onClick={() => {
                        setConfirmationModal(s => ({
                          ...s,
                          visible: true,
                          item: cam.name,
                          callback: () => {
                            setLoader(true);
                            detachCamera(cam, () => resetConfirmationModal(), () => setLoader(false));
                          }
                        }));
                      }}>
                      <FontAwesomeIcon icon="trash" />
                    </button>
                  )}
                </ConfirmationContext.Consumer>
              </span>
            </Col>
          </Row>
        ))
        )}
        <Row className='p-t-5'>
          <Col md={12} className='p-l-30'>
            <button className={styles.blue} type="button" onClick={attachCamera}>
              <FontAwesomeIcon size="1x" icon="plus-circle" />
              <span className="p-l-5">Assign camera</span>
            </button>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col md={12}>
          <HrDivider bold={false} color="#72a7e0" />
        </Col>
      </Row>
      <Row>
        <Col md={1} className='p-l-20'>{index}</Col>
        <Col md={3} className={`${styles.level}`}>
          <span>{levelDetail.name}</span>
        </Col>
        <Col md={2} className={`${styles.level}`}>
          {levelDetail.vtype || 'Floor Plan'}
        </Col>
        <Col md={2} className={`${styles.number}`}>
          {levelDetail.zones.length}
        </Col>
        <Col md={2} className={`${styles.number}`}>
          {site.cameras.filter(x => x.levelId === levelDetail._id).length}
        </Col>
        <Col md={2} className={`${styles.level} p-r-20`}>
          <span className={`${styles.levelIcons}`}>
            <button className={`${styles.blue} p-r-10`} type="button" onClick={(lvl) => updateLevel(lvl)}>
              <FontAwesomeIcon size="sm" icon="pen" />
            </button>
            <button className={`${styles.times} p-r-10`} type="button" onClick={deleteLevel}>
              <FontAwesomeIcon size="sm" icon="times" />
            </button>
          </span>
        </Col>
      </Row>
      <Row>
        <Col md={7} className='p-t-10'>{renderZone()}</Col>
        <Col md={5} className='p-t-10'>{renderCamera()}</Col>
      </Row>
    </React.Fragment>
  );
};

LevelField.defaultProps = {
  updateLevel: () => { },
  deleteLevel: () => { },
  addZone: () => { },
  updateZone: () => { },
  deleteZone: () => { },
  attachCamera: () => {},
  detachCamera: () => {},
  editPoint: () => {},
  enableCamera: () => {}
};

export default LevelField;

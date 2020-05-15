import React, { useState, useContext } from 'react';
import { Row, Col, Modal, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { saveAs } from 'file-saver';

import {
  getSitesbyUser as callSite,
  addLevel as addLevelService,
  updateLevel as updateLevelService,
  deleteLevelFromSite,
  addZone as addZoneService,
  updateZone as updateZoneService,
  deleteZoneFromLevel,
  enableCamera as enableCameraService,
  updateCameraToSite,
  generateJson,
  restartAI as restartAIService,
  updateSite as updateSiteService,
} from '../../shared/services/sites';

import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import SitesContext from '../../shared/modules/sitesContext/context';
import ErrorContext from '../../shared/modules/error/context';
import ConfirmationContext from '../../shared/modules/confirmationModal/context';

import LevelModal from './components/levelModal';
import ZoneModal from './components/zoneModal';
import SiteModal from './components/siteModal';
import CameraLevelModal from './components/cameraLevelModal';

import Card from '../../shared/molecules/card';
import HrDivider from '../../shared/atoms/hrDivider';
import LevelField from './components/levelField';

import styles from './styles.module.scss';

const SiteContainer = ({history}) => {
  const { setError } = useContext(ErrorContext);

  const [modalState, setModalState] = useState({
    level: {},
    zone: {},
    siteName: '',
    visible_level: false,
    visible_zone: false,
    visible_site: false,
    visible_assign: false
  });

  const toggleLevel = (l) => {
    setModalState({
      ...modalState,
      level: l,
      visible_level: !modalState.visible_level
    });
  };
  const toggleZone = (l, z) => {
    setModalState({
      ...modalState,
      level: l,
      zone: z,
      visible_zone: !modalState.visible_zone
    });
  };
  const toggleSite = (siteName) => {
    setModalState({ 
      ...modalState, 
      siteName: siteName, 
      visible_site: !modalState.visible_site });
  };
  const toggleAssign = (l) => {
    setModalState({
      ...modalState,
      level: l,
      visible_assign: !modalState.visible_assign
    });
  }
  const dismiss = () => {
    setModalState({
      level: {},
      zone: {},
      camera: {},
      visible_level: false,
      visible_zone: false,
      visible_site: false,
      visible_assign: false,
    });
  }

  return (
    <DashboardTemplate>
      <SitesContext.Consumer>
        {props => {
          const { selectedSite, reloadSites } = props;
          if (!selectedSite) {
            return (
              <Row className='m-t-30'>
                <Col>
                  <h2 className='m-l-30' style={{ position: 'absolute', bottom: 0 }}>
                    Site not found
                  </h2>
                </Col>
              </Row>
            )
          } else {
            const levels = selectedSite.levels;
            /* level functionalities */
            const addLevel = async (level, cb, errcb) => {
              try {
                await addLevelService(selectedSite._id, level);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const updateLevel = async (level, cb, errcb) => {
              try {
                await updateLevelService(selectedSite._id, level);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const deleteLevel = async (levelId, cb, errcb) => {
              try {
                await deleteLevelFromSite(selectedSite._id, levelId);
                if (cb) { cb(); }
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            /* zone functionalities */
            const addZone = async (zone, cb, errcb) => {
              try {
                await addZoneService(selectedSite._id, zone);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const updateZone = async (zone, cb, errcb) => {
              try {
                await updateZoneService(selectedSite._id, zone);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const deleteZone = async (levelId, zoneId, cb, errcb) => {
              try {
                await deleteZoneFromLevel(selectedSite._id, zoneId, levelId);
                if (cb) { cb(); }
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            /* attach and detach camera */
            const attachCameraToLevel = async(levelId, camera, cb, errcb) => {
              try {
                camera.levelId = levelId;
                await updateCameraToSite(selectedSite._id, camera, undefined, undefined, undefined);
                if(cb) {cb();}
                dismiss();
                let user = localStorage.getItem('user') || {};
                if(user) {
                  user = JSON.parse(user);
                }
                const site1 = await callSite(user._id);
                localStorage.setItem('selectedSite', JSON.stringify(site1[0]));
                history.push(`/console/site/homography/${levelId}/${camera._id}`);
              } catch(e) {
                setError(e);
                if(errcb) {errcb();}
              }
            }
            const detachCameraFromLevel = async( camera, cb, errcb) => {
              try {
                camera.levelId = '';
                await updateCameraToSite(selectedSite._id, camera, camera.cameraPoints, camera.floorPlanPoints, camera.homography);
                if(cb) {cb();}
                reloadSites();
              } catch(e) {
                setError(e);
                if(errcb) {errcb();}
              }
            }
            const enableCamera = async ( cameraId, cb, errcb) => {
              try {
                await enableCameraService(selectedSite._id, cameraId);
                if(cb) {cb();}
                reloadSites();
              } catch (e) {
                setError(e, true);
                if(errcb) {errcb();}
              }
            }
            const editPoint = async (levelId, cameraId) => {
              history.push(`/console/site/homography/${levelId}/${cameraId}`);
            }
            /* site functionalities */
            const exportSite = async () => {
              try {
                const json = await generateJson(selectedSite._id);
                const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                saveAs(blob, 'dw.json');
              } catch (e) {
                setError(e, true);
              }
            }
            const restartAI = async () => {
              try {
                const json = await restartAIService(selectedSite._id);
                const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                saveAs(blob, 'dw.json');
              } catch (e) {
                setError(e, true);
              }
            }
            const updateSite = async (siteName, cb, errcb) => {
              try {
                const site = selectedSite;
                site.name = siteName;
                await updateSiteService(site, site._id);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            return (
              <React.Fragment>
                <Row>
                  <Col md={10}>
                    {/* Site name and Export button */}
                    <Row>
                      <Col md={7}>
                        <div className='m-l-30'>
                          <span style={{ fontSize: '1.6rem' }}>{selectedSite.name}</span>
                          <button className={`${styles.blue} m-l-10`} type="button" onClick={() => { toggleSite(selectedSite.name) }} style={{ position: 'absolute' }}>
                            <FontAwesomeIcon size="sm" icon="pen" />
                          </button>
                        </div>
                      </Col>
                      <Col md={5}>
                        <div className='dis-flex p-r-10 float-r'>
                          <Button type='button' className='green-button m-r-5' onClick={exportSite}>
                            Save and export
                          </Button>
                          <Button type='button' className='green-button m-r-5' onClick={restartAI}>
                            Save and restart AI
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    {/* Header for the levels */}
                    <Row>
                      <Col md={12}>
                        <Card className='camera-system__content pd-10'>
                          <Row>
                            <Col md={1} className='p-l-20'>
                              <strong>No</strong>
                            </Col>
                            <Col md={3}>
                              <strong>Level Name</strong>
                            </Col>
                            <Col md={2}>
                              <strong>Type</strong>
                            </Col>
                            <Col md={2} className={`${styles.number}`}>
                              <strong># Zones</strong>
                            </Col>
                            <Col md={2} className={`${styles.number}`}>
                              <strong># Cameras</strong>
                            </Col>
                            <Col md={2} style={{ textAlign: 'right' }}>
                              <strong className='p-r-20'>#</strong>
                            </Col>
                          </Row>
                          {(levels && levels.length > 0) ? (
                            <ConfirmationContext.Consumer>
                              {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                                levels.map((lvl, index) => (
                                  <LevelField
                                    key={lvl._id}
                                    index={index + 1}
                                    site={selectedSite}
                                    levelDetail={lvl}
                                    updateLevel={() => { toggleLevel(lvl) }}
                                    deleteLevel={() => {
                                      setConfirmationModal(s => ({
                                        ...s,
                                        visible: true,
                                        item: lvl.name,
                                        callback: () => {
                                          setLoader(true);
                                          deleteLevel(lvl._id, () => resetConfirmationModal(), () => setLoader(false));
                                        }
                                      }));
                                    }}
                                    addZone={() => { toggleZone(lvl, undefined) }}
                                    updateZone={(z) => { toggleZone(lvl, z) }}
                                    deleteZone={(z) => {
                                      setConfirmationModal(s => ({
                                        ...s,
                                        visible: true,
                                        item: z.name,
                                        callback: () => {
                                          setLoader(true);
                                          deleteZone(lvl._id, z._id, () => resetConfirmationModal(), () => setLoader(false));
                                        }
                                      }));
                                    }}
                                    enableCamera={(levelId, cameraId) => { enableCamera(levelId, cameraId) }}
                                    editPoint={editPoint}
                                    attachCamera={() => toggleAssign(lvl)}
                                    detachCamera={detachCameraFromLevel}
                                  />
                                ))
                              )}
                            </ConfirmationContext.Consumer>
                          ) : (
                              <React.Fragment>
                                <Row>
                                  <Col md={12}>
                                    <HrDivider bold={false} color='#72a7e0' />
                                  </Col>
                                </Row>
                                <Row>
                                  <div className='m-l-30'>No Levels Found</div>
                                </Row>
                              </React.Fragment>
                            )}
                          <Row>
                            <Col md={12}>
                              <HrDivider bold={false} color='#72a7e0' />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <button className={styles.blue} type="button" onClick={() => { toggleLevel(undefined) }}>
                                <FontAwesomeIcon size="1x" icon="plus-circle" />
                                <span className="pl-1">Add new level</span>
                              </button>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {modalState.visible_level && (
                  <Modal
                    isOpen={modalState.visible_level}
                    toggle={() => dismiss()}
                    style={{ maxWidth: '1000px' }}
                    className='darvis-modal-top'
                  >
                    <LevelModal
                      level={modalState.level}
                      addLevel={addLevel}
                      updateLevel={updateLevel}
                      dismiss={dismiss}
                    />
                  </Modal>
                )}
                {modalState.visible_zone && (
                  <Modal
                    isOpen={modalState.visible_zone}
                    toggle={() => { dismiss() }}
                    style={{ maxWidth: '1000px' }}
                    className='darvis-modal-top'
                  >
                    <ZoneModal
                      level={modalState.level}
                      zone={modalState.zone}
                      addZone={addZone}
                      updateZone={updateZone}
                      dismiss={dismiss}
                    />
                  </Modal>
                )}
                {modalState.visible_site && (
                  <Modal
                    isOpen={modalState.visible_site}
                    toggle={() => { dismiss() }}
                    style={{ maxWidth: '450px' }}
                    className='darvis-modal-top'
                  >
                    <SiteModal
                      siteName={modalState.siteName}
                      updateSite={updateSite}
                      dismiss={dismiss}
                    />
                  </Modal>
                )}
                {modalState.visible_assign && (
                  <Modal
                    isOpen={modalState.visible_assign}
                    toggle={() => {dismiss()}}
                    style={{maxWidth: '450px'}}
                    className='darvis-modal-top'
                  >
                    <CameraLevelModal
                      site={selectedSite}
                      level={modalState.level}
                      attachCamera={attachCameraToLevel}
                      detachCamera={detachCameraFromLevel}
                      dismiss={dismiss}
                    />
                  </Modal>
                )}
              </React.Fragment>
            );
          }
        }}
      </SitesContext.Consumer>
    </DashboardTemplate>
  );
};

export default SiteContainer;

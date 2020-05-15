import React, { useState, useContext } from 'react';
import { Row, Col, Modal } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uuidv1 from 'uuid/v1';

import KPIModal from './components/kpiModal';
import TriggerModal from './components/triggerModal';
import ActionModal from './components/actionModal';
import Card from '../../shared/molecules/card';
import HrDivider from '../../shared/atoms/hrDivider';
import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import ErrorContext from '../../shared/modules/error/context';
import styles from './styles.module.scss';
import SitesContext from '../../shared/modules/sitesContext/context';
import ConfirmationContext from '../../shared/modules/confirmationModal/context';

import {
  addKPI as addKPIService,
  updateKPI as updateKPIService,
  deleteKPI as deleteKPIService,
  addTrigger as addTriggerService,
  updateTrigger as updateTriggerService,
  deleteTrigger as deleteTriggerService
} from '../../shared/services/sites';


const Analytics = () => {
  const { setError } = useContext(ErrorContext);
  const [modalState, setModalState] = useState({
    loading: false,
    visible_kpi: false,
    visible_trigger: false,
    visible_action: false,
    kpi: {},
    trigger: {},
  });

  const toggleKPI = (kpi) => {
    setModalState({
      ...modalState,
      kpi,
      visible_kpi: !modalState.visible_kpi,
    });
  };
  const toggleTrigger = (trigger) => {
    setModalState({
      ...modalState,
      trigger,
      visible_trigger: !modalState.visible_trigger
    });
  };
  const toggleAction = (trigger) => {
    setModalState({
      ...modalState,
      trigger,
      visible_trigger: false,
      visible_action: !modalState.visible_action
    });
  }
  const dismiss = () => {
    setModalState({
      ...modalState,
      visible_kpi: false,
      visible_trigger: false,
      visible_action: false,
      kpi: {},
      trigger: {}
    });
  };

  return (
    <DashboardTemplate>
      <SitesContext.Consumer>
        {props => {
          const { selectedSite, reloadSites } = props;
          const { kpis } = selectedSite.dwInfo.objects[2];
          const { triggers } = selectedSite.dwInfo.objects[3];
          // KPI functions
          const addKPI = async (kpi, cb, errcb) => {
            try {
              const site = await addKPIService(selectedSite._id, kpi);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) {
                cb();
              }
              dismiss();
              reloadSites();
            } catch (e) {
              if (errcb) {
                errcb();
              }
            }
          };
          const updateKPI = async (kpi, cb, errcb) => {
            try {
              const site = await updateKPIService(selectedSite._id, kpi);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) {
                cb();
              }
              dismiss();
              reloadSites();
            } catch (e) {
              setError(e, true);
              if (errcb) {
                errcb();
              }
            }
          };
          const deleteKPI = async (kpiId, cb, errcb) => {
            try {
              const site = await deleteKPIService(selectedSite._id, kpiId);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) {
                cb();
              }
              reloadSites();
            } catch (e) {
              // show error;
              setError(e, true);
              if (errcb) {
                errcb();
              }
            }
          }
          const addTrigger = async (trigger, cb, errcb) => {
            try {
              debugger;
              trigger._id = uuidv1();
              const site = await addTriggerService(selectedSite._id, trigger);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) { cb(); }
              dismiss();
              reloadSites();
              toggleAction(trigger);
            } catch (e) {
              setError(e, true);
              if (errcb) { errcb(); }
            }
          };
          const updateTrigger = async (trigger, cb, errcb) => {
            try {
              const site = await updateTriggerService(selectedSite._id, trigger);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) { cb(); }
              dismiss();
              reloadSites();
            } catch (e) {
              setError(e, true);
              if (errcb) { errcb(); }
            }
          };
          const deleteTrigger = async (triggerId, cb, errcb) => {
            try {
              const site = await deleteTriggerService(selectedSite._id, triggerId);
              localStorage.setItem('selectedSite', JSON.stringify(site));
              if (cb) { cb(); }
              reloadSites();
            } catch (e) {
              setError(e, true);
              if (errcb) { errcb(); }
            }
          };
          const getKPITypeName = (type) => {
            if (type === 'count') {
              return 'Count object'
            } else if (type === 'event_count') {
              return 'Count object doing something'
            } else if (type === 'duration') {
              return 'Measure durations'
            }
          }
          const getKPIObject = (item) => {
            let res = '';
            res = item.object;
            if (item.attribute && item.attribute !== undefined) {
              res = `${res}.${item.attribute}`;
            }
            if (item.state && item.state !== undefined) {
              res = `${res}.${item.state}`;
            }
            return res;
          }
          const getTriggerTypeName = (type) => {
            return type;
          }
          return (
            <React.Fragment>
              <React.Fragment>
                {/* KPI */}
                <Row>
                  <Col md={12}>
                    <h2 className='m-l-30'>KPIs</h2>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Card className='camera-system__content pd-10'>
                      <Row>
                        <Col md={4}>
                          <strong className='m-l-10'>Name of KPI</strong>
                        </Col>
                        <Col md={3}>
                          <strong>KPI type</strong>
                        </Col>
                        <Col md={2}>
                          <strong>what</strong>
                        </Col>
                        <Col md={2}>
                          <strong>where</strong>
                        </Col>
                        <Col md={1}>
                          <strong>#</strong>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <HrDivider bold={false} color='#72a7e0' />
                        </Col>
                      </Row>
                      {kpis &&
                        kpis.map(item => (
                          <Row key={item.id} className='m-t-10'>
                            <Col md={4}>
                              <span className='m-l-10'>{item.name}</span>
                            </Col>
                            <Col md={3}>{getKPITypeName(item.type)}</Col>
                            <Col md={2}>
                              {getKPIObject(item)}
                            </Col>
                            <Col md={2}>{item.where}</Col>
                            <Col md={1}>
                              <span>
                                <button className={`${styles.blue} pr-2`} type='button' onClick={() => toggleKPI(item)}>
                                  <FontAwesomeIcon size='sm' icon='pen' />
                                </button>
                                <ConfirmationContext.Consumer>
                                  {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                                    <button
                                      className={`${styles.times}`}
                                      type='button'
                                      onClick={() => {
                                        setConfirmationModal(s => ({
                                          ...s,
                                          visible: true,
                                          item: item.name,
                                          callback: () => {
                                            setLoader(true);
                                            deleteKPI(item._id, () => resetConfirmationModal(), () => setLoader(false));
                                          },
                                        }));
                                      }}
                                    >
                                      <FontAwesomeIcon size='sm' icon='times' />
                                    </button>
                                  )}
                                </ConfirmationContext.Consumer>
                              </span>
                            </Col>
                          </Row>
                        ))}
                      <Row>
                        {kpis.length === 0 && (
                          <Col md={12} className='m-l-20'>
                            <div>No KPI found</div>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <Col md={12}>
                          <HrDivider bold={false} color='#72a7e0' />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <span className='m-l-10'>
                            <button className={styles.blue} type='button' onClick={() => toggleKPI(undefined)}>
                              <FontAwesomeIcon size='1x' icon='plus-circle' />
                              <span className='pl-1'>Add new KPI</span>
                            </button>
                          </span>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </React.Fragment>
              <React.Fragment>
                {/* Trigger */}
                <Row>
                  <Col md={12}>
                    <h2 className='m-l-30'>Alerts</h2>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Card className='camera-system__content pd-10'>
                      <Row>
                        <Col md={4}>
                          <strong className='m-l-10'>Name of alert</strong>
                        </Col>
                        <Col md={3}>
                          <strong>Alert type</strong>
                        </Col>
                        <Col md={2}>
                          <strong>what</strong>
                        </Col>
                        <Col md={2}>
                          <strong>where</strong>
                        </Col>
                        <Col md={1} style={{textAlign: 'center'}}>
                          <strong>#</strong>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <HrDivider bold={false} color='#72a7e0' />
                        </Col>
                      </Row>
                      {triggers &&
                        triggers.map(item => (
                          <Row key={item.id} className='m-t-10'>
                            <Col md={4}>
                              <span className='m-l-10'>{item.name}</span>
                            </Col>
                            <Col md={3}>{getTriggerTypeName(item.condition.type)}</Col>
                            <Col md={2}>
                              {getKPIObject(item)}
                            </Col>
                            <Col md={2}>{item.where}</Col>
                            <Col md={1}>
                              <span>
                                <button className={`${styles.blue} pr-2`} type='button' onClick={() => toggleTrigger(item)}>
                                  <FontAwesomeIcon size='sm' icon='pen' />
                                </button>
                                <button className={`${styles.blue} pr-2`} type='button' onClick={() => toggleAction(item)}>
                                  <FontAwesomeIcon size='sm' icon='cog' />
                                </button>
                                <ConfirmationContext.Consumer>
                                  {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                                    <button
                                      className={`${styles.times}`}
                                      type='button'
                                      onClick={() => {
                                        setConfirmationModal(s => ({
                                          ...s,
                                          visible: true,
                                          item: item.name,
                                          callback: () => {
                                            setLoader(true);
                                            deleteTrigger(item._id, () => resetConfirmationModal(), () => setLoader(false));
                                          },
                                        }));
                                      }}
                                    >
                                      <FontAwesomeIcon size='sm' icon='times' />
                                    </button>
                                  )}
                                </ConfirmationContext.Consumer>
                              </span>
                            </Col>
                          </Row>
                        ))}
                      <Row>
                        {triggers.length === 0 && (
                          <Col md={12} className='m-l-20'>
                            <div>No alert found</div>
                          </Col>
                        )}
                      </Row>
                      <Row>
                        <Col md={12}>
                          <HrDivider bold={false} color='#72a7e0' />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12}>
                          <span className='m-l-10'>
                            <button className={styles.blue} type='button' onClick={() => toggleTrigger(undefined)}>
                              <FontAwesomeIcon size='1x' icon='plus-circle' />
                              <span className='pl-1'>Add new alert</span>
                            </button>
                          </span>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </React.Fragment>
              {modalState.visible_kpi && (
                <Modal
                  isOpen={modalState.visible_kpi}
                  toggle={dismiss}
                  style={{ maxWidth: '650px' }}
                  className='darvis-modal-top'
                >
                  <KPIModal
                    kpi={modalState.kpi}
                    site={selectedSite}
                    addKPI={addKPI}
                    updateKPI={updateKPI}
                    dismiss={dismiss}
                  />
                </Modal>
              )}
              {modalState.visible_trigger && (
                <Modal
                  isOpen={modalState.visible_trigger}
                  toggle={dismiss}
                  style={{ maxWidth: '850px' }}
                  className='darvis-modal-top'
                >
                  <TriggerModal
                    trigger={modalState.trigger}
                    site={selectedSite}
                    addTrigger={addTrigger}
                    updateTrigger={updateTrigger}
                    dismiss={dismiss}
                  />
                </Modal>
              )}
              {modalState.visible_action && (
                <Modal
                  isOpen={modalState.visible_action}
                  toggle={dismiss}
                  style={{maxWidth: '600px'}}
                  className='darvis-modal-top'
                >
                  <ActionModal
                    trigger={modalState.trigger}
                    updateTrigger={updateTrigger}
                    dismiss={dismiss}
                  />
                </Modal>
              )}
            </React.Fragment>
          );
        }}
      </SitesContext.Consumer>
    </DashboardTemplate>
  );
};

export default Analytics;

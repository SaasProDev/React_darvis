import React, { useContext, useState } from 'react';
import { Row, Col, Modal } from 'reactstrap';
import uuidv1 from 'uuid';

import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import SitesContext from '../../shared/modules/sitesContext/context';
import ErrorContext from '../../shared/modules/error/context';
import CameraModel from './components/cameraModal';
import CameraAddButton from './components/cameraAddButton';
import CameraPreview from './components/cameraView';
import { connectCamera } from './service';
import { enableCamera as enableCameraService } from '../../shared/services/sites';

import {
  addCameraToSite,
  updateCameraToSite,
  deleteCamera as deleteCameraService,
} from '../../shared/services/sites';


const CamerasContainer = () => {
  const { setError } = useContext(ErrorContext);
  const [modalState, setModalState] = useState({
    camera: {},
    visible: false
  });

  const toggleModal = (camera) => {
    setModalState({
      ...modalState,
      camera,
      visible: !modalState.visible
    });
  };

  const dismiss = () => {
    setModalState({
      camera: {},
      visible: false
    });
  };

  return (
    <DashboardTemplate>
      <SitesContext.Consumer>
        {props => {
          const { selectedSite, reloadSites } = props;
          if (!selectedSite) {
            return (
              <Row className='m-t-30'>
                <h2 className='m-l-30' style={{ position: 'absolute', bottom: 0 }}>
                  Site not found
                </h2>
              </Row>
            )
          } else {
            const addCamera = async (camera, cb, errcb) => {
              try {
                camera._id = uuidv1();
                await addCameraToSite(selectedSite._id, camera);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const updateCamera = async (camera, cb, errcb) => {
              try {
                await updateCameraToSite(selectedSite._id, camera, camera.cameraPoints, camera.floorPlanPoints);
                if (cb) { cb(); }
                dismiss();
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const deleteCamera = async (cameraId, cb, errcb) => {
              try {
                await deleteCameraService(selectedSite._id, cameraId);
                if (cb) { cb(); }
                reloadSites();
              } catch (e) {
                if (errcb) { errcb(); }
                setError(e, true);
              }
            }
            const refreshCamera = async (camera) => {
              const image = await connectCamera({
                url: camera.url,
                user: camera.user,
                pass: camera.pass
              });
              if (image !== 'error' && image.length > 100) {
                //console.log('refresh');
                await updateCameraToSite(selectedSite._id, camera, camera.cameraPoints, camera.floorPlanPoints);
                reloadSites();
              }
            }
            const enableCamera = async(camera) => {
              try {
                await enableCameraService(selectedSite._id, camera._id);
                reloadSites();
              } catch(e) {

              }
            }
            return (
              <React.Fragment>
                <Row>
                  {selectedSite.cameras && selectedSite.cameras.map(cam => (
                    <Col md={2} key={cam._id}>
                      <CameraPreview
                        camera={cam}
                        updateCamera={() => { toggleModal(cam) }}
                        deleteCamera={deleteCamera}
                        refreshCamera={() => { refreshCamera(cam) }}
                        enableCamera={() => { enableCamera(cam)}}
                      />
                    </Col>
                  ))}
                </Row>
                <Row className='m-t-30'>
                  <Col md={2}>
                    <CameraAddButton handleAddClick={() => { toggleModal() }} />
                  </Col>
                </Row>
                {modalState.visible && (
                  <Modal
                    isOpen={modalState.visible}
                    toggle={() => dismiss()}
                    style={{ maxWidth: '450px' }}
                    className='darvis-modal-top'
                  >
                    <CameraModel
                      camera={modalState.camera}
                      addCamera={addCamera}
                      updateCamera={updateCamera}
                      dismiss={dismiss}
                    />
                  </Modal>
                )}
              </React.Fragment>
            )
          }
        }}

      </SitesContext.Consumer>
    </DashboardTemplate>
  );
};

export default CamerasContainer;

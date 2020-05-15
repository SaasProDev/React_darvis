import React, { useState, useEffect } from 'react';
import { Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

const CameraLevelModal = ({ site, level, attachCamera, dismiss }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [state, setState] = useState({});
  useEffect(() => {
    const cameras = site.cameras.filter(x => x.levelId !== level._id);
    setState({
      cameras: cameras
    });
  }, [site, level]);

  function handleSubmit(event, values) {
    if (event) {
      const callback = () => {
        setIsSaving(false);
      };
      const camera = state.cameras.find(x => x._id === values.cameraId);
      attachCamera(level._id, camera, callback, callback);
      setIsSaving(true);
    }
  }
  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalHeader>Add camera to level</ModalHeader>
      <ModalBody>
        <Row className="p-t-10">
          <Col>
            <AvField
              type="select"
              name="cameraId"
              label={"Select camera for the " + level.name}
              required
            >
              <option value=''>None</option>
              {(state && state.cameras && state.cameras.length > 0 && state.cameras.map(cam => (
                <option key={cam._id} value={cam._id}>
                  {cam.name}
                </option>
              ))
              )}
            </AvField>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        {isSaving ? (
          <Spinner />
        ) : (
            <React.Fragment>
              <Button type="submit" color="primary" size="sm">
                Add to level
              </Button>
              <Button type="button" color="primary" size="sm" onClick={dismiss}>
                Cancel
              </Button>
            </React.Fragment>
          )}
      </ModalFooter>
    </AvForm>
  );
};

CameraLevelModal.defaultProps = {

};

export default CameraLevelModal;

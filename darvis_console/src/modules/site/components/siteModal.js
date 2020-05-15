import React from 'react';
import { Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Logger from '../../../shared/modules/logger';

const SiteModal = ({ siteName, updateSite, dismiss }) => {
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSubmit(event, values) {
    if (event) {
      const callback = () => {
        setIsSaving(false);
      };
      setIsSaving(true);
      if (siteName !== values.name) {
        updateSite(values.name, () => callback(), () => callback());
      }
    }
  }
  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalHeader>Edit site</ModalHeader>
      <ModalBody>
        <Row className="p-t-10">
          <Col>
            <AvField
              type="text"
              name="name"
              label="Change your site name as"
              value={siteName}
              validate={{
                required: { value: true, errorMessage: 'Please enter a valid name' },
                minLength: { value: 3, errorMessage: 'Your name must be between 3 and 50 characters' },
                maxLength: { value: 50, errorMessage: 'Your name must be between 3 and 50 characters' },
              }}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        {isSaving ? (
          <Spinner />
        ) : (
            <React.Fragment>
              <Button type="submit" color="primary" size="sm">
                Update site
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

SiteModal.defaultProps = {
  siteName: '',
  updateSite: license => Logger.info(license),
};

export default SiteModal;

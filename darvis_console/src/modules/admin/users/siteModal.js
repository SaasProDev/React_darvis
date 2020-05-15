import React from 'react';
import { Row, Col, Button, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Logger from '../../../shared/modules/logger';

const SiteModal = ({ initialValues = {}, addSite, updateSite }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const formData = {
    name: initialValues.site ? initialValues.site.name : '',
    user: initialValues.user ? initialValues.user._id : undefined,
    organization:
      initialValues.user && initialValues.user.organization ? initialValues.user.organization._id : undefined,
  };

  function handleSubmit(actions, values) {
    const callback = () => {
      setIsLoading(false);
    };
    setIsLoading(true);
    formData.name = values.name;
    if (initialValues.site) {
      updateSite({ name: values.name }, initialValues.site._id, () => callback(), () => callback());
    } else {
      addSite({ name: values.name, user: initialValues.user }, () => callback(), () => callback());
    }
  }
  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalHeader>{initialValues.site ? 'Edit ' : 'Add '}site</ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <b>User</b>: &nbsp; {initialValues.user ? initialValues.user.name : ''}
          </Col>
          <Col>
            <b>Organization</b>: &nbsp;{' '}
            {initialValues.user && initialValues.user.organization ? initialValues.user.organization.name : ''}
          </Col>
        </Row>
        <Row className="p-t-20">
          <Col>
            <AvField
              type="text"
              name="name"
              label="Name"
              value={formData.name}
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
        {isLoading ? (
          <Spinner />
        ) : (
          <Button type="submit" color="primary" size="sm">
            {initialValues.site ? 'Update' : 'Add'} Site
          </Button>
        )}
      </ModalFooter>
    </AvForm>
  );
};

SiteModal.defaultProps = {
  initialValues: {},
  addSite: license => Logger.info(license),
  updateSite: license => Logger.info(license),
};

export default SiteModal;

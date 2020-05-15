import React, { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Form, FormGroup, Label, Input, Button, ModalFooter, ModalBody, FormFeedback, Spinner } from 'reactstrap';
import * as Yup from 'yup';

import Logger from '../../../shared/modules/logger';
import ErrorContext from '../../../shared/modules/error/context';
import { getLicenses } from '../../../shared/services/license';

const licenseSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Min 4 Characters!!')
    .max(50, 'Max 50 allowed')
    .required('Name Required'),
  site: Yup.string().url('Must be a valid URL'),
  license: Yup.string().required('Please select a license'),
});

const AddEditOrganizations = ({ initialValues, addOrg, updateOrg }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [licenses, setLicenses] = useState({
    loading: false,
    data: [],
  });
  const { setError } = React.useContext(ErrorContext);

  useEffect(() => {
    const fetchLicenses = async () => {
      setLicenses(l => ({
        ...l,
        loading: true,
      }));
      try {
        const data = await getLicenses();
        setLicenses({
          data,
          loading: false,
        });
      } catch (e) {
        setError(e, true);
        setLicenses({
          data: [],
          loading: false,
        });
      }
    };
    fetchLicenses();
  }, [setLicenses, setError]);

  if (licenses.loading) {
    return (
      <ModalBody style={{ textAlign: 'center ' }}>
        <Spinner />
        <br />
        <br />
        Loading Licenses...
      </ModalBody>
    );
  }

  return (
    <Formik
      initialValues={{
        name: initialValues.name || '',
        site: initialValues.site || '',
        license: initialValues.license ? initialValues.license._id : '',
      }}
      validationSchema={licenseSchema}
      onSubmit={(values, actions) => {
        const callback = () => {
          actions.setSubmitting(false);
          setIsLoading(false);
        };
        setIsLoading(true);
        if (initialValues._id) {
          updateOrg(values, initialValues._id, () => callback(), () => callback());
        } else {
          addOrg(values, () => callback(), () => callback());
        }
      }}
    >
      {props => {
        const { values, isValid, isDirty, errors, handleSubmit, handleChange, handleBlur, isSubmitting } = props;

        return (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  invalid={!!errors.name}
                  id="name"
                  tag={Field}
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <ErrorMessage name="name" component="div">
                  {errorMessage => <FormFeedback>{errorMessage}</FormFeedback>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <Label for="site">Site</Label>
                <Input
                  id="site"
                  invalid={!!errors.site}
                  tag={Field}
                  name="site"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.site}
                />
                <ErrorMessage name="site" component="div">
                  {errorMessage => <FormFeedback>{errorMessage}</FormFeedback>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <Label for="license">License</Label>
                <Input
                  type="select"
                  name="license"
                  id="license"
                  invalid={!!errors.license}
                  // tag={Field}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.license}
                >
                  <option>None</option>
                  {licenses.data.map(license => (
                    <option key={license._id} value={license._id}>
                      {license.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              {isLoading ? (
                <Spinner />
              ) : (
                <Button type="submit" color="info" size="sm" disabled={isSubmitting || !isValid || !!isDirty}>
                  {initialValues._id ? 'Update' : 'Add'} Organization
                </Button>
              )}
            </ModalFooter>
          </Form>
        );
      }}
    </Formik>
  );
};

AddEditOrganizations.defaultProps = {
  initialValues: {},
  addOrg: license => Logger.info(license),
  updateOrg: license => Logger.info(license),
};

export default AddEditOrganizations;

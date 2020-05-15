import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { Form, FormGroup, Label, Input, Button, ModalFooter, ModalBody, FormFeedback, Spinner } from 'reactstrap';
import moment from 'moment';
import * as Yup from 'yup';
import Logger from '../../../shared/modules/logger';

const formatDate = date => moment(date).format('YYYY-MM-D');

const licenseSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Min 4 Characters!!')
    .max(50, 'Max 50 allowed')
    .required('Name Required'),
  allowedUsers: Yup.number('Should be a number').required('Set allowed users'),
  expiry: Yup.date().required('Date is required'),
});

const AddEditLicense = ({ initialValues, addLicense, updateLicense }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Formik
      initialValues={{
        name: initialValues.name || '',
        allowedUsers: initialValues.allowedUsers || 1,
        isActive: initialValues.isActive || false,
        expiry: (() => {
          if (initialValues.expiry) {
            return formatDate(initialValues.expiry);
          }
          return formatDate(moment().add(1, 'years'));
        })(),
      }}
      validationSchema={licenseSchema}
      onSubmit={(values, actions) => {
        const callback = () => {
          actions.setSubmitting(false);
          setIsLoading(false);
        };
        setIsLoading(true);
        if (initialValues._id) {
          updateLicense(values, initialValues._id, () => callback(), () => callback());
        } else {
          addLicense(values, () => callback(), () => callback());
        }
      }}
    >
      {props => {
        const {
          values,
          isValid,
          isDirty,
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          isSubmitting,
        } = props;

        return (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  invalid={!!errors.name}
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
                <Label>Allowed Users</Label>
                <Input
                  tag={Field}
                  name="allowedUsers"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.allowedUsers}
                />
                <ErrorMessage name="allowedUsers" component="div">
                  {errorMessage => <FormFeedback>{errorMessage}</FormFeedback>}
                </ErrorMessage>
              </FormGroup>

              <FormGroup>
                <Label>Expiry Date</Label>
                <Input
                  tag={Field}
                  name="expiry"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formatDate(values.expiry)}
                />
                {errors.expiry && touched.expiry && errors.expiry}
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={values.isActive}
                    onChange={handleChange}
                    name="isActive"
                    tag={Field}
                    value={values.isActive}
                  />{' '}
                  isActive
                </Label>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              {isLoading ? (
                <Spinner />
              ) : (
                <Button type="submit" color="info" size="sm" disabled={isSubmitting || !isValid || !!isDirty}>
                  {initialValues._id ? 'Update' : 'Add'} License
                </Button>
              )}
            </ModalFooter>
          </Form>
        );
      }}
    </Formik>
  );
};

AddEditLicense.defaultProps = {
  initialValues: {},
  addLicense: license => Logger.info(license),
  updateLicense: license => Logger.info(license),
};

export default AddEditLicense;

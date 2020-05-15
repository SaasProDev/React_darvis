import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Row, Col, Button, ModalFooter, ModalBody, ModalHeader, Spinner } from 'reactstrap';

import Logger from '../../../shared/modules/logger';
import ErrorContext from '../../../shared/modules/error/context';
import { getOrganizations } from '../../../shared/services/organization';
import { getRoles, ROLES } from '../../../shared/services/role';

const UserModal = ({ user, addUser, updateUser, dismiss }) => {
  useLayoutEffect(() => {
    // component will mount
    setFlags(s => ({ ...s, mounted: true }));
    // component will unmount
    return () => {
      setFlags(s => ({ ...s, mounted: false }));
    }
  }, [])
  const [flags, setFlags] = useState({
    mounted: false,
    saving: false,
    incorrectPassword: false,
  })
  const { setError } = useContext(ErrorContext);
  // set form data from props
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (flags.mounted) {
      setFormData({
        name: user ? user.name : '',
        email: user ? user.email : '',
        password: '',
        confirmPassword: '',
        role: user ? user.role._id : '',
        organization: user ? user.organization._id : '',
      })
    }
  }, [user, flags.mounted])

  // load organizations and roles at the beginning
  const [initialData, setInitialData] = useState({
    loading: false,
    organizations: [],
    roles: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      setInitialData(d => ({
        ...d,
        loading: true,
      }));
      try {
        const organizations = await getOrganizations();
        const allRoles = await getRoles();
        const roles = [];
        // just only shows Super-admin, owner, god
        if (allRoles) {
          allRoles.map(item => {
            if (item.key === ROLES.ADMIN || item.key === ROLES.OWNER || item.key === ROLES.GOD) {
              roles.push(item);
            }
            return null;
          });
        }
        setInitialData({
          organizations,
          roles,
          loading: false,
        });
      } catch (e) {
        setError(e, true);
        setInitialData({
          organizations: [],
          roles: [],
          loading: false,
        });
      }
    };
    if (flags.mounted) {
      fetchData();
    }
  }, [setError, flags.mounted]);

  const handleSubmit = (event, values) => {
    if (flags.mounted) {
      const callback = () => {
        setFlags(s => ({ ...s, saving: false }));
      };
      setFlags(s => ({ ...s, saving: true }));
      if (user) {
        updateUser(values, user._id, () => callback(), () => callback());
      } else {
        if (values.password !== values.confirmPassword) {
          setFlags(s => ({ ...s, incorrectPassword: true, saving: false }));
        } else {
          addUser(values, () => callback(), () => callback());
        }
      }
    }
  }

  if (formData.loading) {
    return (
      <ModalBody style={{ textAlign: 'center ' }}>
        <Spinner />
        <br />
        <br />
        Loading Roles/Organizations...
      </ModalBody>
    );
  }
  if (!flags.mounted) {
    return (
      <ModalBody style={{ textAlign: 'center' }}>
        <Spinner />
      </ModalBody>
    )
  }
  return (
    <AvForm onValidSubmit={handleSubmit}>
      <ModalHeader>{user ? 'Edit ' : 'Add '}User</ModalHeader>
      <ModalBody>
        <Row>
          <Col>
            <AvField
              type="text"
              name="name"
              label="Name"
              value={formData.name}
              validate={{
                required: { value: true, errorMessage: 'Please enter a valid name' },
                minLength: { value: 5, errorMessage: 'Your name must be between 5 and 50 characters' },
                maxLength: { value: 50, errorMessage: 'Your name must be between 5 and 50 characters' },
              }}
            />
          </Col>
          <Col>
            <AvField type="email" name="email" label="Email" value={formData.email} required />
          </Col>
        </Row>
        {!user && (
          <Row>
            <Col>
              <AvField 
                type="password" 
                name="password" 
                label="Password" 
                onChange={() => {setFlags(s=> ({...s, incorrectPassword: false}))}}
                required />
            </Col>
            <Col>
              <AvField
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                onChange={() => {setFlags(s=> ({...s, incorrectPassword: false}))}}
                required
              />
            </Col>
          </Row>
        )}
        {flags.incorrectPassword && (
          <Row>
            <Col>
              <span className='m-l-5' style={{ fontSize: '12px', color: '#f00' }}>Passwords do not match</span>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <AvField
              type="select"
              name="role"
              label="Role"
              required
              value={formData.role}
            >
              <option value="">None</option>
              {initialData.roles && initialData.roles.map(item => (
                <option key={item._id} value={item._id} disabled={item.key === ROLES.GOD}>
                  {item.name}
                </option>
              ))}
            </AvField>
          </Col>
          <Col>
            <AvField
              type="select"
              name="organization"
              label="Organization"
              required
              value={formData.organization}
            >
              <option value="">None</option>
              {initialData.organizations && initialData.organizations.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </AvField>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        {flags.saving ? (
          <Spinner />
        ) : (
            <React.Fragment>
              <Button type="submit" color="primary" size="sm">
                {user ? 'Update' : 'Add'} User
              </Button>
              <Button type='button' color='primary' size='sm' onClick={dismiss}>
                Cancel
              </Button>
            </React.Fragment>
          )}
      </ModalFooter>
    </AvForm>
  );
};

UserModal.defaultProps = {
  addUser: license => Logger.info(license),
  updateUser: license => Logger.info(license),
};

export default UserModal;

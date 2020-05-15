import React, { useState, useEffect, useContext } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Spinner } from 'reactstrap';
import Select from 'react-select';
import ErrorContext from '../../../shared/modules/error/context';
import Logger from '../../../shared/modules/logger';
import { getRoles, isManager, ROLES } from '../../../shared/services/role';


const AddEditSiteUser = ({ user, site, addUser, editUser, dismiss }) => {
  const { setError } = useContext(ErrorContext);
  const [isError, setIsError] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    levels: []
  });
  useEffect(() => {
    if(user && user.levels) {

    }
    setFormData({
      name: user ? user.name : '',
      email: user ? user.email : '',
      role: user && user.role ? user.role._id : '',
      levels: user ? user.levels : [],
      isViewer: user && user.role && user.role.name === ROLES.VIEWER ? true : false
    });
  }, [user]);

  const [initialData, setInitialData] = useState({
    roles: [],
    levels: [],
    loading: false
  });
  useEffect(() => {
    const fetchData = async () => {
      setInitialData(d => ({
        ...d,
        loading: true
      }));
      try {
        let roles = await getRoles();
        if (roles) {
          const sadmin = roles.find(x => x.key === ROLES.ADMIN);
          const owner = roles.find(x => x.key === ROLES.OWNER);
          const god = roles.find(x => x.key === ROLES.GOD);
          roles.splice(roles.indexOf(sadmin), 1);
          roles.splice(roles.indexOf(owner), 1);
          roles.splice(roles.indexOf(god), 1);
          if (isManager()) {
            // remove role for manager
            const manager = roles.find(x => x.key === ROLES.MANAGER);
            roles.splice(roles.indexOf(manager), 1);
          }
        } else {
          roles = [];
        }
        const levels = [];
        
        if (site) {
          site.levels.map(l => (
            levels.push({ label: l.name, value: { id: l.id, name: l.name } })
          ));
        }
        setInitialData({
          roles,
          levels,
          loading: false
        });

      } catch (e) {
        setError(e.message, true);
        setInitialData({
          roles: undefined,
          levels: [],
          loading: false
        });
      }
    }
    fetchData();
  }, [setError, site]);

  const handleSubmit = (event, values) => {
    const callback = () => {
      setIsSaving(false);
    };
    const errCallback = () => {
      setIsSaving(false);
    };
    setIsSaving(true);

    if(values.password !== values.confirm) {
      //setError({fail: true, message: 'Password not match'}, true);
      setIsError(true);
      setIsSaving(false);
      return;
    }

    if (formData.isViewer) {
      values.levels = formData.levels;
    }
    if (user) {
      user.name = values.name;
      user.email = values.email;
      user.role = values.role;
      if(values.levels) {
        user.levels = values.levels;
      }
      editUser(user, () => callback(), () => errCallback());
    } else {
      addUser(values, () => callback(), () => errCallback());
    }
  }

  const onRoleChanged = (event, value) => {
    const role = initialData.roles.find(x => x._id === value);
    if (role && role.name === ROLES.VIEWER) {
      setFormData(s => ({
        ...s,
        isViewer: true
      }));
    } else {
      setFormData(s => ({
        ...s,
        isViewer: false
      }));
    }
  }
  return (
    <React.Fragment>
      <AvForm onValidSubmit={handleSubmit}>
        <ModalHeader>{user ? 'Edit ' : 'Add '}User</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={5}>
              <AvField
                type='text'
                name='name'
                label='Name'
                value={formData.name}
                validate={{
                  required: { value: true, errorMessage: 'Please enter a valid name' },
                  minLength: { value: 5, errorMessage: 'Your name must be between 5 and 15 characters' },
                  maxLength: { value: 15, errorMessage: 'Your name must be between 5 and 15 characters' },
                }}
                required
              />
            </Col>
            <Col md={7}>
              <AvField
                type='email'
                name='email'
                label='Email'
                value={formData.email}
                required
              />
            </Col>
          </Row>
          {!user && (
            <Row>
              <Col md={5}>
                <AvField
                  type='password'
                  name='password'
                  label='Password'
                  value=''
                  required
                  onChange={() => {setIsError(false)}}
                />

              </Col>
              <Col md={7}>
                <AvField
                  type='password'
                  name='confirm'
                  label='Confirm Password'
                  value=''
                  required
                  onChange={() => {setIsError(false)}}
                />
              </Col>
            </Row>
          )}
          {isError && (
          <Row>
            <Col md={{size: 4, offset: 5}}>
              <span style={{color: '#f00', fontSize:'12px'}} >*passwords do not match</span>
            </Col>
          </Row>)}
          <Row>
            <Col md={5}>
              <AvField
                type='select'
                name='role'
                label='Role'
                required
                value={formData.role}
                onChange={onRoleChanged}
              >
                <option value=''>None</option>
                {(initialData.roles && initialData.roles.length > 0) && (
                  initialData.roles.map(item => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))
                )}
              </AvField>
            </Col>
            <Col md={7}>
              <label>Levels</label>
              {initialData.levels &&
                (<Select
                  options={initialData.levels}
                  value={formData.levels}
                  onChange={selected => setFormData(s => ({ ...s, levels: selected }))}
                  isMulti
                  isDisabled={!formData.isViewer}
                />)}
            </Col>
          </Row>
          
        </ModalBody>
        <ModalFooter>
          {isSaving ? (
            <Spinner />
          ) : (
              <React.Fragment>
                <Button type='submit' color='primary' size='sm'>
                  {user ? 'Update ' : 'Add '}User
                </Button>
                <Button type='button' color='primary' size='sm' onClick={dismiss}>
                  Cancel
                </Button>
              </React.Fragment>
            )}

        </ModalFooter>
      </AvForm>
    </React.Fragment>
  )
}

AddEditSiteUser.defaultProps = {
  initialValues: {},
  addUser: license => Logger.info(license),
  editUser: license => Logger.info(license),
};

export default AddEditSiteUser;


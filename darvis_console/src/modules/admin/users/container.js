import React, { useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Modal } from 'reactstrap';
import Card from '../../../shared/molecules/card';

import {
  getUsers,
  addUser as addUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../../../shared/services/users';
import {
  addSite as addSiteService,
  updateSite as updateSiteService,
  deleteSite as deleteSiteService,
} from '../../../shared/services/sites';

import ErrorContext from '../../../shared/modules/error/context';
import UserModal from './userModal';
import SiteModal from './siteModal';
import UserTable from './userTable/index';
import { ROLES } from '../../../shared/services/role';

const UsersContainer = () => {
  const [state, setState] = useState({
    users: [],
    reset: 0,
    loading: false,
  });
  const [modalState, setModalState] = useState({
    visible_site: false,
    visible_user: false,
    user: undefined,
    site: undefined,
    loading: false,
  });
  const [reload, setReload] = useState(0);
  const { setError } = useContext(ErrorContext);

  // fetch data when reload changed
  useEffect(() => {
    async function fetchAllUsers() {
      setState(s => ({ ...s, loading: true }));
      try {
        const allUsers = await getUsers();
        const users = [];
        if (allUsers) {
          allUsers.map(item => {
            if (item.role.key === ROLES.ADMIN || item.role.key === ROLES.OWNER) {
              users.push(item);
            }
            return null;
          })
        }
        setState(s => ({ ...s, users, loading: false }));
      } catch (e) {
        setError(e, true);
        setState(s => ({ ...s, users: [], loading: false }));
      }
    }
    fetchAllUsers();
  }, [setError, reload]);

  // add new user
  const addUser = async (user, callback, errorCallback) => {
    try {
      delete user.confirmPassword;
      await addUserService(user);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, user: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const updateUser = async (user, id, callback, errorCallback) => {
    try {
      await updateUserService(user, id);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, user: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const deleteUser = async (user, callback, errorCallback) => {
    try {
      await deleteUserService(user._id);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const addSite = async (site, callback, errorCallback) => {
    try {
      await addSiteService(site);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, site: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const updateSite = async (site, siteId, callback, errorCallback) => {
    try {
      await updateSiteService(site, siteId);

      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, site: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const deleteSite = async (siteId, callback, errCallback) => {
    try {
      await deleteSiteService(siteId);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
    } catch (e) {
      if (errCallback) {
        errCallback();
      }
      setError(e, true);
    }
  };

  function toggleUserModal(user) {
    // user mode
    setModalState(s => ({
      ...s,
      visible_user: !modalState.visible_user,
      user,
    }));
  }

  function toggleSiteModal(user, site) {
    setModalState(s => ({
      ...s,
      visible_site: !modalState.visible_site,
      user,
      site,
    }));
  }

  function dismiss() {
    setModalState({
      visible_site: false,
      visible_user: false,
      user: undefined,
      site: undefined,
      loading: false,
    })
  }
  const renderAction = () => {
    return (
      <Button size="sm" color="primary" className="float-right" onClick={() => toggleUserModal(undefined)}>
        Add User
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card header="Users" actionHandler={renderAction()}>
            {state.loading ? (
              <span>Loading...</span>
            ) : (
                <UserTable
                  users={state.users}
                  editUser={user => toggleUserModal(user)}
                  deleteUser={deleteUser}
                  addSite={user => toggleSiteModal(user)}
                  editSite={(user, site) => toggleSiteModal(user, site)}
                  deleteSite={deleteSite}
                />
              )}
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={modalState.visible_user}
        toggle={() => { toggleUserModal(undefined) }}
        style={{ maxWidth: '550px' }}>
        <UserModal
          user={modalState.user}
          addUser={addUser}
          updateUser={updateUser}
          dismiss={dismiss}
          className='darvis-modal-top'
        />
      </Modal>
      <Modal 
        isOpen={modalState.visible_site} 
        toggle={toggleSiteModal} 
        style={{ maxWidth: '450px' }} 
        className='darvis-modal-top'>
        <SiteModal
          initialValues={{ site: modalState.site, user: modalState.user }}
          updateSite={updateSite}
          addSite={addSite}
          dismiss={dismiss}
        />
      </Modal>
    </React.Fragment>
  );
};

export default UsersContainer;

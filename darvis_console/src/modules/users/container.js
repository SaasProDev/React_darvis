import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Modal } from 'reactstrap';
// import styles from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AddEditSiteUser from './components/addEditSiteUser';
import DashboardTemplate from '../../shared/templates/dashboardTemplate';
import Card from '../../shared/molecules/card'
import SitesContext from '../../shared/modules/sitesContext/context';
import {
  addUser as addUserService,
  getUsersByOwner,
  updateUser as updateUserService,
  deleteUser as deleteUserService
} from '../../shared/services/users';
import ErrorContext from '../../shared/modules/error/context';
import HrDivider from '../../shared/atoms/hrDivider';
import ConfirmationContext from '../../shared/modules/confirmationModal/context';
import styles from './styles.module.scss';
import { isOwner, isManager, ROLES } from '../../shared/services/role';

const UserManagementContainer = () => {
  const { setError } = useContext(ErrorContext);
  const [tableData, setTableData] = useState({
    siteUsers: [],
    loading: false,
  });
  const [modalState, setModalState] = useState({
    visible: false,
    siteUser: undefined,
    loading: false
  });

  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function fetchAllUsers() {
      setTableData(s => ({ ...s, loading: true }));
      try {
        const site = JSON.parse(localStorage.getItem('selectedSite'));
        const users = await getUsersByOwner(site.owner._id);
        setTableData({
          siteUsers: users,
          loading: false
        });
      } catch (e) {
        setError(e, true);
        setTableData(s => ({ ...s, loading: false }))
      }
    }
    fetchAllUsers();
  }, [reload, setError])

  function toggleModal(user) {
    setModalState(s=> ({
      ...s,
      siteUser: user,
      visible: !modalState.visible,
    }));
  }

  // add user button
  const renderAction = () => {
    return (
      <Button size="sm" color="primary" className="float-right" onClick={() => toggleModal(undefined)}>
        Add User
      </Button>
    );
  };
  return (
    <DashboardTemplate>
      <SitesContext.Consumer>
        {props => {
          const { selectedSite } = props;

          const getLevelName = (item) => {
            if(item && item.length > 0) {
              let levels = '';
              item.map(l => (
                levels += l.value.name + ' , '
              ));
              levels = levels.substring(0, levels.length - 2);
              return levels;
            } else {
              return '';
            }
          }

          const addSiteUser = async (user, callback, errCallback) => {
            try {
              user.owner = selectedSite.owner._id;
              user.organization = selectedSite.owner.organization;
              delete user.confirm;
              await addUserService(user);
              if (callback) {
                callback();
              }
              setModalState({ visible: false, siteUser: undefined });
              setReload(reload + 1);
            } catch (e) {
              if (errCallback) {
                errCallback();
              }
            }
          }

          const updateSiteUser = async (user, callback, errCallback) => {
            try {
              await updateUserService(user, user._id);
              if (callback) {
                callback();
              }
              setModalState({ visible: false, siteUser: undefined });
              setReload(reload + 1);
            } catch (e) {
              if (errCallback) {
                errCallback();
              }
            }
          }

          const deleteSiteUser = async (user, callback, errCallback) => {
            try {
              await deleteUserService(user._id);
              if (callback) {
                callback();
              }
              setReload(reload + 1);
            } catch (e) {
              if (errCallback) {
                errCallback(e);
              }
              setError(e, true);
            }
          }

          return (
            <React.Fragment>
              <Row>
                <Col md={12}>
                  <Card header="Users" actionHandler={renderAction()}>
                    <Row>
                      <Col md={2}><strong className='m-l-10'>Name</strong></Col>
                      <Col md={3}><strong>Email</strong></Col>
                      <Col md={2}><strong>Role</strong></Col>
                      <Col md={4}><strong>Level</strong></Col>
                      <Col md={1}><strong>#</strong></Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <HrDivider bold={false} color="#72a7e0" />
                      </Col>
                    </Row>
                    {(tableData.siteUsers && tableData.siteUsers.length > 0) ? (
                      tableData.siteUsers.map(item => (
                        <Row key={item._id} className='m-t-10'>
                          <Col md={2}><span className='m-l-10'>{item.name}</span></Col>
                          <Col md={3}>{item.email}</Col>
                          <Col md={2}>{item.role.name}</Col>
                          <Col md={4}>{getLevelName(item.levels)}</Col>
                          <Col md={1}>
                            <button className={`${styles.blue} pr-2`} type="button" onClick={() => toggleModal(item)}>
                              <FontAwesomeIcon icon="edit" />
                            </button>
                            {(isOwner() || (isManager() && (item.role.name !== ROLES.MANAGER))) && (<ConfirmationContext.Consumer>
                              {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                                <button
                                  className={`${styles.blue}`}
                                  type="button"
                                  onClick={() =>
                                    setConfirmationModal(s => ({
                                      ...s,
                                      visible: true,
                                      item: item.name,
                                      callback: () => {
                                        setLoader(true);
                                        deleteSiteUser(item, () => resetConfirmationModal(), () => setLoader(false));
                                      },
                                    }))
                                  }
                                >
                                  <FontAwesomeIcon icon="trash" />
                                </button>
                              )}
                            </ConfirmationContext.Consumer>)}
                            
                          </Col>
                        </Row>
                      ))
                    ) : (
                        <Row>
                          <Col md={12}>
                            <span className='m-l-20'>No user found</span>
                          </Col>
                        </Row>
                      )}
                  </Card>
                </Col>
              </Row>

              <Modal
                isOpen={modalState.visible}
                toggle={toggleModal}
                style={{ maxWidth: '650px' }}
                className="darvis-modal-top"
              >
                <AddEditSiteUser
                  user={modalState.siteUser}
                  site={selectedSite}
                  addUser={addSiteUser}
                  editUser={updateSiteUser}
                  dismiss={() => toggleModal(undefined)}
                />
              </Modal>
            </React.Fragment>
          )
        }}
      </SitesContext.Consumer>
    </DashboardTemplate>
  )
};

export default UserManagementContainer;
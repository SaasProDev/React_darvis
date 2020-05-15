import React, { useState, useEffect, useContext } from 'react';
import { Col, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import HrDivider from '../../../../shared/atoms/hrDivider';
import ConfirmationContext from '../../../../shared/modules/confirmationModal/context';
import ErrorContext from '../../../../shared/modules/error/context';
import { ROLES } from '../../../../shared/services/role';
import { getSitesbyUser as callSitesByUser } from '../../../../shared/services/sites';

import styles from './styles.module.scss';

const UserField = ({ user, index, editUser, deleteUser, addSite, editSite, deleteSite }) => {
  const { setError } = useContext(ErrorContext);
  const [initialData, setInitialData] = useState({
    site: undefined,
    loading: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setInitialData(d => ({
        ...d,
        loading: true,
      }));
      try {
        const sites = await callSitesByUser(user._id);
        if (sites && sites !== '') {
          setInitialData({
            site: sites[0],
            loading: false,
          });
        }
      } catch (e) {
        setError(e, true);
        setInitialData({
          site: undefined,
          loading: false,
        });
      }
    };
    if (user.role.key !== ROLES.ADMIN) {
      fetchData();
    }
  }, [user, setError]);

  // if data is loading then spin
  if (initialData.loading) {
    return (
      <Spinner />
    )
  };

  const renderSite = () => {
    return (
      <React.Fragment>
        {initialData.site && (
          <Row key={initialData.site._id} className="m-t-5">
            <Col md={{ size: 3, offset: 1 }}>{initialData.site.name}</Col>
            <Col>
              <button className={`${styles.blue} pr-2`} type="button" onClick={() => editSite(user, initialData.site)}>
                <FontAwesomeIcon icon="edit" />
              </button>
              <ConfirmationContext.Consumer>
                {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                  <button
                    className={`${styles.times}`}
                    type="button"
                    onClick={() =>
                      setConfirmationModal(s => ({
                        ...s,
                        visible: true,
                        item: initialData.site.name,
                        callback: () => {
                          setLoader(true);
                          deleteSite(initialData.site._id, () => resetConfirmationModal(), () => setLoader(false));
                        },
                      }))
                    }
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                )}
              </ConfirmationContext.Consumer>
            </Col>
          </Row>
        )}

        <Row className='m-t-5'>
          <Col md={{ size: 5, offset: 1 }}>
            <button className={styles.blue} type="button" onClick={() => addSite(user)}>
              <FontAwesomeIcon size="1x" icon="plus-circle" />
              <span className="pl-1">Add new site</span>
            </button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <HrDivider bold={false} color="#72a7e0" />
        </Col>
      </Row>
      <Row className="p-l-20 p-r-20">
        <Col sm={1} className="pt-2 pb-2">
          {index}
        </Col>
        <Col sm={2} className="pt-2 pb-2">
          {user.name}
        </Col>
        <Col sm={3} className="pt-2 pb-2">
          {user.email}
        </Col>
        <Col sm={2} className="pt-2 pb-2">
          {user.organization && user.organization.name}
        </Col>
        <Col sm={2} className="pt-2 pb-2">
          {user.role && user.role.name}
        </Col>
        <Col sm={2} className="pt-2 pb-2">
          <span>
            <button className={`${styles.blue} pr-3`} type="button" onClick={() => editUser(user)}>
              <FontAwesomeIcon icon="edit" />
            </button>
            {user.role.key !== ROLES.ADMIN && (
              <ConfirmationContext.Consumer>
                {({ setConfirmationModal, resetConfirmationModal, setLoader }) => (
                  <button
                    className={`${styles.times}`}
                    type="button"
                    onClick={() =>
                      setConfirmationModal(s => ({
                        ...s,
                        visible: true,
                        item: user.name,
                        callback: () => {
                          setLoader(true);
                          deleteUser(user, () => resetConfirmationModal(), () => setLoader(false));
                        },
                      }))
                    }
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                )}
              </ConfirmationContext.Consumer>
            )}
          </span>
        </Col>
      </Row>
      {user.role.key !== ROLES.ADMIN && renderSite()}
    </React.Fragment>
  );
};

UserField.defaultProps = {
  editUser: () => { },
  deleteUser: () => { },
  addSite: () => { },
  editSite: () => { },
  deleteSite: () => { },
};

export default UserField;

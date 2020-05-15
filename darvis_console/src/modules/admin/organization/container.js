import React, { useEffect, useContext, useState } from 'react';
import { Row, Col, Button, ModalHeader, Modal } from 'reactstrap';

import Card from '../../../shared/molecules/card';
import {
  getOrganizations,
  addOrganization,
  deleteOrganization,
  updateOrganization,
} from '../../../shared/services/organization';
import ErrorContext from '../../../shared/modules/error/context';
import OrgPage from './orgPage';
import AddEditOrganizations from './addEditOrganization';

const LicenseContainer = () => {
  const [state, setState] = useState({
    orgs: [],
    reset: 0,
    isLoading: false,
  });
  const [modalState, setModalState] = useState({
    visible: false,
    org: undefined,
  });
  const [reload, setReload] = useState(0);
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    async function fetchAllLicenses() {
      setState(s => ({ ...s, isLoading: true }));
      try {
        const orgs = await getOrganizations();
        setState(s => ({ ...s, orgs, isLoading: false }));
      } catch (e) {
        setError(e, true);
        setState(s => ({ ...s, isLoading: false }));
      }
    }

    fetchAllLicenses();
  }, [setError, reload]);

  const add = async (org, callback, errorCallback) => {
    try {
      await addOrganization(org);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, org: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const update = async (org, id, callback, errorCallback) => {
    try {
      await updateOrganization(org, id);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, org: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const remove = async (id, callback, errorCallback) => {
    try {
      await deleteOrganization(id);
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

  const toggleModal = () =>
    setModalState({
      ...modalState,
      visible: !modalState.visible,
      org: undefined,
    });

  const renderAction = () => {
    return (
      <Button size="sm" color="primary" className="float-right" onClick={toggleModal}>
        Add Organization
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card header="Organizations" actionHandler={renderAction()}>
            {state.isLoading ? (
              <span>Loading...</span>
            ) : (
              <OrgPage
                orgs={state.orgs}
                editAction={org => {
                  setModalState({
                    ...modalState,
                    visible: true,
                    org,
                  });
                }}
                deleteOrg={remove}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modalState.visible} toggle={toggleModal} style={{ maxWidth: '350px' }}>
        <ModalHeader toggle={toggleModal}>Add Organization</ModalHeader>
        <AddEditOrganizations initialValues={modalState.org} updateOrg={update} addOrg={add} />
      </Modal>
    </React.Fragment>
  );
};

export default LicenseContainer;

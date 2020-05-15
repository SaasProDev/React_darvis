import React, { useEffect, useContext, useState } from 'react';
import { Row, Col, Button, Modal, ModalHeader } from 'reactstrap';

import Card from '../../../shared/molecules/card';
import { getLicenses, addLicense, updateLicense, deleteLicense } from '../../../shared/services/license';
import ErrorContext from '../../../shared/modules/error/context';
import LicensePage from './licensePage';
import AddEditLicense from './addEditLicense';

const LicenseContainer = () => {
  const [state, setState] = useState({
    licenses: [],
    reset: 0,
    isLoading: false,
  });
  const [modalState, setModalState] = useState({
    visible: false,
    license: undefined,
  });
  const [reload, setReload] = useState(0);
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    async function fetchAllLicenses() {
      setState(s => ({ ...s, isLoading: true }));
      try {
        const licenses = await getLicenses();
        setState(s => ({ ...s, licenses, isLoading: false }));
      } catch (e) {
        setError(e, true);
        setState(s => ({ ...s, isLoading: false }));
      }
    }

    fetchAllLicenses();
  }, [setError, reload]);

  const add = async (license, callback, errorCallback) => {
    try {
      await addLicense(license);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, license: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const update = async (license, id, callback, errorCallback) => {
    try {
      await updateLicense(license, id);
      if (callback) {
        callback();
      }
      setReload(reload + 1);
      setModalState({ visible: false, license: undefined });
    } catch (e) {
      if (errorCallback) {
        errorCallback(e);
      }
      setError(e, true);
    }
  };

  const remove = async (id, callback, errorCallback) => {
    try {
      await deleteLicense(id);
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
      license: undefined,
    });

  const renderAction = () => {
    return (
      <Button size="sm" color="primary" className="float-right" onClick={toggleModal}>
        Add License
      </Button>
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card header="Licenses" actionHandler={renderAction()}>
            {state.isLoading ? (
              <span>Loading...</span>
            ) : (
              <LicensePage
                licenses={state.licenses}
                editAction={license => {
                  setModalState({
                    ...modalState,
                    visible: true,
                    license,
                  });
                }}
                deleteLicense={remove}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modalState.visible} toggle={toggleModal} style={{ maxWidth: '350px' }}>
        <ModalHeader toggle={toggleModal}>Add License</ModalHeader>
        <AddEditLicense initialValues={modalState.license} updateLicense={update} addLicense={add} />
      </Modal>
    </React.Fragment>
  );
};

export default LicenseContainer;

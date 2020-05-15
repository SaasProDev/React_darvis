import React, { useState } from 'react';

import { Modal, ModalBody, ModalFooter, Button, Spinner } from 'reactstrap';

import ConfirmationContext from './context';

const defaultConfirmationValue = {
  visible: false,
  item: undefined,
  loading: false,
  callback: () => {},
};

const ConfirmationModalContainer = ({ children }) => {
  const [confirmationModal, setConfirmationModal] = useState(defaultConfirmationValue);

  return (
    <React.Fragment>
      <ConfirmationContext.Provider
        value={{
          confirmationModal,
          setConfirmationModal,
          resetConfirmationModal: () => setConfirmationModal(defaultConfirmationValue),
          setLoader: loading =>
            setConfirmationModal({
              ...confirmationModal,
              loading,
            }),
        }}
      >
        {children}
      </ConfirmationContext.Provider>
      <Modal
        style={{ maxWidth: '250px' }}
        isOpen={confirmationModal.visible}
        toggle={() => setConfirmationModal({ ...confirmationModal, visible: !confirmationModal.visible })}
      >
        <ModalBody>
          This will delete <b>{`${confirmationModal.item}, `}</b> Are you sure you want to?
        </ModalBody>
        <ModalFooter>
          {confirmationModal.loading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <Button color="light" onClick={() => setConfirmationModal(defaultConfirmationValue)}>
                No
              </Button>{' '}
              <Button color="danger" onClick={() => confirmationModal.callback()}>
                Yes, Delete!!
              </Button>
            </React.Fragment>
          )}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmationModalContainer;

import React from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const IdleTimeOutModal = ({ showModal, handleClose, handleLogout }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <ModalHeader closeButton>
        <h3>You Have Been Idle!</h3>
      </ModalHeader>
      <ModalBody>You Will Get Timed Out. You want to stay?</ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Stay
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default IdleTimeOutModal;

import React from 'react';

const ConfirmationContext = React.createContext({
  confirmationModal: {
    visible: false,
    item: '',
    callback: () => {},
  },
  setConfirmationModal: () => {},
});

export default ConfirmationContext;

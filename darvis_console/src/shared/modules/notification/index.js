import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';

import NotificationSystem from 'react-notification-system';
import { NotificationContextProvider } from './context';

const Notification = ({ children }) => {
  const notificationsRef = createRef();
  const [state, setState] = useState({
    type: 'error',
    fail: false,
    message: '',
    statusCode: '',
  });

  const setNotification = (notification, show) => {
    if (show && notificationsRef && notificationsRef.current) {
      notificationsRef.current.addNotification({
        level: notification.type,
        message: (
          <div>
            {notification.statusCode && <b>{notification.statusCode}: </b>}
            {notification.message}
          </div>
        ),
        position: 'tc',
      });
    }
    setState({ ...notification });
  };

  return (
    <NotificationContextProvider value={{ notification: state, setNotification }}>
      <NotificationSystem ref={notificationsRef} />
      {children}
    </NotificationContextProvider>
  );
};

Notification.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Notification;

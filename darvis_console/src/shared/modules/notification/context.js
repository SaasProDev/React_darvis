import React from 'react';
import Logger from '../logger';

const defaultNotificationContextState = {
  notification: {
    type: '',
    fail: false,
    message: '',
    statusCode: '',
  },
  setNotification: (notification, show) => {
    Logger.info(notification, show);
  },
};

export const Context = React.createContext(defaultNotificationContextState);

export const NotificationContextProvider = Context.Provider;
export const NotificationContextConsumer = Context.Consumer;

export default Context;

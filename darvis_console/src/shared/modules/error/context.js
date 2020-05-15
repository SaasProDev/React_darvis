import React from 'react';
import Logger from '../logger';

const defaultErrorContextState = {
  error: {
    fail: false,
    message: '',
    statusCode: '',
  },
  setError: (error, show) => {
    Logger.info(error, show);
  },
};

const ErrorContext = React.createContext(defaultErrorContextState);

export const ErrorContextProvider = ErrorContext.Provider;
export const ErrorContextConsumer = ErrorContext.Consumer;

export default ErrorContext;

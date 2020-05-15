import React from 'react';
import PropTypes from 'prop-types';

import NotificationsContext from '../notification/context';
import { ErrorContextProvider } from './context';
import Logger from '../logger';

class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    Logger.info('Derived Error', error);
    return { applicationError: true };
  }

  static contextType = NotificationsContext;

  constructor(props) {
    super(props);

    this.setError = this.setError.bind(this);

    this.state = {
      error: {
        fail: false,
        message: '',
        statusCode: '',
      },
      applicationError: false,
    };
  }

  setError(error, show) {
    if (show) {
      const { setNotification } = this.context;
      setNotification({ ...error, type: 'error' }, show);
    }
    this.setState({ error });
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    Logger.info('CDC', error, info);
  }

  render() {
    const { children } = this.props;
    const { error, applicationError } = this.state;

    if (applicationError) {
      return <h1>Something went wrong.</h1>;
    }

    return <ErrorContextProvider value={{ error, setError: this.setError }}>{children}</ErrorContextProvider>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;

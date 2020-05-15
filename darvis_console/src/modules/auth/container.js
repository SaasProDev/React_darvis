import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Label, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

import { AuthContext } from './authContext';
import { LOGGED_IN_HOME, CONFIGURATION_PAGE } from '../../config';

const AuthContainer = ({ history }) => {
  const authContext = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function initialize() {
      const status = await authContext.checkRegistered();
      if (status === 0) {
        setTimeout(() => {
          history.push(CONFIGURATION_PAGE);
        }, 10);
      } else if (status === -1) {
        setIsLoaded(false);
      } else if (status === 1) {
        if (authContext.checkAuthentication()) {
          // TODO: Stay at current page;
          setTimeout(() => {
            history.push(LOGGED_IN_HOME);
          }, 10);
        }
        setIsLoaded(true);
      }
    }
    initialize();
  }, []);

  const handleSubmit = (event, values) => {
    if (event) {
      authContext.authenticate(values.email, values.password);
    }
  };

  return (
    isLoaded ? (
      <div className="login-body">
        <div className="container">
          <div className="login-wrap d-flex justify-content-center align-content-center flex-wrap">
            <AvForm onValidSubmit={handleSubmit} className="login-form validate-form">
              <Label className="login-form-title">Log In</Label>
              <AvField name="email" label="Email Address" type="text" validate={{ required: true, email: true }} />
              <AvField name="password" label="Password" type="password" required />
              <Button size="lg" className="green-button w-full" type="submit">
                Log In
            </Button>
            </AvForm>
          </div>
        </div>
      </div>
    ) : (
        <React.Fragment>
          <div className="login-body">
            <div className="container">
              <div className="login-wrap d-flex justify-content-center align-content-center flex-wrap">
                <h1 style={{color: '#fff'}}>Server is not running...</h1>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
  );
};

export default withRouter(AuthContainer);

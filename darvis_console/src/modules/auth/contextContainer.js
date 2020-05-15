import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router';

import { AuthContextProvider } from './authContext';
import { AUTH_PAGE, LOGGED_IN_HOME, EXPLORE_PAGE, ORIGINHOST } from '../../config';
import { authenticate as callAuth } from '../../shared/services/auth';
import { getSitesbyUser as callSite, isRegistered as checkRegistrationService } from '../../shared/services/sites';
import ErrorContext from '../../shared/modules/error/context';
import { ROLES } from '../../shared/services/role';

const AuthContextContainer = ({ history, children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    registeredStatus: 0,
    loading: false,
  });
  const errorContext = useContext(ErrorContext);

  const authenticate = async (email, password) => {
    setState({ isAuthenticated: false, loading: true, isRegistered: 1 });
    try {
      const user = await callAuth({ email, password });
      if (user === 'error') {
        // something went wrong,
        // such as can't access to the server
      } else if (user) {
        localStorage.setItem('user', JSON.stringify(user.data));
        localStorage.setItem('token', user.data.token);
        if (user.data.role.name !== ROLES.ADMIN || user.data.role.name !== ROLES.GOD) {
          // if user is not admin user
          // set Site infomation to the local Storage
          let id = user.data._id;
          if(user.data.role.name !== ROLES.OWNER) {
            id = user.data.owner;
          }
          const site = await callSite(id);
          if (site === 'Site not found') {
            // error case
            // logout
            errorContext.setError('Site not found!');
          } else {
            localStorage.setItem('selectedSite', JSON.stringify(site[0]));
          }
        }
        setState({ isAuthenticated: true, loading: false });
        if(user.data.role.name === ROLES.EDITOR) {
          history.push(EXPLORE_PAGE);
        } else if(user.data.role.name === ROLES.VIEWER) {
          //history.push(EXPLORE_PAGE);
          // relocate to the 5000
          window.location.href = ORIGINHOST + ':5000';

        } else {
          history.push(LOGGED_IN_HOME);
        }
      }
    } catch (e) {
      errorContext.setError({false: true, message: e.data ? e.data : e.message}, true);
      setState({ isAuthenticated: false, loading: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedSite');
    setState({ isAuthenticated: false });
    history.push(AUTH_PAGE);
  };

  const checkAuthentication = () => localStorage.getItem('user') && localStorage.getItem('token');

  const checkRegistered = async () => {
    try {
      const registered = await checkRegistrationService();
      if(registered === 'yes') {
        setState(s => ({...s, isRegistered: 1}));
        return 1;
      } else {
        setState(s => ({...s, isRegistered: 0}));
        return 0;
      }
    } catch(e) {
      setState(s => ({...s, isRegistered: -1}));
      return -1;
    }
  }
  return (
    <AuthContextProvider value={{ isAuthenticated: state.isAuthenticated, isRegistered: state.isRegistered, authenticate, logout, checkAuthentication, checkRegistered }}>
      {children}
    </AuthContextProvider>
  );
};

export default withRouter(AuthContextContainer);

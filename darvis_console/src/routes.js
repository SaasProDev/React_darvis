import React, { Suspense, useContext, useState, useRef } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import IdleTimer from 'react-idle-timer';

import { AuthContext } from './modules/auth/authContext';
import AuthRoutes from './modules/auth/routes';
import SiteRoutes from './modules/site/routes';
import HomographyRoutes from './modules/homography/routes';
import ExploreRoutes from './modules/explore/routes';
import AnalyticsRoutes from './modules/analytics/routes';
import SAdminRoutes from './modules/admin/routes';
import UsersRoutes from './modules/users/routes';
import ConfigurationRoutes from './modules/configuration/routes';

import NotFound from './shared/templates/notFound';
import { isAdmin, isOwner, isManager, isEditor, isViewer, isMobileUser, isGod, ROLES } from './shared/services/role';
import CamerasRoutes from './modules/cameras/routes';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const authContext = useContext(AuthContext);

  const checkPermission = () => {
    if (roles.findIndex(role => role === ROLES.ADMIN) > -1 && isAdmin()) return true;
    if (roles.findIndex(role => role === ROLES.OWNER) > -1 && isOwner()) return true;
    if (roles.findIndex(role => role === ROLES.MANAGER) > -1 && isManager()) return true;
    if (roles.findIndex(role => role === ROLES.EDITOR) > -1 && isEditor()) return true;
    if (roles.findIndex(role => role === ROLES.VIEWER) > -1 && isViewer()) return true;
    if (roles.findIndex(role => role === ROLES.MOBILEUSER) > -1 && isMobileUser()) return true;
    if (roles.findIndex(role => role === ROLES.GOD) > -1 && isGod()) return true;

    return false;
  };

  const getRedirection = () => {
    if (isGod() || isAdmin()) {
      return <Redirect to="/console/admin/users" />;
    } else if (isEditor()) {
      return <Redirect to="/console/analytics" />
    } else if (isViewer()) {
      return <Redirect to="/console/explore" />
    }
    return <Redirect to="/console/site" />;
  };

  const idleTimer = useRef(null);

  const [state, setState] = useState({
    timeout: 1000 * 60 * 5,
    showModal: false,
    userLoggedIn: false,
    isTimeOut: false,
  });

  const onAction = () => {
    // setState({ ...state, isTimeOut: false });
  };

  const onActive = () => {
    // setState({ ...state, isTimeOut: false });
  };

  const onIdle = () => {
    const timeout = state.isTimeOut;
    if (timeout) {
      authContext.logout();
    } else {
      setState({ ...state, showModal: true });
      idleTimer.current.reset();
      setState({ ...state, isTimeOut: true });
    }
  };

  return (
    <React.Fragment>
      <IdleTimer
        ref={idleTimer}
        element={document}
        onActive={onActive}
        onAction={onAction}
        onIdle={onIdle}
        debounce={250}
        timeout={state.timeout}
      />
      <Route
        {...rest}
        exact
        render={props =>
          authContext.checkAuthentication() && checkPermission() ? <Component {...props} /> : getRedirection()
        }
      />
    </React.Fragment>
  );
};

const renderRouteFromList = (isPrivate, roles) => (item, i) => {
  const { Component } = item;
  if (isPrivate) {
    return <PrivateRoute exact key={i} path={item.path} component={Component} roles={roles} />;
  }
  return <Route exact key={i} path={item.path} component={Component} />;
};

const Routes = () => (
  <Suspense fallback="loading">
    <Switch>
      {ConfigurationRoutes.map(renderRouteFromList())}
      {AuthRoutes.map(renderRouteFromList())}
      {SAdminRoutes.map(renderRouteFromList(true, [ROLES.GOD, ROLES.ADMIN]))}
      {SiteRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER]))}
      {HomographyRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER]))}
      {ExploreRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER, ROLES.EDITOR]))}
      {AnalyticsRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER, ROLES.EDITOR]))}
      {UsersRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER]))}
      {CamerasRoutes.map(renderRouteFromList(true, [ROLES.OWNER, ROLES.MANAGER]))}
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;

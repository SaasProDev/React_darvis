import React from 'react';

const defaultAuthContext = {
  authenticate: () => {},
  checkAuthentication: () => true,
  checkRegistered: () => false,
  isAuthenticated: false,
  isRegistered: false,
  logout: () => {},
};

export const AuthContext = React.createContext(defaultAuthContext);
export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

import { lazy } from 'react';

const UsersRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/users',
  },
];

export default UsersRoutes;

import { lazy } from 'react';

const SAdminRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/admin/:type?',
  }
];

export default SAdminRoutes;

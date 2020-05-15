import { lazy } from 'react';

const SiteRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/site',
  },
];

export default SiteRoutes;

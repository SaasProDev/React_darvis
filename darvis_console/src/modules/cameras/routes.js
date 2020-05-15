import { lazy } from 'react';

const CamerasRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/cameras',
  },
];

export default CamerasRoutes;
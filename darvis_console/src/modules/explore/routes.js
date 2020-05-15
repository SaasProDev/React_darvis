import { lazy } from 'react';

const ExploreRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/explore',
  },
];

export default ExploreRoutes;

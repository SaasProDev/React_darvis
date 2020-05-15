import { lazy } from 'react';

const AnalyticsRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/analytics',
  },
];

export default AnalyticsRoutes;

import { lazy } from 'react';
import { CONFIGURATION_PAGE } from '../../config';
const ConfigurationRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: CONFIGURATION_PAGE,
  },
];

export default ConfigurationRoutes;
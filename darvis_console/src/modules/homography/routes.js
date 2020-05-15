import { lazy } from 'react';

const HomographyRoutes = [
  {
    Component: lazy(() => import('./container')),
    path: '/console/site/homography/:levelId/:cameraId',
  },
];

export default HomographyRoutes;

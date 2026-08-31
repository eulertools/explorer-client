import React, { Suspense } from 'react';
import { LoadingScreen } from './LoadingScreen';

export const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

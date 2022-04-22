// ESSENTIAL - Remove Redux Toolkit; not using it

import { configureStore } from '@reduxjs/toolkit';

import testReducerReducer from './test-reducer';

const store = configureStore({
  reducer: {
    testReducer: testReducerReducer,
  },
});

export default store;

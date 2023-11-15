// rootReducer.js
import { combineReducers } from 'redux';
import csvReducer from './csvReducer';

const rootReducer = combineReducers({
  csv: csvReducer
  // add other reducers here
});

export default rootReducer;

import {createStore, applyMiddleware,combineReducers} from 'redux';
import {composeWithDevTools}  from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import loginReducer from './reducer/login';
import adminReducer from './reducer/admin';

const allReducers = combineReducers({
  userInfo: loginReducer,
  collapsed: adminReducer
});
export default createStore(allReducers,composeWithDevTools(applyMiddleware(thunk)));
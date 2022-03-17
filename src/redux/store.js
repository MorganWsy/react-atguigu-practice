import {createStore, applyMiddleware,combineReducers} from 'redux';
import {composeWithDevTools}  from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import loginReducer from './reducer/login';

const allReducers = combineReducers({
  userInfo: loginReducer
});
export default createStore(allReducers,composeWithDevTools(applyMiddleware(thunk)));
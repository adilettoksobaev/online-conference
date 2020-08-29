import { combineReducers } from 'redux';
import auth from './Auth/reducer';
import account from './Account/reducer';
import conferences from './Conferences/reducer';

const rootReducer = combineReducers({
    auth,
    account,
    conferences,
});


export default rootReducer;
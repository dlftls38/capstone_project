import authentication from './account/authentication';
import memo from './memo/memo';
import post from './post/post';
import search from './search/search';


import { combineReducers } from 'redux';

export default combineReducers({
    authentication, memo, post, search
});

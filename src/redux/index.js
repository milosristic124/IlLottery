import { combineReducers } from 'redux';
import { toastReducer as toast } from 'react-native-redux-toast';
import app from "./modules/app";
import nav from "./modules/nav";
import user from "./modules/user";
import location from "./modules/location";
import auth from './modules/auth';

export default function getRootReducer() {
    return combineReducers({
        toast,
        app,
        nav,
        user,
        location,
        auth,
    });
}

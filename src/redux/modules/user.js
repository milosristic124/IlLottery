'use strict';
import {
  Platform,
  AsyncStorage
} from 'react-native';
import _ from "lodash";
import { startLoading, stopLoading, showToast, hideToast } from './app';
import { goBack, reset } from './nav';
import RestClient from '../../utilities/RestClient';
import { ToastActionsCreators } from 'react-native-redux-toast';


// Actions
export const GET_NEXT_LOTTERY_TIME = "GET_NEXT_LOTTERY_TIME";
export const GO_TO_TYPE_FORM = "GO_TO_TYPE_FORM";
export const GO_TO_HOME = "GO_TO_HOME";
export const AGE_VERIFIED = 'AGE_VERIFIED';
export const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';

// Action Creators
export const GET_NEXT_LOTTERY = (data) => ({  type: GET_NEXT_LOTTERY_TIME, data});
export const NAVIGATE_TO_TYPE_FORM = () => ({  type: GO_TO_TYPE_FORM });
export const NAVIGATE_TO_HOME = () => ({  type: GO_TO_HOME });

//perform API's

/* Verify DOB API */
export const ageVerify = () => {
  return dispatch => {
    dispatch({ type: AGE_VERIFIED, payload: true });  
  }
}
export const verifyDob = (token, type, birthday) => {
  let requestObject = {
    device_token: token,
    device_type: type,
    date_of_birth: birthday,
    //date_of_birth:
  }

  return dispatch => {
    dispatch(startLoading());
    RestClient.post("events/verify_dob",requestObject).then((result) => {
      console.log('Verify_Dob response ******* ',result);
      if(result.hasOwnProperty('success')) {
      //  dispatch({ type: AGE_VERIFIED, payload: true });
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/* Get Next Lottery */
export const getNextLottery = () => {

  return dispatch => {
    //dispatch(startLoading());
    RestClient.get("events/v1/next_lottery_time").then((result) => {
		//dispatch(stopLoading());
      	console.log('result ******* ',result)
    //  	dispatch(GET_NEXT_LOTTERY())
    }).catch(error => {
      console.log("error=> " ,error)
      //dispatch(stopLoading());
    });
  }

};
/* Log in user API */

export const login = (data) => {
  let requestObject = {
    email:data.email,
    password:data.password,
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("users/sign_in",requestObject, null, data.user_auth).then((result) => {
      dispatch(stopLoading());
      console.log('result ******* ',result)
      if(result.hasOwnProperty('success')) {
        dispatch(NAVIGATE_TO_TYPE_FORM());
        AsyncStorage.multiSet([
          ["X-User-Authorization", result.success.user.id],
          ["email", requestObject.email],
          ["password", requestObject.password],
        ]);
        //  dispatch({ type: AGE_VERIFIED, payload: true });
      }
      if(result.hasOwnProperty('error')) {
        dispatch({ type: WRONG_CREDENTIALS, payload: true });
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};
/* Sign up user API */

export const signup = (data) => {
  let requestObject = {
    email:data.email,
    password:data.password,
    device_type: data.device_type,
    device_token: data.device_token,
    tac_consent: true
  }
  return dispatch => {
    dispatch(startLoading());
    RestClient.post("users/register",requestObject).then((result) => {
      dispatch(stopLoading());
      console.log('result ******* ',result)
      if(result.hasOwnProperty('success')) {
        dispatch(NAVIGATE_TO_TYPE_FORM());
        AsyncStorage.multiSet([
          ["X-User-Authorization", result.success.user.id],
          ["email", requestObject.email],
          ["password", requestObject.password],
        ]);
        //  dispatch({ type: AGE_VERIFIED, payload: true });
      }
    }).catch(error => {
      console.log("error=> " ,error)
      dispatch(stopLoading());
    });
  }
};

/**
* Initial state
*/
const initialState = {
  userDetails : null,
  deviceToken : "test",
  next_lottery_time : ''
};

/**
* Reducer
*/
export default function reducer(state = initialState, action) {
    switch (action.type) {
        // case LOG_IN_SUCCESS:
        //   return { ...state, userDetails: action.data };

        case GET_NEXT_LOTTERY_TIME:
        	return { ...state, next_lottery_time: action.data };

        default:
          return state;
    }
}

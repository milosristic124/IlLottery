'use strict';
import { AGE_VERIFIED } from './user';
import { WRONG_CREDENTIALS } from './user';


const initialState = {
    isAgeVerified: false,
    wrong_credentials: false,
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case AGE_VERIFIED:
            return {
                ...state,
                isAgeVerified: action.payload,
            };
        case WRONG_CREDENTIALS:
            return {
                ...state,
                wrong_credentials: action.payload,
            };
        default:
            return {
                ...state,
                isAgeVerified: false,
            };
    }
}
export default auth;
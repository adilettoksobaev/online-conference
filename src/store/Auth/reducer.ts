import { Reducer } from "redux";
import { AuthState } from "./types";
import { AuthActions, AuthActionsTypes } from "./actions";
import { sessionStorageSetItem, sessionStorageGetItem, sessionStorageRemoveItem } from "../../utils/storage";

const defaultState: AuthState = {
    phone: sessionStorageGetItem('phone'),
    message: '',
    result: '',
    sessionId: sessionStorageGetItem('sessionId'),
    userName: sessionStorageGetItem('userName'),
    role: '',
    isAuthorized: false,
    loading: false,
    accessToCreateConferences: false,
    userId: 0,
};

export const authReducer: Reducer<AuthState, AuthActions> = (state = defaultState, action) => {

    switch (action.type) {
        case AuthActionsTypes.AUTH_BY_PHONE:
            sessionStorageSetItem('phone', action.phone);
            return {
                ...state,
                phone: action.phone
            };
        case AuthActionsTypes.GET_MESSAGE:
            return {
                ...state,
                message: action.message,
                result: action.result,
            };
        case AuthActionsTypes.SET_PHONE_PIN_CONFIRM:
            sessionStorageSetItem('sessionId', action.payload.sessionId);
            sessionStorageSetItem('userName', action.payload.userName);
            return {
                ...state,
                ...action.payload,
                isAuthorized: true
            };
        case AuthActionsTypes.CHECK_SESSION:
            return {
                ...state,
                ...action.payload,
                isAuthorized: true
            };
        case AuthActionsTypes.LOGOUT:
            sessionStorageRemoveItem('sessionId');
            sessionStorageRemoveItem('phone');
            sessionStorageRemoveItem('userName');
            return {
                ...state,
                phone: null,
                message: '',
                result: '',
                sessionId: null,
                userName: '',
                role: '',
                isAuthorized: false,
                accessToCreateConferences: false,
            };
        case AuthActionsTypes.SET_LOADER:
            return {
                ...state,
                loading: action.loading
            };
        default:
            return state;
    }
};

export default authReducer;
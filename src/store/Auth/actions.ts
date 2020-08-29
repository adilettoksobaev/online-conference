import { ActionCreator, Action } from 'redux';
import { PhonePinConfirm } from './types';

export enum AuthActionsTypes {
    AUTH_BY_PHONE = 'AUTH_BY_PHONE',
    GET_MESSAGE = 'GET_MESSAGE',
    SET_PHONE_PIN_CONFIRM = 'SET_PHONE_PIN_CONFIRM',
    CHECK_SESSION = 'CHECK_SESSION',
    LOGOUT = 'LOGOUT',
    SET_LOADER = 'SET_LOADER',
}

export interface IAuthByPhone extends Action<AuthActionsTypes.AUTH_BY_PHONE> {
    phone: string;
}

export interface IGetMessage extends Action<AuthActionsTypes.GET_MESSAGE> {
    message: string;
    result: string;
}

export interface IPhonePinConfirm extends Action<AuthActionsTypes.SET_PHONE_PIN_CONFIRM> {
    payload: PhonePinConfirm
}

export interface ICheckSession extends Action<AuthActionsTypes.CHECK_SESSION> {
    payload: PhonePinConfirm,
    isAuthorized: boolean;
}

export interface ILogout extends Action<AuthActionsTypes.LOGOUT>{}
export interface ISetLoader extends Action<AuthActionsTypes.SET_LOADER>{
    loading: boolean
}

export type AuthActions =
    | IAuthByPhone
    | IGetMessage
    | IPhonePinConfirm
    | ICheckSession
    | ILogout
    | ISetLoader;

export const authByPhoneAction: ActionCreator<IAuthByPhone> = (phone: string) => {
    return {
        type: AuthActionsTypes.AUTH_BY_PHONE,
        phone
    }
}

export const getMessageAction: ActionCreator<IGetMessage> = (message: string, result: string) => {
    return {
        type: AuthActionsTypes.GET_MESSAGE,
        message,
        result
    }
}

export const phonePinConfirmAction: ActionCreator<IPhonePinConfirm> = (payload: PhonePinConfirm) => {
    return {
        type: AuthActionsTypes.SET_PHONE_PIN_CONFIRM,
        payload
    }
}

export const checkSessionAction: ActionCreator<ICheckSession> = (payload: PhonePinConfirm, isAuthorized: boolean) => {
    return {
        type: AuthActionsTypes.CHECK_SESSION,
        payload,
        isAuthorized
    }
}

export const logoutAction: ActionCreator<ILogout> = () => {
    return {
        type: AuthActionsTypes.LOGOUT
    }
}

export const setLoaderAction: ActionCreator<ISetLoader> = (loading: boolean) => {
    return {
        type: AuthActionsTypes.SET_LOADER,
        loading
    }
}
import { ActionCreator, Action } from 'redux';
import { Conferences, StartConferenceType } from './types';
import { SearchUsers } from '../Account/types';

export enum ConferencesActionsTypes {
    GET_CONFERENCES = 'GET_CONFERENCES',
    GET_CONFERENCE_USERS = 'GET_CONFERENCE_USERS',
    DELETE_CONFERENCE_USERS = 'DELETE_CONFERENCE_USERS',
    SET_CONFERENCE_SUCCESS = 'SET_CONFERENCE_SUCCESS',
    CLEAR_CONFERENCE_USERS = 'CLEAR_CONFERENCE_USERS',
    IS_PUBLIC = 'IS_PUBLIC',
    PUBLIC_ROOM_PASSWORD = 'PUBLIC_ROOM_PASSWORD',
    START_CONFERENCE_ACTION = 'START_CONFERENCE_ACTION',
    CONFERENCE_PARTICIPANTS = 'CONFERENCE_PARTICIPANTS',
}

export interface IStartConference extends Action<ConferencesActionsTypes.START_CONFERENCE_ACTION> {
    payload: StartConferenceType
}

export interface IIsPublic extends Action<ConferencesActionsTypes.IS_PUBLIC> {
    isPublic: boolean;
}

export interface IPublicRoomPassword extends Action<ConferencesActionsTypes.PUBLIC_ROOM_PASSWORD> {
    publicRoomPassword: string;
}

export interface IGetConferences extends Action<ConferencesActionsTypes.GET_CONFERENCES> {
    conferences: Conferences[];
}

export interface IGetConferenceUsers extends Action<ConferencesActionsTypes.GET_CONFERENCE_USERS> {
    conferenceUsers: SearchUsers;
}

export interface IClearConferenceUsers extends Action<ConferencesActionsTypes.CLEAR_CONFERENCE_USERS> {}

export interface IDeleteConferenceUsers extends Action<ConferencesActionsTypes.DELETE_CONFERENCE_USERS> {
    conferenceUsers: SearchUsers[];
}

export interface IConferenceParticipants extends Action<ConferencesActionsTypes.CONFERENCE_PARTICIPANTS> {
    conferenceUsers: SearchUsers[];
}

export interface IConferenceSuccess extends Action<ConferencesActionsTypes.SET_CONFERENCE_SUCCESS> {
    conferenceSuccess: boolean;
}

export type ConferencesActions =
    | IGetConferences
    | IGetConferenceUsers
    | IDeleteConferenceUsers
    | IConferenceSuccess
    | IClearConferenceUsers
    | IIsPublic
    | IPublicRoomPassword
    | IStartConference
    | IConferenceParticipants;

export const startConferenceAction: ActionCreator<IStartConference> = (payload: StartConferenceType) => {
    return {
        type: ConferencesActionsTypes.START_CONFERENCE_ACTION,
        payload
    }
}
export const isPublicAction: ActionCreator<IIsPublic> = (isPublic: boolean) => {
    return {
        type: ConferencesActionsTypes.IS_PUBLIC,
        isPublic
    }
}

export const publicRoomPasswordAction: ActionCreator<IPublicRoomPassword> = (publicRoomPassword: string) => {
    return {
        type: ConferencesActionsTypes.PUBLIC_ROOM_PASSWORD,
        publicRoomPassword
    }
}

export const getConferencesAction: ActionCreator<IGetConferences> = (conferences: Conferences[]) => {
    return {
        type: ConferencesActionsTypes.GET_CONFERENCES,
        conferences
    }
}

export const conferenceParticipantsAction: ActionCreator<IConferenceParticipants> = (conferenceUsers: SearchUsers[]) => {
    return {
        type: ConferencesActionsTypes.CONFERENCE_PARTICIPANTS,
        conferenceUsers
    }
}

export const getConferenceUsersAction: ActionCreator<IGetConferenceUsers> = (conferenceUsers: SearchUsers) => {
    return {
        type: ConferencesActionsTypes.GET_CONFERENCE_USERS,
        conferenceUsers
    }
}

export const clearConferenceUsersAction: ActionCreator<IClearConferenceUsers> = () => {
    return {
        type: ConferencesActionsTypes.CLEAR_CONFERENCE_USERS,
    }
}

export const deleteConferenceUsersAction: ActionCreator<IDeleteConferenceUsers> = (conferenceUsers: SearchUsers[]) => {
    return {
        type: ConferencesActionsTypes.DELETE_CONFERENCE_USERS,
        conferenceUsers
    }
}

export const conferenceSuccessAction: ActionCreator<IConferenceSuccess> = (conferenceSuccess: boolean) => {
    return {
        type: ConferencesActionsTypes.SET_CONFERENCE_SUCCESS,
        conferenceSuccess
    }
}
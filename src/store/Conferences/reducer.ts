import { Reducer } from "redux";
import { ConferencesState } from "./types";
import { ConferencesActions, ConferencesActionsTypes } from "./actions";

const defaultState: ConferencesState = {
    conferences: [],
    conferenceUsers: [],
    conferenceSuccess: false,
    isPublic: false,
    publicRoomPassword: '',
    startConference: JSON.parse(sessionStorage.getItem("startConference")  || '{}'),
};

export const conferencesReducer: Reducer<ConferencesState, ConferencesActions> = (state = defaultState, action) => {

    switch (action.type) {
        case ConferencesActionsTypes.START_CONFERENCE_ACTION:
            sessionStorage.setItem("startConference", JSON.stringify(action.payload));
            return {
                ...state,
                startConference: action.payload,
            };
        case ConferencesActionsTypes.IS_PUBLIC:
            return {
                ...state,
                isPublic: action.isPublic
            };
        case ConferencesActionsTypes.PUBLIC_ROOM_PASSWORD:
            return {
                ...state,
                publicRoomPassword: action.publicRoomPassword
            };
        case ConferencesActionsTypes.GET_CONFERENCES:
            return {
                ...state,
                conferences: action.conferences
            };
        case ConferencesActionsTypes.CONFERENCE_PARTICIPANTS:
            return {
                ...state,
                conferenceUsers: action.conferenceUsers
            };
        case ConferencesActionsTypes.GET_CONFERENCE_USERS:
            const newConferenceUsers = state.conferenceUsers.concat(action.conferenceUsers);
            return {
                ...state,
                conferenceUsers: newConferenceUsers
            };
        case ConferencesActionsTypes.CLEAR_CONFERENCE_USERS:
            return {
                ...state,
                conferenceUsers: []
            };
        case ConferencesActionsTypes.DELETE_CONFERENCE_USERS:
            return {
                ...state,
                conferenceUsers: action.conferenceUsers
            };
        case ConferencesActionsTypes.SET_CONFERENCE_SUCCESS:
            return {
                ...state,
                conferenceSuccess: action.conferenceSuccess
            };
        default:
            return state;
    }
};

export default conferencesReducer;
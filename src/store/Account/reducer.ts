import { Reducer } from "redux";
import { AccountState, Role } from "./types";
import { AccountActions, AccountActionsTypes } from "./actions";

export const initialUserAccount = {
    userId: 0,
    userName: '',
    userInn: '',
    phone: '',
    email: '',
    userAccountId: 0,
    role: Role.User,
    organizationId: 0,
    positionId: 0,
    departmentId: 0,
    accessToCreateConferences: false,
    password: '',
}

const defaultState: AccountState = {
    cities: [],
    organization: [],
    department: [],
    parentDepartments: [],
    position: [],
    searchUsers: [],
    userAccount: initialUserAccount,
    organizationSuccess: false,
    departmentSuccess: false,
    positionSuccess: false,
    userAccountSuccess: false
};

export const accountReducer: Reducer<AccountState, AccountActions> = (state = defaultState, action) => {

    switch (action.type) {
        case AccountActionsTypes.GET_CITIES:
            return {
                ...state,
                cities: action.cities
            };
        case AccountActionsTypes.GET_ORGANIZATIONS:
            return {
                ...state,
                organization: action.organization
            };
        case AccountActionsTypes.GET_DEPARTMENT:
            return {
                ...state,
                department: action.department
            };
        case AccountActionsTypes.GET_PARENT_DEPARTMENT:
            return {
                ...state,
                parentDepartments: action.parentDepartments
            };
        case AccountActionsTypes.GET_POSITION:
            return {
                ...state,
                position: action.position
            };
        case AccountActionsTypes.SEARCH_USERS:
            return {
                ...state,
                searchUsers: action.searchUsers
            };
        case AccountActionsTypes.GET_USER_ACCOUNT:
            return {
                ...state,
                userAccount: action.userAccount
            };
        case AccountActionsTypes.SET_ORGANIZATION_SUCCESS:
            return {
                ...state,
                organizationSuccess: action.organizationSuccess
            };
        case AccountActionsTypes.SET_DEPARTMENT_SUCCESS:
            return {
                ...state,
                departmentSuccess: action.departmentSuccess
            };
        case AccountActionsTypes.SET_POSITION_SUCCESS:
            return {
                ...state,
                positionSuccess: action.positionSuccess
            };
        case AccountActionsTypes.SET_USER_ACCOUNT_SUCCESS:
            return {
                ...state,
                userAccountSuccess: action.userAccountSuccess
            };
        default:
            return state;
    }
};

export default accountReducer;
import { ActionCreator, Action } from 'redux';
import { Organization, Department, Position, Cities, SearchUsers, UserAccount } from './types';

export enum AccountActionsTypes {
    GET_CITIES = 'GET_CITIES',
    GET_ORGANIZATIONS = 'GET_ORGANIZATION',
    GET_DEPARTMENT = 'GET_DEPARTMENT',
    GET_POSITION = 'GET_POSITION',
    GET_USER_ACCOUNT = 'GET_USER_ACCOUNT',
    SET_SUCCESS = 'SET_SUCCESS',
    SET_ORGANIZATION_SUCCESS = 'SET_ORGANIZATION_SUCCESS',
    SET_DEPARTMENT_SUCCESS = 'SET_DEPARTMENT_SUCCESS',
    SET_POSITION_SUCCESS = 'SET_POSITION_SUCCESS',
    SET_USER_ACCOUNT_SUCCESS = 'SET_USER_ACCOUNT_SUCCESS',
    SEARCH_USERS = 'SEARCH_USERS',
    GET_PARENT_DEPARTMENT = 'GET_PARENT_DEPARTMENT'

}

export interface IGetSities extends Action<AccountActionsTypes.GET_CITIES> {
    cities: Cities[];
}
export interface IGetOrganizations extends Action<AccountActionsTypes.GET_ORGANIZATIONS> {
    organization: Organization[];
}

export interface IGetDepartment extends Action<AccountActionsTypes.GET_DEPARTMENT> {
    department: Department[];
}
export interface IGetParentDepartment extends Action<AccountActionsTypes.GET_PARENT_DEPARTMENT> {
    parentDepartments: Department[];
}

export interface IGetPosition extends Action<AccountActionsTypes.GET_POSITION> {
    position: Position[];
}
export interface ISearchUsers extends Action<AccountActionsTypes.SEARCH_USERS> {
    searchUsers: SearchUsers[];
}
export interface IGetUserAccount extends Action<AccountActionsTypes.GET_USER_ACCOUNT> {
    userAccount: UserAccount;
}

export interface IOrganizationSuccess extends Action<AccountActionsTypes.SET_ORGANIZATION_SUCCESS> {
    organizationSuccess: boolean;
}
export interface IDepartmentSuccess extends Action<AccountActionsTypes.SET_DEPARTMENT_SUCCESS> {
    departmentSuccess: boolean;
}
export interface IPositionSuccess extends Action<AccountActionsTypes.SET_POSITION_SUCCESS> {
    positionSuccess: boolean;
}
export interface IUserAccountSuccess extends Action<AccountActionsTypes.SET_USER_ACCOUNT_SUCCESS> {
    userAccountSuccess: boolean;
}

export type AccountActions =
    | IGetSities
    | IGetOrganizations
    | IGetDepartment
    | IGetPosition
    | ISearchUsers
    | IGetUserAccount
    | IOrganizationSuccess
    | IDepartmentSuccess
    | IPositionSuccess
    | IUserAccountSuccess
    | IGetParentDepartment;

export const getCitiesAction: ActionCreator<IGetSities> = (cities: Cities[]) => {
    return {
        type: AccountActionsTypes.GET_CITIES,
        cities
    }
}

export const getOrganizationsAction: ActionCreator<IGetOrganizations> = (organization: Organization[]) => {
    return {
        type: AccountActionsTypes.GET_ORGANIZATIONS,
        organization
    }
}

export const getDepartmentAction: ActionCreator<IGetDepartment> = (department: Department[]) => {
    return {
        type: AccountActionsTypes.GET_DEPARTMENT,
        department
    }
}

export const getParentDepartmentAction: ActionCreator<IGetParentDepartment> = (parentDepartments: Department[]) => {
    return {
        type: AccountActionsTypes.GET_PARENT_DEPARTMENT,
        parentDepartments
    }
}

export const getPositionAction: ActionCreator<IGetPosition> = (position: Position[]) => {
    return {
        type: AccountActionsTypes.GET_POSITION,
        position
    }
}

export const searchUsersAction: ActionCreator<ISearchUsers> = (searchUsers: SearchUsers[]) => {
    return {
        type: AccountActionsTypes.SEARCH_USERS,
        searchUsers
    }
}

export const getUserAccountAction: ActionCreator<IGetUserAccount> = (userAccount: UserAccount) => {
    return {
        type: AccountActionsTypes.GET_USER_ACCOUNT,
        userAccount
    }
}

export const organizationSuccessAction: ActionCreator<IOrganizationSuccess> = (organizationSuccess: boolean) => {
    return {
        type: AccountActionsTypes.SET_ORGANIZATION_SUCCESS,
        organizationSuccess
    }
}
export const departmentSuccessAction: ActionCreator<IDepartmentSuccess> = (departmentSuccess: boolean) => {
    return {
        type: AccountActionsTypes.SET_DEPARTMENT_SUCCESS,
        departmentSuccess
    }
}
export const positionSuccessAction: ActionCreator<IPositionSuccess> = (positionSuccess: boolean) => {
    return {
        type: AccountActionsTypes.SET_POSITION_SUCCESS,
        positionSuccess
    }
}
export const userAccountSuccessAction: ActionCreator<IUserAccountSuccess> = (userAccountSuccess: boolean) => {
    return {
        type: AccountActionsTypes.SET_USER_ACCOUNT_SUCCESS,
        userAccountSuccess
    }
}
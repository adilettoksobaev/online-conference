export interface AccountState {
    cities: Cities[];
    organization: Organization[];
    department: Department[];
    parentDepartments: Department[],
    position: Position[],
    searchUsers: SearchUsers[],
    userAccount: UserAccount,
    organizationSuccess: boolean,
    departmentSuccess: boolean,
    positionSuccess: boolean,
    userAccountSuccess: boolean,
}

export interface Cities {
    cityId: number;
    cityName: string;
}

export interface Organization {
    organizationId: number,
    organizationName: string,
    organizationInn: string,
    cityId: number,
    conferenceServerDomain: string,
    conferenceServerKey: string,
    cityName: string,
    countAccounts: number
    countDepartments: number
}

export interface Department {
    departmentId: number,
    departmentName: string,
    parentDepartmentId: number,
    organizationId: number
}

export interface Position {
    positionId: number,
    positionName: string,
    organizationId: number
}
export interface UserAccount {
    userId: number,
    userName: string,
    userInn: string,
    phone: string,
    email: string,
    userAccountId: number,
    role: Role,
    organizationId: number,
    positionId: number,
    departmentId: number,
    accessToCreateConferences: boolean,
    password: string,
}

export interface SearchUsers {
    userId: number,
    userName: string,
    phone: string,
    positionName: string,
    departmentName: string,
    done: boolean,
}

export enum Role {
    User = 'User',
    SuperAdmin = 'SuperAdmin',
    Admin = 'Admin',
    ConferenceManager = 'ConferenceManager'
}
  
export interface SetUser {
    userId: number,
    userAccountId: number,
    userName: string,
    userInn: string,
    phone: string,
    email: string,
    role: Role | string,
    organizationId: number | string,
    positionId: number | string,
    departmentId: number | string,
    accessToCreateConferences: boolean
}
import { SearchUsers } from "../Account/types";

export interface ConferencesState {
    conferences: Conferences[],
    conferenceUsers: SearchUsers[],
    conferenceSuccess: boolean,
    isPublic: boolean,
    publicRoomPassword: string,
    startConference: StartConferenceType | null
}

export type StartConferenceType = {
    resultType: string,
    secondsToStart: number,
    conferenceId: number,
    password: string | null,
}

export interface Conferences {
    conferenceId: number,
    conferenceName: string,
    startDate: Date,
    timeStart: string,
    timeEnd: string,
    repeat: boolean,
    dayForRepeated: Week[],
    countParticipants: number,
    creatorName: string,
    creatorPosition: string,
    needPassword: boolean,
    isPublic: boolean,
    conferenceStarted: boolean,
    timeSinceStartOfConference: string,
}

enum Week {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
}

export interface SetConferences {
    conferenceId: number,
    conferenceName: string,
    status: string,
    timeStart: string,
    timeEnd: string,
    repeat: boolean,
    dayForRepeated: Week[],
    startDate: Date | null,
    endDate: Date | null,
    isPublic: boolean,
    conferencePublicKey: string,
    publicRoomPassword: string,
    conferenceParticipants: ConferenceParticipants[]
}

export type ConferenceParticipants = {
    userId: number,
    userName: string,
    isModerator: boolean
}

export enum DateIntervals {
    today = 'today',
    week = 'week',
    month = 'month'
}
  
export type CreateConferenceNow = {
    conferenceName: string, 
    conferencePassword: string, 
    conferencePublicKey: string,
}
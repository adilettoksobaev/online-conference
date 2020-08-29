import axios from 'axios';
import { SetConferences } from '../store/Conferences/types';
import { baseUrl } from '../utils/baseUrl';

const instance = axios.create({
    baseURL: `${baseUrl()}api/Conferences/`,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})

export const ConferencesAPI = {

    async getConferences(sessionId: string, interval: string) {
        return await instance.post(`GetConferences/${sessionId}`, { interval }).then(res => {
            return res.data;
        })
    },

    async getConference(sessionId: string, conferenceId: number) {
        return await instance.get(`GetConference/${sessionId}/${conferenceId}`).then(res => {
            return res.data;
        })
    },

    async setConference(sessionId: string, payload: SetConferences) {
        const { ...payloadData } = payload;
        return await instance.post(`SetConference/${sessionId}`, {...payloadData}).then(res => {
            return res.data;
        })
    },

    async startConference(sessionId: string, conferenceId: number, password: string | null) {
        return await instance.post(`StartConference/${sessionId}`, {conferenceId, password}).then(res => {
            return res.data;
        })
    },

    async deleteConference(sessionId: string, conferenceId: number) {
        return await instance.post(`DeleteConference/${sessionId}/${conferenceId}`).then(res => {
            return res.data;
        })
    },

    async createConferenceNow(sessionId: string, conferenceName: string, conferencePassword: string, conferencePublicKey: string) {
        return await instance.post(`CreateConferenceNow/${sessionId}`, {conferenceName, conferencePassword, conferencePublicKey}).then(res => {
            return res.data;
        })
    },

    async startPublicConference(conferenceKey: string, userName: string, password: string) {
        return await instance.post(`StartPublicConference`, {conferenceKey, userName, password}).then(res => {
            return res.data;
        })
    },
}
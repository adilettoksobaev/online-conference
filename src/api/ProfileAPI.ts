import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';

const instance = axios.create({
    baseURL: `${baseUrl()}api/Profile/`,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})

export const ProfileAPI = {
    async getUserProfile(sessionId: string) {
        return await instance.get(`GetUserProfile/${sessionId}`).then(res => {
            return res.data;
        });
    },

    async setUserProfile(sessionId: string, userName: string, phone: string, email: string, password: string | null) {
        return await instance.post(`SetUserProfile/${sessionId}`, {userName, phone, email, password});
    },   
}
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';

const instance = axios.create({
    baseURL: `${baseUrl()}api/Auth/`,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})

export const AuthAPI = {
    async authByPassword(phone: string, password: string) {
        return await instance.post(`AuthByPassword/`, {phone, password})
    },
    
    async authByPhone(phone: string) {
        return await instance.post(`AuthByPhone/${phone}`)
    },

    async phonePinConfirm(pin: string, phone: string) {
        return await instance.post(`PhonePinConfirm/`, {pin,phone})
    },

    async checkSession(sessionId: string) {
        return await instance.post(`CheckSession/${sessionId}/`)
    },

    async logout(sessionId: string) {
        return await instance.post(`Logout/${sessionId}/`)
        .then(res => {
            return res.data
        })
    }
}
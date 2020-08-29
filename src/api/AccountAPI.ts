import axios from 'axios';
import { UserAccount } from '../store/Account/types';
import { baseUrl } from '../utils/baseUrl';

const instance = axios.create({
    baseURL: `${baseUrl()}api/Account/`,
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
})

export const AccountAPI = {

    async getCities(sessionId: string) {
        return await instance.get(`GetCities/${sessionId}`).then(res => {
            return res.data;
        })
    },

    async setOrganization(sessionId: string, organizationId: number, organizationName: string, cityId: number, conferenceServerDomain: string, conferenceServerKey: string) {
        return await instance.post(`SetOrganization/${sessionId}`, {organizationId, organizationName, cityId, conferenceServerDomain, conferenceServerKey}).then(res => {
            return res.data;
        })
    },

    async getOrganizations(sessionId: string, cityId: number) {
        return await instance.post(`GetOrganizations/${sessionId}`, {cityId}).then(res => {
            return res.data;
        })
    },

    async deleteOrganization(sessionId: string, organizationId: number) {
        return await instance.post(`DeleteOrganization/${sessionId}/${organizationId}`).then(res => {
            return res.data;
        })
    },

    async setDepartment(sessionId: string, departmentId: number, departmentName: string, parentDepartmentId: number | null, organizationId: number) {
        return await instance.post(`SetDepartment/${sessionId}`, {departmentId, departmentName, parentDepartmentId, organizationId}).then(res => {
            return res.data;
        })
    },

    async getDepartments(sessionId: string, organizationId: number, parentDepartmentId: number) {
        return await instance.get(`GetDepartments/${sessionId}/${organizationId}/?parentDepartmentId=${parentDepartmentId}`).then(res => {
            return res.data;
        })
    },

    async getParentDepartments(sessionId: string, currentDepartmentId: number) {
        return await instance.get(`GetParentDepartments/${sessionId}/${currentDepartmentId}`).then(res => {
            return res.data;
        })
    },

    async setPosition(sessionId: string, positionName: string, organizationId: number) {
        return await instance.post(`SetPosition/${sessionId}`, { positionName, organizationId}).then(res => {
            return res.data;
        })
    },

    async getPositions(sessionId: string, organizationId: number) {
        return await instance.get(`GetPositions/${sessionId}/${organizationId}`).then(res => {
            return res.data;
        })
    },

    async setUserAccount(sessionId: string, payload: UserAccount) {
        const { userId, userAccountId, userName, userInn, phone, email, role, organizationId, positionId, departmentId, accessToCreateConferences, password } = payload;
        return await instance.post(`SetUserAccount/${sessionId}`, {userId, userAccountId, userName, userInn, phone, email, role, organizationId, positionId, departmentId, accessToCreateConferences, password})
    },

    async searchUsers(sessionId: string, userName: string, organizationId: number, departmentId: number, withoutDepartment?: boolean) {
        return await instance.post(`SearchUsers/${sessionId}`, {userName, organizationId, departmentId, withoutDepartment}).then(res => {
            return res.data;
        })
    },

    async getUserAccount(sessionId: string, userId: number) {
        return await instance.get(`GetUserAccount/${sessionId}/${userId}`).then(res => {
            return res.data;
        })
    },

    async deleteUser(sessionId: string, userId: number) {
        return await instance.post(`DeleteUser/${sessionId}/${userId}`).then(res => {
            return res.data;
        })
    },
}
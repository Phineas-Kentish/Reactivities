import axios, {AxiosError, AxiosResponse} from 'axios'
import {Activity, ActivityFormValues} from '../models/activity'
import {toast} from 'react-toastify'
import { history } from '../..'
import { store } from './stores/Store' 
import { User, UserFormValues } from '../models/user'

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL

// Add JWT header 
axios.interceptors.request.use(config => {
    const token = store.commonStore.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

axios.interceptors.response.use(async response => {    
    return response
}, (error: AxiosError) => {
    const {data, status, config} = error.response!
    switch(status){
        case 400:
            if(typeof data === "string") {
                toast.error(data)
            }
            if(config.method === "get" && data.errors.hasOwnProperty("id")) {
                history.push("/not-found")    
            }
            if(data.errors){
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat()
            }         
            break
        case 401:
            toast.error("Unauthorized")
            break
        case 404:
            history.push("/not-found")
            break
        case 500:
            store.commonStore.setServerError(data)
            history.push("server-error")
            break
    }

    return Promise.reject(error)
})

const responseBody = <T> (response: AxiosResponse<T>) => {
    console.log(response)
    return response.data
}

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),    
}

// Requests for Activities
const Activities = {
    list: () => requests.get<Activity[]>("/activities"),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

// Requests for Authentication
const Account = {
    current: () => requests.get<User>("/account"),
    login: (user: UserFormValues) => requests.post<User>("account/login", user),
    register: (user: UserFormValues) => requests.post<User>("account/register", user),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
}

const agent = {
    Activities,
    Account
}

export default agent
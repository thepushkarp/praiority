import { toast } from "react-toastify"

import { client } from "./axiosInstance"

import example from "../examples/tasks.json"

export const loginHandler = async (payload) => {
    // let response = example 
    let response = await client('/login', { baseURL: "auth", method: 'POST', data: payload })
    if (response.status === 200) {
        console.log("response", response)
        let data_to_send = await response.data
        return {
            status: true,
            data: data_to_send
        }
    }
    else {
        toast.error(response.data.message)
        return {
            status: false,
        }
    }
    // return response
}

export const signupHandler = async (payload) => {
    console.log('sign up called')
    let response = await client('/signup', { baseURL: "auth", method: 'POST', data: payload })
    if (response.status === 200) {
        return await response.data
    }
    else {
        toast.error(response.data.message)
        return {
            status: false,
        }
    }
}
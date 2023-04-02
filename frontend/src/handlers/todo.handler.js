import { toast } from "react-toastify"

import { client } from "./axiosInstance"



export const getTodos = async (payload) => {
    let response = await client('/todos', { baseURL: "base", method: 'GET' })
    try {
        if (response?.status === 200) {
            return await response.data
        }
        else {
            toast.error(response.data.message)
            return {
                status: false,
            }
        }
    } catch (error) {
        console.log(error)
        return {
            data:[]
        }
    }
    
}
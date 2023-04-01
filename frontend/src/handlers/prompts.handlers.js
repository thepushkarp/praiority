import {toast} from "react-toastify"

import { client } from "./axiosInstance"

import example from "../examples/tasks.json"

export const postPrompt = async(payload)=>{
    let response = example 
    // let response = await client('/prompts', {baseURL:"base",method: 'POST', data: payload})
    // if(response.status=== 200){
    //     return await   response.data
    // }
    // else{
    //     toast.error(response.data.message)
    // }
    return response
}
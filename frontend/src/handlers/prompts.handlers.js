import {toast} from "react-toastify"

import { client } from "./axiosInstance"

import example from "../examples/tasks.json"

export const postPrompt = async(payload)=>{
    let response = example 
    // let response = await client('/create_tasks', {baseURL:"base",method: 'POST', data: payload})
    // if(response.status=== 200){
    //     let data_to_send =  await  response.data
    //     return {
    //         status:true,
    //         data:data_to_send
    //     }
    // }
    // else{
    //     toast.error(response.data.message)
    //     return {
    //         status: false,
    //         data:example
    //     }
    // }
    return {
        status:true,
        data:response
    }
}
import {toast} from "react-toastify"

import { client } from "./axiosInstance"

export const postPrompt = async(payload)=>{
    let response = await client('/prompts', {baseURL:"base",method: 'POST', data: payload})
    if(response.status=== 200){
        return await   response.data
    }
    else{
        toast.error(response.data.message)
    }
    return response
}
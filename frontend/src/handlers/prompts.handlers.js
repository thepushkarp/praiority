import { toast } from 'react-toastify';

import { client } from './axiosInstance';

import example from '../examples/tasks.json';

export const postPrompt = async (payload) => {
  // let response = example
  try {
    let response = await client('/sub_tasks', {
      baseURL: 'base',
      method: 'POST',
      data: payload,
    });
    if (response.status === 200) {
      let data_to_send = await response.data;
      return {
        status: true,
        data: data_to_send,
      };
    } else {
      toast.error(response.data.message);
      return {
        status: false,
        data: example,
      };
    }
  } catch (error) {
    toast.error('could not process request');
    return {
      status: false,
      data: example,
    };
  }

  // return {
  //     status:true,
  //     data:response
  // }
};

export const updateTask = async (payload) => {
  let response = await client(`/tasks/${payload.task_id}`, {
    baseURL: 'base',
    method: 'PUT',
    data: payload,
  });
  if (response?.status === 200) {
    return response.data;
  } else {
    toast.error(response.data.message);
    return {
      status: false,
    };
  }
};

export const updateSubTask = async (payload) => {
  try {
    let response = await client(`/subtasks/${payload.sub_task_id}`, {
      baseURL: 'base',
      method: 'PUT',
      data: payload,
    });
    if (response?.status === 200) {
      return response.data;
    } else {
      // toast.error("Could not update test")
      return {
        status: false,
      };
    }
  } catch (error) {
    console.log(error);
    // toast.error(error.response.data.message)
  }
};

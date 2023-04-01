import json
import database
from typing import Annotated, List, Union

import openai
import user_auth_api
from fastapi import Response, status
from pydantic import BaseModel

with open('./config.json') as f:    
        config = json.load(f)


class UserRequestedTasks(BaseModel):
    requested_tasks: List[str]

class TaskDetails(BaseModel):
    task_detail_id: int
    task_detail_name: str
    is_completed: bool = False
    task_time_estimate_in_minutes: int
    task_priority: str

class TaskEntity(BaseModel):
    task_id: int
    user_id: int
    task_name: str
    task_details: List[TaskDetails] =[]


# async def get_tasks(current_user:user_auth_api.User):
#     conn = database.get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute('SELECT task_id, task_name FROM task_entity WHERE user_id = ?', (current_user.id,))
#     row = cursor.fetchone()
#     conn.close()

#     if row is not None:
#         return TaskEntity(task_id=row[0], task_name=row[1])
    
# async def get_task_entity(current_user:user_auth_api.User):
#     conn = database.get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute('SELECT task_id, task_name FROM task_entity WHERE user_id = ?', (current_user.id,))
#     row = cursor.fetchone()
#     conn.close()

#     if row is not None:
#         return User(id=row[0], email=row[1], password=row[2])

# async def get_task_detail_entity(current_user:user_auth_api.User):
#     pass


async def create_tasks(tasks:UserRequestedTasks,response: Response,current_user: user_auth_api.User):
    
    requested_tasks_as_string = _prepare_input_tasks(tasks)

    try:
        generated_tasks = await _get_openai_response(requested_tasks_as_string)

    except openai.error.Timeout as e:
        #Handle timeout error, e.g. retry or log
        response.status_code = status.HTTP_408_REQUEST_TIMEOUT
        return {"details":f"OpenAI API request timed out: {e}"}

    except openai.error.APIError as e:
        #Handle API error, e.g. retry or log
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"details":f"OpenAI API returned an API Error: {e}"}
        
    except openai.error.APIConnectionError as e:
        #Handle connection error, e.g. check network or log
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"details":f"OpenAI API request failed to connect: {e}"}
        
    except openai.error.InvalidRequestError as e:
        #Handle invalid request error, e.g. validate parameters or log
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"details":f"OpenAI API request was invalid: {e}"}
        
    except openai.error.AuthenticationError as e:
        #Handle authentication error, e.g. check credentials or log
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"details":f"OpenAI API request was not authorized: {e}"}
        
    except openai.error.PermissionError as e:
        #Handle permission error, e.g. check scope or log
        response.status_code = status.HTTP_403_FORBIDDEN
        return {"details":f"OpenAI API request was not permitted: {e}"}
        
    except openai.error.RateLimitError as e:
        #Handle rate limit error, e.g. wait or log
        response.status_code = status.HTTP_429_TOO_MANY_REQUESTS
        return {"details":f"OpenAI API request exceeded rate limit: {e}"}
        

    return _parse_tasks(generated_tasks)


async def _get_openai_response(tasks:str):
    prompts = config["prompts"]

    response = openai.ChatCompletion.create(
        model=config["models"]["gpt-3.5"]["model-name"],
        messages=[
            {"role": "system", "content": prompts["task_division_system_prompt"]},
            {
                "role": "user",
                "content": prompts["task_division_prompt_prefix"]
                + tasks
                + prompts["task_division_prompt_suffix"],
            },
        ],
        temperature=0.5,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["\n\n\n"],
    )

    openai_response = response["choices"][0]["message"]["content"]
    return openai_response


def _prepare_input_tasks(tasks:UserRequestedTasks):
    
    requested_tasks = tasks.requested_tasks
    task_list=''

    print('=========')
    for index, task in enumerate(requested_tasks):
        numbered_task = f'\n{index}. {task}'
        print(numbered_task)
        task_list = task_list + numbered_task

    print('=========')

    return task_list


def _parse_tasks(tasks_output: str) -> dict:
    tasks = []
    for task in tasks_output.split("Task: "):
        sub_task = {}
        
        if task.strip() == "":
            continue

        task_name, task_details = task.split("\nMini Atomic Task | Time Estimate | Priority Level |")
        task_name = task_name.strip()
        task_details = task_details.strip()
        sub_task["task_name"] = task_name
        sub_task["task_details"] = []

        for task_detail in task_details.split("\n"):
            current_sub_task_detail = {}
            if task_detail.strip() == "" or len(task_detail.split("|")) != 4:
                continue

            task_detail = task_detail.strip()
            task_detail_name, task_time_estimate, task_priority, _ = task_detail.split("|")
            current_sub_task_detail["task_detail_name"] = task_detail_name.strip()
            current_sub_task_detail["task_time_estimate"] = task_time_estimate.strip()
            current_sub_task_detail["task_priority"] = task_priority.strip()
            sub_task["task_details"].append(current_sub_task_detail)

        tasks.append(sub_task)

    return tasks


async def _save_tasks_to_DB():
    pass
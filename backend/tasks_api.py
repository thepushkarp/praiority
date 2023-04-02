import json
from typing import Annotated, List, Union

import database
import openai
import user_auth_api
from fastapi import Response, status
from pydantic import BaseModel

with open('../config.json') as f:    
        config = json.load(f)


class UserRequestedTasks(BaseModel):
    requested_tasks: List[str]

class TaskDetails(BaseModel):
    task_detail_id: int = 0
    task_detail_name: str
    is_completed: bool = False
    task_time_estimate_in_minutes: str
    task_priority: str

class TimeSlot(BaseModel):
    task_id: int = 0
    user_id: int = 0
    slot_time: str
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

_scheduled_tasks = """
Time Slot: 8:00 AM - 9:00 AM
Check bank balance | 5 | High |

Time Slot: 9:00 AM - 10:00 AM
Fill watering can | 2 | Medium |
Water plants | 10 | High |
Clean up spilled water | 3 | Low |

Time Slot: 10:00 AM - 11:00 AM
Decide who to call | 5 | Medium |
Make phone call | 15 | High |
Listen to family member | 20 | High |
Take notes if necessary | 5 | Medium |

Time Slot: 11:00 AM - 12:00 PM
Withdraw cash | 10 | High |
Go to broker's office | 15 | High |
Pay rent | 5 | High |

Time Slot: 12:00 PM - 1:00 PM
Lunch Break

Time Slot: 1:00 PM - 2:00 PM
Set alarm | 2 | High |
Brush teeth | 5 | High |
Change into pajamas | 2 | Medium |

Time Slot: 2:00 PM - 3:00 PM
Read for 20 minutes | 20 | Medium |

Time Slot: 3:00 PM - 4:00 PM
Break

Time Slot: 4:00 PM - 5:00 PM
Check bank balance | 5 | High |

Time Slot: 5:00 PM - 6:00 PM
Fill watering can | 2 | Medium |
Water plants | 10 | High |
Clean up spilled water | 3 | Low |

Time Slot: 6:00 PM - 7:00 PM
Break

Time Slot: 7:00 PM - 8:00 PM
Decide who to call | 5 | Medium |
Make phone call | 15 | High |
Listen to family member | 20 | High |
Take notes if necessary | 5 | Medium |

Time Slot: 8:00 PM - 9:00 PM
Read for 20 minutes | 20 | Medium |

Time Slot: 9:00 PM - 10:00 PM
Turn off lights | 2 | High |

Note: The time slots can be adjusted as per the individual's preference and availability."""

async def sub_tasks(tasks:UserRequestedTasks,response: Response,current_user: user_auth_api.User):
    requested_tasks_as_string = _prepare_input_tasks(tasks)

    try:
        
        generated_tasks = await _get_generated_tasks_from_openai(requested_tasks_as_string)

        parsed_tasks = _parse_generated_tasks(generated_tasks)

        return parsed_tasks

    except openai.error.RateLimitError as e:
        #Handle rate limit error, e.g. wait or log
        response.status_code = status.HTTP_429_TOO_MANY_REQUESTS
        return {"details":f"OpenAI API request exceeded rate limit: {e}"}

async def create_tasks(tasks:UserRequestedTasks,response: Response,current_user: user_auth_api.User):
    
    requested_tasks_as_string = _prepare_input_tasks(tasks)

    try:
        
        generated_tasks = await _get_generated_tasks_from_openai(requested_tasks_as_string)
        scheduled_tasks = await _get_scheduled_tasks_from_openai(generated_tasks)

        parsed_tasks = _parse_scheduled_tasks(scheduled_tasks)

        return parsed_tasks

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
        



async def _get_generated_tasks_from_openai(tasks:str):
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

async def _get_scheduled_tasks_from_openai(generated_tasks:str):

    prompts = config["prompts"]

    response = openai.ChatCompletion.create(
        model=config["models"]["gpt-3.5"]["model-name"],
        messages=[
            {"role": "system", "content": prompts['day_schedule_system_prompt']},
            {
                "role": "user",
                "content": prompts['day_schedule_prompt_prefix']
                + generated_tasks
                + prompts['day_schedule_system_prompt_suffix'],
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


def _parse_generated_tasks(tasks_output: str) -> dict:
    tasks = []

    for task in tasks_output.split("Task: "):
        current_task = {}
        if task.strip() == "":
            continue
        task_name, task_details = task.split("\nMini Atomic Task | Time Estimate | Priority Level |")
        task_name = task_name.strip()
        task_details = task_details.strip()
        current_task["task_name"] = task_name
        current_task["task_details"] = []
        for task_detail in task_details.split("\n"):
            current_task_detail = {}
            if task_detail.strip() == "" or len(task_detail.split("|")) != 4:
                continue
            task_detail = task_detail.strip()
            task_detail_name, task_time_estimate, task_priority, _ = task_detail.split("|")
            current_task_detail["task_detail_name"] = task_detail_name.strip()
            current_task_detail["task_time_estimate"] = task_time_estimate.strip()
            current_task_detail["task_priority"] = task_priority.strip()
            current_task["task_details"].append(current_task_detail)
        tasks.append(current_task)
    return tasks

def _parse_scheduled_tasks(tasks_output: str) -> List[TimeSlot]:

    available_slots = []

    for slot_data in tasks_output.split("Time Slot: "):
        
        if slot_data.strip() == "":
            continue
        
        slot_and_sub_tasks = slot_data.split("\n")

        slot_time = slot_and_sub_tasks[0]
        sub_tasks_str = slot_and_sub_tasks[1:]

        sub_tasks = []

        for current_sub_task in sub_tasks_str:

            if current_sub_task.strip() == "" or len(current_sub_task.split("|")) != 4:
                continue

            current_sub_task = current_sub_task.strip()
            sub_task_name, sub_task_time_estimate, sub_task_priority,_ = current_sub_task.split("|")

            sub_task = TaskDetails(
                task_detail_name=sub_task_name.strip(),
                task_time_estimate_in_minutes=sub_task_time_estimate.strip(),
                task_priority=sub_task_priority.strip(),
            )

            sub_tasks.append(sub_task)


        current_slot = TimeSlot(
            slot_time=slot_time,
            task_details=sub_tasks
        )

        available_slots.append(current_slot)

    return available_slots


async def _save_tasks_to_DB():
    pass
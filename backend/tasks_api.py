from typing import Annotated, List, Union

from fastapi import Body, FastAPI
from pydantic import BaseModel


class UserRequestedTasks(BaseModel):
    requested_tasks: List[str]

class TaskDetails(BaseModel):
    task_detail_id: int
    task_detail_name: str
    task_time_estimate_in_minutes: int
    task_priority: str

class TaskEntity(BaseModel):
    task_id: str
    task_name: str
    task_details: List[TaskDetails] =[]


async def create_tasks(tasks:UserRequestedTasks):


    print(tasks)

    return "1"

    # prompt = "Add tasks:"

    # for task in tasks:
    #     prompt += f"\n- {task}"
    
    # response = openai.Completion.create(
    #     engine="davinci",
    #     prompt=prompt,
    #     max_tokens=1024,
    #     n=1,
    #     stop=None,
    #     temperature=0.5,
    # )

    # task_entities = []

    # for task_data in response.choices[0].text.split("\n")[1:-1]:
    #     task_entity = TaskEntity(
    #         task_name=task_data.split("|")[0].strip(),
    #         task_id=task_data.split("|")[1].strip(),
    #         task_time=int(task_data.split("|")[2].strip()),
    #         sequence=int(task_data.split("|")[3].strip()),
    #     )
    #     if len(task_data.split("|")) > 4:
    #         subtask_data = task_data.split("|")[4].strip()
    #         if subtask_data:
    #             subtasks = create_subtasks(subtask_data)
    #             task_entity.subtasks = subtasks
    #     task_entities.append(task_entity)

    # return task_entities





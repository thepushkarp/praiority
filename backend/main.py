import os
import sqlite3
from datetime import datetime, timedelta
from typing import Annotated, List

import openai
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

import moderation_api
import tasks_api
import user_auth_api

load_dotenv()

openai.api_key = os.environ.get('OPENAI_API_KEY')

app = FastAPI()


@app.get("/")
async def root():
    return {'hello':'hackers'}

@app.post("/check_abuse/")
async def check_abuse(text: moderation_api.ModerationEntity):
    return await moderation_api.check_abuse_api(text)

@app.post("/signup/")
async def signup(user: user_auth_api.NewUser):
    return await user_auth_api.signup(user)

@app.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await user_auth_api.login(form_data)

@app.get("/users/me/")
async def read_users_me(current_user: user_auth_api.User = Depends(user_auth_api.get_current_user)):
    return await user_auth_api.read_users_me(current_user)

@app.post("/create_tasks/")
async def create_tasks(tasks:tasks_api.UserRequestedTasks):
    return await tasks_api.create_tasks(tasks)


    # return "1"

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

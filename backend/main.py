import os
import sqlite3
from datetime import datetime, timedelta
from typing import Annotated, List

import moderation_api
import openai
import tasks_api
import user_auth_api
import uvicorn
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

load_dotenv()

openai.api_key = os.environ.get('OPENAI_API_KEY')

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {'hello':'hackers'}

@app.post("/check_abuse/")
async def check_abuse(text: moderation_api.ModerationEntity):
    return await moderation_api.check_abuse_api(text)

@app.post("/signup/",status_code=201)
async def signup(user: user_auth_api.NewUser):
    return await user_auth_api.signup(user)

@app.post("/login/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await user_auth_api.login(form_data)

@app.get("/users/me/")
async def read_users_me(current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    return await user_auth_api.read_users_me(current_user)

@app.post("/create_tasks/")
async def create_tasks(tasks:tasks_api.UserRequestedTasks,response: Response,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    return await tasks_api.create_tasks(tasks,response,current_user)


@app.post("/sub_tasks/")
async def create_sub_tasks(tasks:tasks_api.UserRequestedTasks,response: Response,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    return await tasks_api.sub_tasks(tasks,response,current_user)

# Get SubTask by ID
@app.get("/subtasks/{sub_task_id}")
async def read_subtask(sub_task_id: int,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    sub_task = await tasks_api.get_subtask(sub_task_id)
    if sub_task is None:
        raise HTTPException(status_code=404, detail="SubTask not found")
    return sub_task

# Update SubTask by ID
@app.put("/subtasks/{sub_task_id}")
async def update_subtask(sub_task_id: int, sub_task: tasks_api.SubTask,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    existing_sub_task = await tasks_api.get_subtask(sub_task_id)
    if existing_sub_task is None:
        raise HTTPException(status_code=404, detail="SubTask not found")
    await tasks_api.update_subtask_in_db(sub_task_id, sub_task)
    return {"message": "SubTask updated successfully"}

# Delete SubTask by ID
@app.delete("/subtasks/{sub_task_id}")
async def delete_subtask(sub_task_id: int,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    existing_sub_task = await tasks_api.get_subtask(sub_task_id)
    if existing_sub_task is None:
        raise HTTPException(status_code=404, detail="SubTask not found")
    await tasks_api.delete_subtask_from_db(sub_task_id)
    return {"message": "SubTask deleted successfully"}


# Get Task by ID
@app.get("/tasks/{task_id}")
async def read_task(task_id: int,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    task = await tasks_api.get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# Get Task List
@app.get("/tasks/")
async def get_tasks_for_user(current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    tasks = await tasks_api.get_tasks_for_user(current_user)
    if tasks is None:
        raise HTTPException(status_code=404, detail="Tasks not found")
    return tasks

# Update Task by ID
@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: tasks_api.Task,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    existing_task = await tasks_api.get_task(task_id)
    if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    await tasks_api.update_task_in_db(task_id, task)
    return {"message": "Task updated successfully"}

# Delete Task by ID
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: int,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    existing_task = await tasks_api.get_task(task_id)
    if existing_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    await tasks_api.delete_task_from_db(task_id)
    return {"message": "Task deleted successfully"}

# Get SubTask List by parent_task_id
@app.get("/tasks/{task_id}/subtasks")
async def get_subtasks_for_task(task_id:int,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    tasks = await tasks_api.get_subtasks_for_parent(task_id)
    if tasks is None:
        raise HTTPException(status_code=404, detail="Tasks not found")
    return tasks

if __name__ == "__main__":
  uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import os
import sqlite3
from datetime import datetime, timedelta
from typing import Annotated, List

import moderation_api
import openai
import tasks_api
import user_auth_api
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
async def sub_tasks(tasks:tasks_api.UserRequestedTasks,response: Response,current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    return await tasks_api.sub_tasks(tasks,response,current_user)

@app.get("/tasks/")
async def get_tasks(current_user: user_auth_api.User = Depends(user_auth_api._get_current_user)):
    return await tasks_api.get_tasks(current_user)


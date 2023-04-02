from datetime import datetime, timedelta

import database
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel

SECRET_KEY = "your-secret-key-goes-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24*60


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    id: int
    email: str
    password: str

class NewUser(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str = None
    

async def _get_user(email: str):
    conn = await database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, email, password FROM users WHERE email = ?', (email,))
    row = cursor.fetchone()
    conn.close()

    if row is not None:
        return User(id=row[0], email=row[1], password=row[2])

async def _authenticate_user(email: str, password: str):
    user = await _get_user(email)
    if not user:
        return False
    if not pwd_context.verify(password, user.password):
        return False
    return user

def _create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def signup(user: NewUser):
    conn = await database.get_db_connection()
    cursor = conn.cursor()

    cursor.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);')

    conn.commit()

    hashed_password = pwd_context.hash(user.password)
    cursor.execute('INSERT INTO users (email, password) VALUES (?, ?)', (user.email, hashed_password))
    conn.commit()
    conn.close()
    return {"message": "User created"}

async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await _authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def _get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except :
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = await _get_user(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user

async def read_users_me(current_user: User = Depends(_get_current_user)):
    return current_user

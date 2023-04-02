import sqlite3


async def get_db_connection():
    conn = sqlite3.connect('users.sqlite')
    return conn

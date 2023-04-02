import sqlite3


async def get_db_connection():
    conn = sqlite3.connect('users.sqlite')

    await _create_tables(conn)

    return conn

async def _create_tables(conn:sqlite3.Connection):
    cursor = conn.cursor() 
    
    cursor.execute('CREATE TABLE IF NOT EXISTS sub_tasks (sub_task_id INTEGER PRIMARY KEY, parent_task_id INTEGER NOT NULL, sub_task_name TEXT NOT NULL, task_time_estimate_in_minutes TEXT NOT NULL, task_priority TEXT NOT NULL, is_completed BOOLEAN DEFAULT FALSE, is_accepted BOOLEAN DEFAULT TRUE);')
    conn.commit() 

    cursor.execute('CREATE TABLE IF NOT EXISTS task (task_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, task_name TEXT NOT NULL);')
    conn.commit()

    cursor.execute('CREATE TABLE IF NOT EXISTS slot (slot_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, slot_time TEXT NOT NULL);')
    conn.commit()


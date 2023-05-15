import React, { useEffect, useState } from 'react';
import EmptyComponent from '../../components/emptyComponent';
import TodoList from '../../components/todo';
import { getTodos } from '../../handlers/todo.handler';

import './styles.css';

function Todo() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    let tasks = await getTodos();
    setTodos(tasks);
  };

  const updateTodo = () => {
    console.log('updated todos');
  };
  return (
    <div>
      {todos.length > 0 ? (
        <div className='todo-container'>
          <h1 className='header'>Your Todos</h1>
          {todos.map((todo) => {
            return (
              <TodoList
                key={todo}
                prompt={todo}
                updateState={updateTodo}
              ></TodoList>
            );
          })}
        </div>
      ) : (
        <EmptyComponent />
      )}
    </div>
  );
}

export default Todo;

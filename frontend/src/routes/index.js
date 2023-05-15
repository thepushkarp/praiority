import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home';
import Login from '../pages/login';
import AddTasks from '../pages/add-tasks';
import Signup from '../pages/signup';
import Todo from '../pages/todos';

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/add-tasks' element={<AddTasks></AddTasks>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/todos' element={<Todo></Todo>}></Route>
    </Routes>
  );
}

export default AppRouter;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AddTasks from '../pages/add-tasks';
import Home from '../pages/home';

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/add-tasks' element={<AddTasks></AddTasks>}></Route>
    </Routes>
  );
}

export default AppRouter;

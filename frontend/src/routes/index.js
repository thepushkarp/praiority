import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Login from '../pages/login';
import Panchayat from '../pages/panchayat';
import Signup from '../pages/signup';
import Todo from '../pages/todos';

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/panchayat' element={<Panchayat></Panchayat>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/signup' element={<Signup></Signup>}></Route>
      <Route path='/todos' element={<Todo></Todo>}></Route>
    </Routes>
  );
}

export default AppRouter;

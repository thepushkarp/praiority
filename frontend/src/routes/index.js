import {Routes,Route} from "react-router-dom"
import Home from "../pages/home"
import Login from "../pages/login"
import Panchayat from "../pages/panchayat"


function AppRouter() {
  return (
    <Routes>
        <Route path="/" element = {<Home></Home>}></Route>
      <Route path="/panchayat" element={<Panchayat></Panchayat>}></Route>
      <Route path="/login" element = {<Login></Login>}></Route>
    </Routes>
  )
}

export default AppRouter
import React from 'react'
import Input from '../../components/input'

import "./styles.css"
function Login() {
  return (
    <div className='login-container'>
        <form className='login-form'>
            <label>
                <Input type="text" placeholder="Username" className="login-form-input"></Input>
            </label>
              <label>
                  <Input type="password" placeholder="Password" className="login-form-input" ></Input>
              </label>
                <button type="submit" className='btn'>Login</button>
                <p>New Here?<a href='/sign-up'>Click Here</a> to sign up</p>
        </form>
    </div>
  )
}

export default Login
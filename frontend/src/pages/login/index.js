import { useState, useEffect } from 'react';
import Input from '../../components/input';
import { loginHandler } from '../../handlers/auth.handler';

import './styles.css';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    let payload = new FormData();
    payload.append('username', username);
    payload.append('password', password);
    let login = await loginHandler(payload);
    if (login.status) {
      window.location.href = '/';
      localStorage.setItem('token', login.data.access_token);
    }
  };

  const handleInputChange = (e, type) => {
    if (type === 'username') {
      setUsername(e.target.value);
    } else if (type === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <div className='login-container'>
      <form
        className='login-form'
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h1>Login</h1>
        <label>
          <Input
            type='text'
            placeholder='Username'
            className='login-form-input'
            onChange={(e) => {
              handleInputChange(e, 'username');
            }}
          ></Input>
        </label>
        <label>
          <Input
            type='password'
            placeholder='Password'
            className='login-form-input'
            onChange={(e) => {
              handleInputChange(e, 'password');
            }}
          ></Input>
        </label>
        <button type='submit' className='btn' onClick={handleLogin}>
          Login
        </button>
        <p>
          New Here?<a href='/signup'>Click Here</a> to sign up
        </p>
      </form>
    </div>
  );
}

export default Login;

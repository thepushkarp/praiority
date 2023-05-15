import React, { useState } from 'react';
import Input from '../../components/input';
import { signupHandler } from '../../handlers/auth.handler';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    let payload = {
      email: username,
      password: password,
    };
    let signup = await signupHandler(payload);
    if (signup.status) {
      window.location.href = '/login';
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
        <h1>Sign Up</h1>
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
          Signup
        </button>
        <p>
          Already have an account?<a href='/login'>Click Here</a> to sign in
        </p>
      </form>
    </div>
  );
}

export default Signup;

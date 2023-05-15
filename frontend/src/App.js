import React from 'react';
import './App.css';
import Header from './components/header';
import AppRouter from './routes';

function App() {
  return (
    <>
      <Header></Header>
      <div className='pages-container' id='pages-container'>
        <AppRouter></AppRouter>
      </div>
    </>
  );
}

export default App;

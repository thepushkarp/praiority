import React from 'react';
import './styles.css';

function Header() {
  return (
    <div className='header'>
      <button>
        <a href='/'>Home</a>
      </button>
      <button>
        <a href='/add-tasks'>Add Tasks</a>
      </button>
    </div>
  );
}

export default Header;

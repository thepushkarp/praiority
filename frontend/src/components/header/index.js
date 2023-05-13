import React from 'react';
import './styles.css';

function Header() {
  return (
    <div className='header'>
      <button>
        <a href='/'>Home</a>
      </button>
      <button>
        <a href='/panchayat'>Add Tasks</a>
      </button>
      <button>
        <a href='/todos'>My Tasks</a>
      </button>
    </div>
  );
}

export default Header;

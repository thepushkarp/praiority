import React from 'react'
import "./styles.css"

function Header() {
  return (
    <div className='header'>
      <button>
        <a href='/'>Home</a>
      </button>
      <button>
        <a href='/panchayat'>Panchayat</a>
      </button>
      <button>
        <a href='/todos'>Kaam ki baatein</a>
      </button>
    </div>
  )
}

export default Header
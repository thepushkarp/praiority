import React from 'react'

import "./styles.css"

function Card(props) {
  return (
    <div className='card-container'>
        {props.data}
    </div>
  )
}

export default Card
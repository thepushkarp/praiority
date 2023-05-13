import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

import './styles.css';
function Input(props) {
  let type = props.type || 'input';
  let input =
    type === 'textarea' ? (
      <ReactTextareaAutosize
        className={`input ${props.className}`}
        maxRows={5}
        onResize={(e) => {
          e.preventDefault();
        }}
        {...props}

        // maxLength={100}
      ></ReactTextareaAutosize>
    ) : (
      <input className={`input ${props.className}`} {...props}></input>
    );

  return input;
}

export default Input;

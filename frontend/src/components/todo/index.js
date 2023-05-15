import PropTypes from 'prop-types';
import React from 'react';
import Input from '../input';

function TodoList({ prompt, updateState }) {
  const toggleCheckbox = (e, id) => {
    let temp_prompts = { ...prompt };
    temp_prompts.sub_tasks.filter(
      (item) => item.sub_task_id === id
    )[0].is_completed = e.target.checked;
    // setPrompt(temp_prompts)
    if (updateState) {
      updateState(temp_prompts);
    }
  };
  return prompt?.sub_tasks?.length > 0 ? (
    <div>
      <div className='tile-header'>
        <h3>{prompt?.task_name}</h3>
        <h3>{prompt?.slot_time}</h3>
      </div>
      <div className='card-grid-row'>
        <div className='card-grid-column'>
          <h3 className='card-grid-item'>Status</h3>
        </div>
        <div className='card-grid-column'>
          <h3 className='card-grid-item'>Time (in min)</h3>
        </div>
        <div className='card-grid-column'>
          <h3 className='card-grid-item'>Task Detail</h3>
        </div>

        <div className='card-grid-column'>
          <h3 className='card-grid-item'>Task Priority</h3>
        </div>
      </div>
      {prompt?.sub_tasks?.map((item, key) => {
        return (
          <div className='card-grid-row' key={key}>
            <Input
              type={'checkbox'}
              checked={item?.is_completed}
              onChange={(e) => toggleCheckbox(e, item.sub_task_id)}
            ></Input>
            <span>{item?.task_time_estimate_in_minutes}</span>
            <span>{item?.sub_task_name}</span>
            <span>{item?.task_priority}</span>
          </div>
        );
      })}
    </div>
  ) : null;
}

TodoList.propTypes = {
  prompt: PropTypes.object,
  updateState: PropTypes.func,
};

export default TodoList;

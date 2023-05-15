import React, { useEffect, useState } from 'react';
import {
  postPrompt,
  updateSubTask,
  updateTask,
} from '../../handlers/prompts.handlers';
import Input from '../input';
import Loader from '../loader';
import TodoList from '../todo';

import './styles.css';

function Card(props) {
  const [prompt, setPrompt] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let temp_data = { ...props.data };
    setPrompt(temp_data);
    console.log(temp_data);
  }, [props.data]);

  const handleInputChange = (e, id) => {
    let temp_prompts = { ...prompt };
    temp_prompts.sub_tasks.filter(
      (item) => item.sub_task_id === id
    )[0].sub_task_name = e.target.value;
    setPrompt(temp_prompts);
  };

  const deleteSubtask = (id) => {
    let temp_prompts = { ...prompt };
    temp_prompts.sub_tasks = temp_prompts.sub_tasks.filter(
      (item) => item.sub_task_id !== id
    );
    setPrompt(temp_prompts);
  };

  const submitTask = async () => {
    setLoading(true);
    let temp_prompts = { ...prompt };
    temp_prompts.is_accepted = true;
    await Promise.all(
      temp_prompts.sub_tasks.map(async (item) => {
        await updateSubTask({ ...item });
      })
    );
    await updateTask({ ...temp_prompts });

    setPrompt(temp_prompts);
    setLoading(false);
  };
  const regenerateTask = async () => {
    setLoading(true);
    const regenerated_task = await postPrompt({
      requested_tasks: [prompt.task_name],
    });
    setLoading(false);
    setPrompt(regenerated_task.data[0]);
  };
  const renderTaskList = () => {
    return (
      <>
        <div className='tile-header'>
          <h3>{prompt?.task_name}</h3>
          <div className='tile-actions'>
            <img src='/icons/tick.svg' alt='approve' onClick={submitTask}></img>
            <img
              src='/icons/refresh.svg'
              alt='regenerate prompt'
              onClick={regenerateTask}
            ></img>
          </div>
        </div>

        {prompt?.sub_tasks?.map((item) => {
          return (
            <div
              className='list-item'
              key={item.sub_task_id}
              id={item.sub_task_id}
            >
              <Input
                value={item?.sub_task_name}
                onChange={(e) => handleInputChange(e, item.sub_task_id)}
              ></Input>
              <div
                className='tile-actions'
                onClick={() => deleteSubtask(item.sub_task_id)}
              >
                <img src='/icons/trash.svg' alt='delete'></img>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  const renderFormattedTasks = () => {
    return (
      // <>
      //   <div className='tile-header'>
      //     <h3>{prompt?.task_name}</h3>
      //     <h3>{prompt?.slot_time}</h3>
      //   </div>
      //   <div className='card-grid-row'>
      //     <div className='card-grid-column'>
      //       <h3 className='card-grid-item'>
      //         Status
      //       </h3>
      //     </div>
      //     <div className='card-grid-column'>
      //     <h3 className='card-grid-item'>
      //       Time
      //     </h3>
      //     </div>
      //     <div className='card-grid-column'>
      //       <h3 className='card-grid-item'>
      //         Task Detail
      //       </h3>
      //     </div>

      //     <div className='card-grid-column'>
      //       <h3 className='card-grid-item'>
      //         Task Priority
      //       </h3>
      //     </div>
      //   </div>
      //   {prompt?.sub_tasks?.map((item, key) => {
      //     return (
      //       <div className='card-grid-row' key={key}>
      //         <Input type={"checkbox"} checked= {item?.is_completed} onChange={(e) => toggleCheckbox(e, item.sub_task_id)}></Input>
      //         <span>{item?.task_time_estimate_in_minutes} min.</span>
      //         <span>{item?.sub_task_name}</span>
      //         <span>{item?.task_priority}</span>
      //       </div>
      //     )
      //   })
      //   }
      // </>
      <TodoList prompt={prompt} updateState={setPrompt}></TodoList>
    );
  };
  return (
    <div className='card-container'>
      {loading ? <Loader /> : null}
      {!loading && prompt?.is_accepted
        ? renderFormattedTasks()
        : renderTaskList()}
    </div>
  );
}

Card.propTypes = {
  data: {},
};

export default Card;

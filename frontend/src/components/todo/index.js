import React from 'react'
import Input from '../input'

function TodoList({prompt,updateState}) {
    const toggleCheckbox = (e, id) => {
        let temp_prompts = { ...prompt }
        temp_prompts.task_details.filter((item) => item.task_detail_id === id)[0].is_completed = e.target.checked
        // setPrompt(temp_prompts)
        if(updateState){
            updateState(temp_prompts)
        }
        console.log(e.target.checked)
    }
  return (
      <>
          <div className='tile-header'>
              <h3>{prompt?.task_name}</h3>
              <h3>{prompt?.slot_time}</h3>
          </div>
          <div className='card-grid-row'>
              <div className='card-grid-column'>
                  <h3 className='card-grid-item'>
                      Status
                  </h3>
              </div>
              <div className='card-grid-column'>
                  <h3 className='card-grid-item'>
                      Time
                  </h3>
              </div>
              <div className='card-grid-column'>
                  <h3 className='card-grid-item'>
                      Task Detail
                  </h3>
              </div>

              <div className='card-grid-column'>
                  <h3 className='card-grid-item'>
                      Task Priority
                  </h3>
              </div>
          </div>
          {prompt?.task_details?.map((item, key) => {
              return (
                  <div className='card-grid-row' key={key}>
                      <Input type={"checkbox"} checked={item?.is_completed} onChange={(e) => toggleCheckbox(e, item.task_detail_id)}></Input>
                      <span>{item?.task_time_estimate_in_minutes} min.</span>
                      <span>{item?.task_detail_name}</span>
                      <span>{item?.task_priority}</span>
                  </div>
              )
          })
          }
      </>
  )
}

export default TodoList
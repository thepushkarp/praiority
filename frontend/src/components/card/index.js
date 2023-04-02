import {useEffect,useState} from 'react'
import { postPrompt } from '../../handlers/prompts.handlers'
import Input from '../input'
import TodoList from '../todo'

import "./styles.css"

function Card(props) {
  const [prompt,setPrompt] = useState([])
  useEffect(()=>{
    let temp_data = {...props.data}
    temp_data.task_details = temp_data.task_details.map((item)=>{
      return {
        ...item,
        checked:true
      }})
      console.log(temp_data,"hsadksab")
    setPrompt(temp_data)
  },[props.data])
 
  const toggleCheckbox = (e, id) => {
    let temp_prompts = { ...prompt }
    temp_prompts.task_details.filter((item) => item.task_detail_id === id)[0].is_completed = e.target.checked
    setPrompt(temp_prompts)
    console.log(e.target.checked)
  }
  const handleInputChange = (e,id)=>{
    console.log(e.target.value,id,prompt)
    let temp_prompts = {...prompt}
    temp_prompts.task_details.filter((item)=>item.task_detail_id===id)[0].task_detail_name = e.target.value
    setPrompt(temp_prompts)
  }

  const deleteSubtask = (id)=>{
    let temp_prompts = {...prompt}
    temp_prompts.task_details = temp_prompts.task_details.filter((item) => item.task_detail_id !==id)
    setPrompt(temp_prompts)
  }

  const submitTask = ()=>{
    console.log(prompt,"submit")
  }
  const regenerateTask = async ()=>{
    console.log(prompt, "regenerate")
    const regenerated_task = await postPrompt({ requested_tasks: prompt.task_details.map((item)=>item.task_detail_name) })
  }
  const renderTaskList = ()=>{
    return (
      <>
        <div className='tile-header'>
          <h3>{prompt?.task_name}</h3>
          <div className='tile-actions'>
            <img src='/icons/tick.svg' alt='approve' onClick={submitTask}></img>
            <img src='/icons/refresh.svg' alt='regenerate prompt' onClick={regenerateTask}></img>
          </div>
        </div>
        
          {prompt?.task_details?.map((item) => {
            return (
              <div className='list-item' id={item.task_detail_id}>
                <Input value={item?.task_detail_name} onChange={(e) => handleInputChange(e, item.task_detail_id)}></Input>
                <div className='tile-actions' onClick={(e) => deleteSubtask(item.task_detail_id)}>
                  <img src='/icons/trash.svg' alt='delete'></img>
                </div>
              </div>
            )
          })}
        
      </>
    )
  }
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
      //   {prompt?.task_details?.map((item, key) => {
      //     return (
      //       <div className='card-grid-row' key={key}>
      //         <Input type={"checkbox"} checked= {item?.is_completed} onChange={(e) => toggleCheckbox(e, item.task_detail_id)}></Input>
      //         <span>{item?.task_time_estimate_in_minutes} min.</span>
      //         <span>{item?.task_detail_name}</span>
      //         <span>{item?.task_priority}</span>
      //       </div>
      //     )
      //   })
      //   }
      // </>
      <TodoList prompt={prompt} updateState = {setPrompt}></TodoList>
    )
  }
  return (
    <div className='card-container'>
      {props.taskList ? renderFormattedTasks() : renderTaskList()}
    </div>
  )
}

export default Card
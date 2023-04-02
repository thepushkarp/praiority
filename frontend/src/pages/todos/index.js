import {useEffect,useState} from 'react'
import EmptyComponent from '../../components/emptyComponent'
import TodoList from '../../components/todo'
import { getTodos } from '../../handlers/todo.handler'

function Todo() {
    const [todos,setTodos] = useState([])

    useEffect(()=>{
        fetchTodos()
    },[])

    const fetchTodos = async()=>{
        let tasks = await getTodos()
        setTodos(tasks)
        console.log(tasks)
    }

    const updateTodo = ()=>{
        console.log('updated todos')
    }
  return (
    <div className='todo header'>
        {todos.length > 0 ?(<div className='todo-container'>
        <h1>Your Todos</h1>
            {todos.map((todo)=>{
                console.log(todos.length)
                return(
                    <TodoList prompt={todo} updateState={updateTodo} ></TodoList>
                )})
            }
        </div>):(
            
            <EmptyComponent/>
        )}
    </div>
  )
}

export default Todo
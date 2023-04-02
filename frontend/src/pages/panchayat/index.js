import {useState,useEffect} from 'react'
import Card from '../../components/card'
import Input from '../../components/input'
import Loader from '../../components/loader'
import { postPrompt } from '../../handlers/prompts.handlers'

import "./styles.css"
function Panchayat() {
    const  [prompts, setPrompts] = useState([])
    const [loading,setLoading] = useState(false)
    const [input,setInput] = useState('')
    const handleSend = async()=>{
      setLoading(true)
        console.log(input.trim().split('\n'),"input to be sent")
        let tempPrompt = await postPrompt({ requested_tasks: input.trim().split('\n') })
        console.log(tempPrompt,"tempPrompt")
        setInput('')
        setPrompts([...tempPrompt.data,...prompts])
        setLoading(false)
    }
    const handleKeyDown = (e)=>{
        if(e.keyCode === 13 && !e.shiftKey){
            e.preventDefault()
            console.log(input)
            handleSend()
        }
    }
  return (
    <div className='panchayat-page'>
        <div className='prompts-container'>
              {     
                    loading? <Loader></Loader>:
                    prompts.map((prompt,idx)=>{
                        console.log(prompt,"prompt")
                        return <Card key={idx} data={prompt} taskList={prompt.is_accepted}></Card>
                    }
                    )
              }
        </div>
        <div className='input-container'>
              <Input 
                type= "textarea"
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here"
              ></Input>
              <button onClick={handleSend} className='send btn'>
                <img src='/icons/send.png' alt='send'></img>
              </button>
        </div>
    </div>
  )
}

export default Panchayat
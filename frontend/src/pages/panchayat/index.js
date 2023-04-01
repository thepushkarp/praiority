import {useState,useEffect} from 'react'
import Card from '../../components/card'
import Input from '../../components/input'
import Loader from '../../components/loader'
import { postPrompt } from '../../handlers/prompts.handlers'

import "./styles.css"
function Panchayat() {
    let str = 
`8:00 AM - 8:15 AM | Get Ready For The Day | Medium  
8:15 AM - 8:30 AM | Make A Grocery List | High 
8:30 AM - 8:40 AM | Check For Coupons/Offers | Medium  
8:40 AM - 8:50 AM | Get Ready To Go Out | Medium 
8:50 AM - 9:05 AM | Drive/Walk To The Store | High 
9:05 AM - 9:35 AM | Shop For Groceries | High 
9:35 AM - 9:45 AM | Stand In Line To Pay | Medium  
9:45 AM - 10:00 AM | Drive/Walk Home | High 
10:00 AM - 10:10 AM | Take A Short Break | Low 
10:10 AM - 11:00 AM | Workout In The Gym | High 
11:00 AM - 11:10 AM | Take A Short Break | Low 
11:10 AM - 11:25 AM | Get Ready And Leave For Doctor's Appointment | High 
11:25 AM - 11:55 AM | Drive/Walk To The Clinic | High 
11:55 AM - 12:00 PM | Check-In At The Reception | High 
12:00 PM - 12:30 PM | Meet With The Doctor | High 
12:30 PM - 1:00 PM | Drive/Walk Back Home | High 
1:00 PM - 2:00 PM | Lunch Break | Low 
2:00 PM - 2:15 PM | Get Ready And Leave To Pick Up Manu | High 
2:15 PM - 2:45 PM | Drive/Walk To The Station | High 
2:45 PM - 2:55 PM | Wait For Manu To Arrive | Low 
2:55 PM - 3:05 PM | Greet And Leave | Low 
3:05 PM - 3:30 PM | Take A Short Break | Low 
3:30 PM - 3:35 PM | Pick Up Phone And Dial Mom | Medium 
3:35 PM - 3:50 PM | Talk To Mom And Ask How She Is Doing | High
3:50 PM - 4:00 PM | Discuss Any Important Matters | High 
4:00 PM - 4:03 PM | Say Goodbye And Hang Up | Medium 
4:03 PM - 4:30 PM | Take A Short Break | Low 
4:30 PM - 5:00 PM | Plan Out Next Day | Medium`
    const  [prompts, setPrompts] = useState([{body:str}])
    const [loading,setLoading] = useState(false)
    const getPrompts = async ()=>{
        let tempPromps = await (await fetch('https://jsonplaceholder.typicode.com/posts')).json()
        setPrompts([tempPromps[0],...prompts])
    }
    const [input,setInput] = useState('')
    const handleSend = ()=>{
        getPrompts()
        setInput('')
        postPrompt({body:input})
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
                    prompts.map((prompt)=>{
                        return <Card key={prompt.id} data={prompt.body}></Card>
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
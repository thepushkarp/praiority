import React from 'react'

import "./styles.css"

const quotes = [
  "The shortest war in history was between Britain and Zanzibar in 1896, which lasted only 38 minutes.",
  "The world's oldest piece of chewing gum is over 9,000 years old.",
  "The tallest building in the world, the Burj Khalifa in Dubai, is so tall that people on the top floor can see the sunset twice in one day.",
  "The longest word in the English language, according to the Oxford English Dictionary, is \"pneumonoultramicroscopicsilicovolcanoconiosis,\" which is a type of lung disease caused by inhaling fine silica dust.",
  "The longest wedding veil ever worn was over 6,000 feet long.",
  "The first recorded use of the word \"cool\" to mean fashionable or impressive was in a Lester Young jazz saxophone solo in 1940.",
  "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
  "The world's largest snowflake on record measured 15 inches wide and 8 inches thick.",
  "The shortest war in American history was between the US and the Kingdom of Tripoli in 1805, which lasted only 4 hours.",
  "The shortest complete sentence in the English language is \"I am.\"",
  "The longest English word that can be typed using only the left hand is \"stewardesses.\"",
  "A group of flamingos is called a flamboyance.",
  "The world's largest art museum, the Louvre in Paris, contains over 380,000 objects and displays only about 35,000 at a time.",
  "The world's largest producer of tires is LEGO.",
  "The only letter that doesn't appear in any U.S. state name is Q."
]

function Home() {

  const gotoPromts = () => {
    window.location.href = '/panchayat'
  }

  const gotoLogin = () => {
    window.location.href = '/login'
  }

  let token = localStorage.getItem('token')
  if(!token){
    gotoLogin()
  }

  return (
    <div className='homepage-container'>
        <div className='homepage-content'>
          <div className='logo-container' >
            <img src='/images/logo.jpeg' alt='logo'></img>
          </div>  
          
          <div className='homepage-text'>
          <button onClick={gotoPromts} className="chat-btn">
            Go to Chat
          </button>
            <h1>{"Did you know ?"}</h1>
          <h2>{quotes[Math.floor(Math.random()*15)]}</h2>
          </div>
        </div>
    </div>
  )
}

export default Home
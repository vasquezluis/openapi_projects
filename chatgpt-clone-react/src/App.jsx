import { useState, useEffect } from 'react'

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChat, setPreviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue('')
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch('http://localhost:3000/completions', options)
      const data = await response.json()

      setMessage(data?.choices[0].message)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChat(prevChats => (
        [...prevChats,
          { title: currentTitle, role: 'user', content: value },
          { title: currentTitle, role: message.role, content: message.content }
        ]
      ))
    }
  }, [message, currentTitle])

  const currentChat = previousChat.filter((previousChat) => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChat.map(previousChat => previousChat.title)))

  return (
    <div className='app'>
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Luis</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>LuisGPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <dir className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)} type='text' placeholder='Who is your creator?' />
            <div id='submit' onClick={getMessages}> ▶ </div>
          </div>
          <p className='info'>Esto es un clone de chatGPT, no es oficial, primer aviso!</p>
        </dir>
      </section>
    </div>
  )
}

export default App

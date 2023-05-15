import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

const PORT = 3000

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config()
const API_KEY = process.env.API_KEY

app.post('/completions', async (req, res) => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: req.body.message }],
      max_tokens: 100
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const data = await response.json()

    res.send(data)
  } catch (error) {
    console.log(error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

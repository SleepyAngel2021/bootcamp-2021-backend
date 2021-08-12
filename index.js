//const http = require('http') //Common JS
//import { createServer } from 'http' //Etma Scripts Modules -> NEW

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./middleware/logger')
const unknownEndpoint = require('./middleware/unknownEndpoint')

app.use(cors())
app.use(express.json()) //Para que utilice el parser que es un middleware

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'HTML is easy, yessss',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
    category: ['sports', 'Common'],
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Conte-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (req, res) => {
  res.end('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res, next) => {
  res.status(200).json(notes).end()
})

app.get('/api/notes/:id', (req, res) => {
  console.log(9)
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res
      .status(400)
      .json({
        error: 'note.content is missing',
      })
      .end()
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`You can watch your server in http://localhost:${PORT}`)
}) //Con express es async por eso usamos un callback para los console logs

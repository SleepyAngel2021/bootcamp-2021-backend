const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

const initialNotes = [
  {
    content: 'The TypeScript is better than JavaScript',
    important: true,
    date: new Date(),
  },
  {
    content: 'The second note for testing',
    important: false,
    date: new Date(),
  },
]

const noteExample = {
  content: 'note updated',
  important: true,
}

const noteWrong = {
  important: true,
}

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response,
  }
}

const deleteNoteByIdFromNotes = async id => {
  await api.delete(`/api/notes/${id}`)
}

const getNoteByIdFromNotes = async id => {
  const response = await api.get(`/api/notes/${id}`)
  return {
    response,
  }
}

module.exports = {
  api,
  initialNotes,
  noteExample,
  noteWrong,
  getAllContentFromNotes,
  deleteNoteByIdFromNotes,
  getNoteByIdFromNotes,
}

const { server } = require('../index')
const { disconnect } = require('../mongo')
const Note = require('../models/Note')
const {
  api,
  initialNotes,
  noteExample,
  noteWrong,
  getAllContentFromNotes,
  deleteNoteByIdFromNotes,
  getNoteByIdFromNotes,
} = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  //sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('Get all notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect('Content-Type', /application\/json/)
      .expect(200)
  })

  test('there are two note', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('some note is about TypeScript superirity', async () => {
    const { contents } = await getAllContentFromNotes()
    expect(contents).toContain('The TypeScript is better than JavaScript')
  })
})

describe('GET single note', () => {
  test('found with a valid id', async () => {
    const { response } = await getAllContentFromNotes()
    const idToSearch = response.body[0].id

    await api
      .get(`/api/notes/${idToSearch}`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
  })

  test('bad request with a invalid id', async () => {
    const idToSearch = 321321

    await api.get(`/api/notes/${idToSearch}`).expect(400)
  })

  test('not found if removed previously', async () => {
    const { response } = await getAllContentFromNotes()
    const id = response.body[0].id
    await deleteNoteByIdFromNotes(id)

    await api.get(`/api/notes/${id}`).expect(404)
  })
})

describe('create a note', () => {
  test('is possible with a valid note', async () => {
    await api
      .post('/api/notes')
      .send(noteExample)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()
    expect(contents).toContain(noteExample.content)
    expect(response.body).toHaveLength(initialNotes.length + 1)
  })

  test('is not possible with an invalid note', async () => {
    await api.post('/api/notes').send(noteWrong).expect(400)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE /api/notes', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const { contents, response: secondResponse } =
      await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api.delete(`/api/notes/1234`).expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('UPDATE /api/notes', () => {
  test('with a valid id', async () => {
    const { response } = await getAllContentFromNotes()
    const id = response.body[0].id

    await api
      .put(`/api/notes/${id}`)
      .send(noteExample)
      .expect('Content-Type', /application\/json/)
      .expect(200)

    const { response: resById } = await getNoteByIdFromNotes(id)
    expect(resById.body.content).toBe(noteExample.content)
  })

  test('with a invalid id', async () => {
    const id = '0932506365gdesgmo43'

    await api
      .put(`/api/notes/${id}`)
      .send(noteExample)
      .expect('Content-Type', /application\/json/)
      .expect(400)
  })

  test('can not update a note without content', async () => {
    const { response } = await getAllContentFromNotes()
    const id = response.body[0].id

    await api
      .put(`/api/notes/${id}`)
      .send(noteWrong)
      .expect('Content-Type', /application\/json/)
      .expect(400)
  })
})

afterAll(() => {
  disconnect()
  server.close()
})

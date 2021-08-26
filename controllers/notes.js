const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../utils/userExtractor')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  res.json(notes).status(200).end()
})

notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const note = await Note.findById(id)
    if (note) res.json(note).status(200).end()
    res.status(404).end()
  } catch (err) {
    next(err)
  }
})

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params

  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false, category } = req.body

  const { userId } = req
  const user = await User.findById(userId)

  if (!content) {
    return res
      .status(400)
      .json({
        error: 'note.content is missing',
      })
      .end()
  }

  const newNote = new Note({
    content,
    important,
    category,
    date: new Date().toISOString(),
    user: user._id,
  })

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  if (!note || !note.content) {
    return res
      .status(400)
      .json({
        error: 'note.content is missing',
      })
      .end()
  }

  const newNoteInfo = {
    content: note.content,
    important: note.important,
    category: note.category,
    date: new Date(),
  }

  try {
    const noteFinded = await Note.findByIdAndUpdate(
      id,
      newNoteInfo,
      { new: true },
      (err, model) => {
        if (!model) {
          next(err)
        } else {
          return model
        }
      }
    )
    if (noteFinded) res.json(noteFinded).status(200).end()
    res.status(404).end()
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter

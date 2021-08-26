const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
    important: 1,
    category: 1,
  })
  res.status(200).json(users).end()
})

usersRouter.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body

    if (password === undefined) {
      return res.status(400).json({ error: 'The password is required' }).end()
    } else if (password.length < 3) {
      return res
        .status(400)
        .json({ error: 'The password requires min length of 3 chars' })
        .end()
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser).end()
  } catch (error) {
    res.status(400).json({ error }).end()
  }
})

usersRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    await User.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter

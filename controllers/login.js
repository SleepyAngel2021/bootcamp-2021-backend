const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const loginRoutes = require('express').Router()

loginRoutes.post('/', async (req, res, next) => {
  const { body } = req
  const { username, password } = body
  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid user or password',
    })
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  })

  res.status(200).send({
    name: user.name,
    username: user.username,
    token,
  })
})

module.exports = loginRoutes

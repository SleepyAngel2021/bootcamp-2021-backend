const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')

const getUsers = async () => {
  const usersDB = await User.find({})
  const users = usersDB.map(user => user.toJSON())

  return users
}

module.exports = {
  api,
  getUsers,
}

const { server } = require('../index')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { disconnect } = require('../mongo')
const { api, getUsers } = require('./userHelpers')

beforeEach(async () => {
  await User.deleteMany({})

  // for(const user in usersList) {
  //   const userObject = new User(user)
  //   await userObject.save()
  // }

  const passwordHash = await bcrypt.hash('polipass', 10)
  const user = new User({
    username: 'joseproot',
    passwordHash,
  })

  await user.save()
})

describe('creating a new user', () => {
  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'josepbc',
      name: 'Josep',
      password: 'grenter',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'joseproot',
      name: 'Josep',
      password: 'test123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain(
      '`username` to be unique'
    )

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is not passed', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      name: 'Josep',
      password: 'test123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain(
      'Path `username` is required.'
    )

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if username dont has the min length chars', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'jo',
      name: 'Josep',
      password: 'test123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain(
      'Path `username` (`jo`) is shorter than the minimum allowed length (3).'
    )

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is not passed', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'josep',
      name: 'Josep',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('The password is required')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if password dont has the min length chars', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'josep',
      name: 'Josep',
      password: '12',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      'The password requires min length of 3 chars'
    )

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  disconnect()
  server.close()
})

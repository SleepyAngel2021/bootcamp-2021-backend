const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = config

const getUri = async () => {
  return NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI
}

module.exports = {
  connect: async () => {
    const connectionString = await getUri()
    await mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        logger.info('Database connected')
      })
      .catch(err => {
        logger.error(err)
        mongoose.disconnect()
      })
  },
  disconnect: async () => {
    await mongoose.connection.close()
  },
}

process.on('uncaughtException', err => {
  logger.error(err)
  mongoose.disconnect()
})

require('dotenv').config()

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV, PORT } = process.env

module.exports = { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV, PORT }

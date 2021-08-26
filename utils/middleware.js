const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  //logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({ error: 'malformatted id' }),

  'response is not defined': res =>
    res.status(405).send({ error: 'response is not defined' }),

  JsonWebTokenError: res =>
    res.status(401).json({ error: 'token missing or invalid' }),

  TokenExpiredError: res => res.status(401).json({ error: 'token expired' }),

  defaultError: res => res.status(500).end(),
}

const errorHandler = (error, req, res, next) => {
  console.error(error)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(res)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}

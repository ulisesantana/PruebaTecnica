const loggingMiddleware = require('./loggingMiddleware')

const applyMiddlwares = (server, app) => {
  server.use(loggingMiddleware(app.services.loggingService))
  return server
}

module.exports = applyMiddlwares

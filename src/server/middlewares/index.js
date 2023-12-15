const loggingMiddleware = require('./loggingMiddleware')

const applyMiddlwares = (server, app) => {
  server.use(loggingMiddleware(app.services.loggingService, console))
  return server
}

module.exports = applyMiddlwares

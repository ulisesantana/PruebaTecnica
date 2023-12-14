/**
 * @param {LoggingService} loggingService
 */
const loggingMiddleware = (loggingService) =>
  (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
    const header = JSON.stringify(req.headers)
    const action = req.originalUrl
    loggingService.create({ ip, header, action })
      .catch(error => {
        console.error(`Error logging "${action}": ${error}`)
      })
      .finally(() => { next() })
  }

module.exports = loggingMiddleware

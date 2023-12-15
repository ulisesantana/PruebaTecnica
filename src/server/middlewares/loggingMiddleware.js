/**
 * @param {LoggingService} loggingService
 * @param {Console} logger
 */
const loggingMiddleware = (loggingService, logger = console) =>
  (req, res, next) => {
    const ip = (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress || '').split(',')[0].trim()
    const header = JSON.stringify(req.headers)
    const action = req.originalUrl
    return loggingService.create({ ip, header, action })
      .catch(error => {
        logger.error(`Error logging "${action}": ${error}`)
      })
      .finally(() => { next() })
  }

module.exports = loggingMiddleware

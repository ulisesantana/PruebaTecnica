/**
 * @param {LoggingService} loggingService
 * @param {Console} logger
 */
const loggingMiddleware = (loggingService, logger = console) =>
  (req, res, next) => {
    const action = req.originalUrl
    return loggingService.create({
      ip: (req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress || '').split(',')[0].trim(),
      header: req.headers,
      action
    })
      .catch(error => {
        logger.error(`Error logging "${action}": ${error}`)
      })
      .finally(() => {
        next()
      })
  }

module.exports = loggingMiddleware

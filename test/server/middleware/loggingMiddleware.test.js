const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const loggingMiddleware = require('../../../src/server/middlewares/loggingMiddleware')
describe('Logging middleware should', () => {
  const req = {
    originalUrl: 'http://meh.com',
    headers: {
      'x-forwarded-for': '255.255.255.255',
      irrelevant: 42
    }
  }
  const res = {}
  let next, logger

  beforeEach(() => {
    next = mock.fn()
    logger = {
      error: mock.fn()
    }
  })

  it('create logs with ip, headers and requested url', async () => {
    const service = {
      create: mock.fn(async () => {
      })
    }
    const middelware = loggingMiddleware(service, logger)

    await middelware(req, res, next)

    assert.deepEqual(service.create.mock.calls[0].arguments, [{
      ip: '255.255.255.255',
      header: JSON.stringify(req.headers),
      action: req.originalUrl
    }])

    assert.equal(next.mock.callCount(), 1)
  })

  it('create logs getting ip from connection if it is present in the headers', async () => {
    const req = {
      headers: { irrelevant: 42 },
      connection: { remoteAddress: '0.0.0.0' }
    }
    const service = {
      create: mock.fn(async () => {
      })
    }
    const middelware = loggingMiddleware(service, logger)

    await middelware(req, res, next)

    assert.equal(next.mock.callCount(), 1)
    assert.deepEqual(service.create.mock.calls[0].arguments, [{
      ip: req.connection.remoteAddress,
      header: JSON.stringify(req.headers),
      action: req.originalUrl
    }])
  })

  it('call next even if record creation fails', async () => {
    const error = new Error('Boom!!')
    const req = { headers: { irrelevant: 42 }, originalUrl: 'https://meh.com' }
    const service = {
      create: mock.fn(async () => {
        throw error
      })
    }
    const middelware = loggingMiddleware(service, logger)

    await middelware(req, res, next)

    assert.deepEqual(logger.error.mock.calls[0].arguments, [`Error logging "${req.originalUrl}": ${error}`])
    assert.equal(next.mock.callCount(), 1)
  })
})

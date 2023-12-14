const {
  describe,
  it,
  mock
} = require('node:test')
const assert = require('node:assert')
const { LoggingService } = require('../../../src/app/Logging')
describe('Logging service should', () => {
  it('create logs', async () => {
    const id = Math.floor(Math.random() * 10 ** 16)
    const log = {
      action: 'https://irrelevant.url',
      header: '{"Content-Type": "application/json"}',
      ip: '255.255.255.255'
    }
    const db = { logging: { create: mock.fn(async log => ({ ...log, id })) } }
    const service = new LoggingService(db)

    const createdLog = await service.create(log)

    assert.deepEqual(createdLog, { ...log, id })
    assert.equal(db.logging.create.mock.callCount(), 1)
    assert.deepEqual(db.logging.create.mock.calls[0].arguments, [log])
  })

  it('get all logs paginating them', async () => {
    const db = { logging: { findAndCountAll: mock.fn(async () => ({ count: 100, rows: [] })) } }
    const service = new LoggingService(db)

    const logs = await service.getAll()

    assert.deepEqual(logs, {
      data: [],
      pageCount: 10,
      currentPage: 1,
      pageSize: 10
    })
    assert.equal(db.logging.findAndCountAll.mock.callCount(), 1)
  })
})

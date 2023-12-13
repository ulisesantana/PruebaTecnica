const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const { Planet } = require('../../../src/app/Planet')
const { tatooine } = require('../../fixtures/planets')
describe('Planet should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => tatooine) }
  })

  it('be inited asynchronously', async () => {
    const { id } = tatooine
    const person = new Planet(id, service)

    await person.init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id])
    assert.equal(person.getId(), id)
    assert.equal(person.getName(), tatooine.name)
    assert.equal(person.getGravity(), tatooine.gravity)
    assert.equal(person.isMissing(), false)
  })

  it('set as missing if there is no planet for the given id', async () => {
    const service = { getById: mock.fn(() => null) }
    const person = await new Planet(tatooine.id, service).init()

    assert.equal(person.isMissing(), true)
  })

  it('return raw value', async () => {
    const { id, ...raw } = tatooine
    const person = await new Planet(id, service).init()

    assert.deepEqual(person.toRaw(), raw)
  })
})

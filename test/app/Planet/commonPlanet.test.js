const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const { CommonPlanet } = require('../../../src/app/Planet')
const { tatooine } = require('../../fixtures/planets')
describe('CommonPlanet should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => tatooine) }
  })

  it('be inited asynchronously', async () => {
    const { id } = tatooine
    const planet = new CommonPlanet(id, service)

    await planet.init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id])
    assert.equal(planet.getId(), id)
    assert.equal(planet.getName(), tatooine.name)
    assert.equal(planet.getGravity(), tatooine.gravity)
    assert.equal(planet.isMissing(), false)
  })

  it('set as missing if there is no planet for the given id', async () => {
    const service = { getById: mock.fn(() => null) }
    const planet = await new CommonPlanet(tatooine.id, service).init()

    assert.equal(planet.isMissing(), true)
  })

  it('return raw value', async () => {
    const { id, ...raw } = tatooine
    const planet = await new CommonPlanet(id, service).init()

    assert.deepEqual(planet.toRaw(), raw)
  })
})

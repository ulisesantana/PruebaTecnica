const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const { WookieePlanet } = require('../../../src/app/Planet')
const { wookieene } = require('../../fixtures/planets')
describe('Wookiee Planet should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => wookieene) }
  })

  it('be inited asynchronously', async () => {
    const { id } = wookieene
    const planet = new WookieePlanet(id, service)

    await planet.init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id, { wookiee: true }])
    assert.equal(planet.getId(), id)
    assert.equal(planet.getName(), wookieene.whrascwo)
    assert.equal(planet.getGravity(), wookieene.rrrcrahoahaoro)
    assert.equal(planet.isMissing(), false)
  })

  it('set as missing if there is no planet for the given id', async () => {
    const service = { getById: mock.fn(() => null) }
    const planet = await new WookieePlanet(wookieene.id, service).init()

    assert.equal(planet.isMissing(), true)
  })

  it('return raw value', async () => {
    const planet = await new WookieePlanet(wookieene.id, service).init()

    assert.deepEqual(planet.toRaw(), {
      name: wookieene.whrascwo,
      gravity: wookieene.rrrcrahoahaoro
    })
  })
})

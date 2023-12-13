const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const { PlanetService } = require('../../../src/app/Planet')
const { tatooine } = require('../../fixtures/planets')
describe('Planet service should', () => {
  const rawApiPlanet = {
    url: 'https://swapi.dev/api/planets/1/',
    name: tatooine.name,
    gravity: '1 standard'
  }
  let db
  let swapi

  describe('get planets by id', () => {
    beforeEach(() => {
      db = {
        swPlanet: { findByPk: mock.fn(async () => tatooine) }
      }
      swapi = {
        getPlanetById: mock.fn(async () => rawApiPlanet)
      }
    })

    it('returning the correct planet for the given id from database', async () => {
      const {
        id,
        ...raw
      } = tatooine
      const service = new PlanetService(db, swapi)

      const planet = await service.getById(id)

      assert.deepEqual(planet, { name: raw.name, gravity: 1 })
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 0)
    })

    it('returning the correct planet for the given id from SWAPI as fallback from database', async () => {
      const {
        id,
        ...raw
      } = tatooine
      db.swPlanet.findByPk = mock.fn(async () => null)
      const service = new PlanetService(db, swapi)

      const planet = await service.getById(id)

      assert.deepEqual(planet, { name: raw.name, gravity: 1 })
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })

    it('returning null if no planet is found for the given id', async () => {
      const { id } = tatooine
      db.swPlanet.findByPk = mock.fn(async () => null)
      swapi.getPlanetById = mock.fn(async () => null)
      const service = new PlanetService(db, swapi)

      const planet = await service.getById(id)

      assert.equal(planet, null)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })
  })

  describe('get planets by id with wookiee format', () => {
    const rawApiWookiePlanet = {
      rrrcrahoahaoro: '1 caorawhwararcwa',
      hurcan: 'acaoaoakc://cohraakah.wawoho/raakah/akanrawhwoaoc/1/',
      whrascwo: 'Traaoooooahwhwo'
    }
    beforeEach(() => {
      db = {
        swPlanet: { findByPk: mock.fn(async () => null) }
      }
      swapi = {
        getPlanetById: mock.fn(async () => rawApiWookiePlanet)
      }
    })

    it('returning the correct planet for the given id fetching all info to SWAPI in wookiee format', async () => {
      const {
        id,
        ...raw
      } = rawApiWookiePlanet
      const service = new PlanetService(db, swapi)

      const planet = await service.getById(id, { wookiee: true })

      assert.deepEqual(planet, {
        rrrcrahoahaoro: 1,
        whrascwo: raw.whrascwo
      })
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })

    it('returning null if no planet is found for the given id', async () => {
      const { id } = rawApiWookiePlanet
      swapi.getPlanetById = mock.fn(async () => null)
      const service = new PlanetService(db, swapi)

      const planet = await service.getById(id, { wookiee: true })

      assert.equal(planet, null)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })
  })
})

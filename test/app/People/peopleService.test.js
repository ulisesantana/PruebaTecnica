const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const { PeopleService } = require('../../../src/app/People')
const {
  lukeSkywalker,
  wookieeSkywalker
} = require('../../fixtures/people')
const { tatooine } = require('../../fixtures/planets')
const {
  rawApiPerson,
  rawApiPlanet,
  rawApiWookiePerson,
  rawApiWookiePlanet
} = require('../../fixtures/raw')
describe('People service should', () => {
  let db
  let swapi

  describe('get people by id', () => {
    beforeEach(() => {
      db = {
        swPeople: { findByPk: mock.fn(async () => lukeSkywalker) },
        swPlanet: { findByPk: mock.fn(async () => tatooine) }
      }
      swapi = {
        getPersonById: mock.fn(async () => rawApiPerson),
        getPlanetById: mock.fn(async () => rawApiPlanet)
      }
    })

    it('returning the correct person for the given id from database', async () => {
      const { id, ...raw } = lukeSkywalker
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id)

      assert.deepEqual(person, raw)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 1)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPersonById.mock.callCount(), 0)
      assert.equal(swapi.getPlanetById.mock.callCount(), 0)
    })

    it('returning the correct person for the given id from SWAPI, but fetching planet from database', async () => {
      const { id, ...raw } = lukeSkywalker
      db.swPeople.findByPk = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id)

      assert.deepEqual(person, raw)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 1)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 0)
    })

    it('returning the correct person for the given id from SWAPI and also fetching planet from SWAPI because none of them was on database', async () => {
      const { id, ...raw } = lukeSkywalker
      db.swPeople.findByPk = mock.fn(async () => null)
      db.swPlanet.findByPk = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id)

      assert.deepEqual(person, raw)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 1)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })

    it('returning null if no person is found for the given id', async () => {
      const { id } = lukeSkywalker
      db.swPeople.findByPk = mock.fn(async () => null)
      db.swPlanet.findByPk = mock.fn(async () => null)
      swapi.getPersonById = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id)

      assert.equal(person, null)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 1)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 0)
    })

    it('returning null if a person is found for the given id, but it\'s planet id not', async () => {
      const { id } = lukeSkywalker
      db.swPeople.findByPk = mock.fn(async () => null)
      db.swPlanet.findByPk = mock.fn(async () => null)
      swapi.getPlanetById = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id)

      assert.equal(person, null)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 1)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 1)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })
  })

  describe('get people by id with wookiee format', () => {
    beforeEach(() => {
      db = {
        swPeople: { findByPk: mock.fn(async () => null) },
        swPlanet: { findByPk: mock.fn(async () => null) }
      }
      swapi = {
        getPersonById: mock.fn(async () => rawApiWookiePerson),
        getPlanetById: mock.fn(async () => rawApiWookiePlanet)
      }
    })

    it('returning the correct person for the given id fetching all info to SWAPI in wookiee format', async () => {
      const { id, ...raw } = wookieeSkywalker
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id, { wookiee: true })

      assert.deepEqual(person, raw)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 0)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })

    it('returning null if no person is found for the given id', async () => {
      const { id } = wookieeSkywalker
      swapi.getPersonById = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id, { wookiee: true })

      assert.equal(person, null)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 0)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 0)
    })

    it('returning null if a person is found for the given id, but it\'s planet id not', async () => {
      const { id } = wookieeSkywalker
      swapi.getPlanetById = mock.fn(async () => null)
      const service = new PeopleService(db, swapi)

      const person = await service.getById(id, { wookiee: true })

      assert.equal(person, null)
      assert.equal(db.swPeople.findByPk.mock.callCount(), 0)
      assert.equal(db.swPlanet.findByPk.mock.callCount(), 0)
      assert.equal(swapi.getPersonById.mock.callCount(), 1)
      assert.equal(swapi.getPlanetById.mock.callCount(), 1)
    })
  })

  describe('calc weight on random planet', () => {
    const minId = 1
    const maxId = 50

    it('successfully', async () => {
      const randomPlanet = { name: 'Mars', gravity: 0.3 }
      db.swPeople.findByPk = mock.fn(async () => lukeSkywalker)
      db.swPlanet.findByPk = mock.fn(async () => randomPlanet)
      const service = new PeopleService(db, swapi)

      const { person, planet, weight } = await service.getWeightOnPlanetRandom()

      const [personId] = db.swPeople.findByPk.mock.calls[0].arguments
      assert.equal(personId >= minId, true)
      assert.equal(personId <= maxId, true)
      assert.equal(String(personId).split('.').length === 1, true)
      const [planetId] = db.swPlanet.findByPk.mock.calls[0].arguments
      assert.equal(planetId >= minId, true)
      assert.equal(planetId <= maxId, true)
      assert.equal(String(planetId).split('.').length === 1, true)
      assert.equal(weight, lukeSkywalker.mass * planet.gravity)
      assert.equal(person.name, lukeSkywalker.name)
      assert.equal(person.mass, lukeSkywalker.mass)
      assert.equal(planet.name, randomPlanet.name)
      assert.equal(planet.gravity, randomPlanet.gravity)
    })

    it('throwing an error if the planet is the person home planet', async () => {
      db.swPeople.findByPk = mock.fn(async () => lukeSkywalker)
      db.swPlanet.findByPk = mock.fn(async () => tatooine)
      const service = new PeopleService(db, swapi)

      try {
        await service.getWeightOnPlanetRandom()
        throw new Error('should throw an error on service.getWeightOnPlanet')
      } catch (error) {
        assert.strictEqual(error.message, 'Not allowed to calculate weight on person\'s home planet.')
      }
    })
  })
})

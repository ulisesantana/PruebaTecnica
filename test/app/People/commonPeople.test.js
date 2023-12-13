const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('assert')
const { CommonPeople } = require('../../../src/app/People/commonPeople')
const { lukeSkywalker } = require('../../fixtures/people.lukeSkywalker')
describe('Common People should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => lukeSkywalker) }
  })

  it('be inited asynchronously', async () => {
    const { id } = lukeSkywalker
    const person = new CommonPeople(id, service)

    await person.init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id])
    assert.equal(person.getId(), id)
    assert.equal(person.getName(), lukeSkywalker.name)
    assert.equal(person.getHeight(), lukeSkywalker.height)
    assert.equal(person.getMass(), lukeSkywalker.mass)
    assert.equal(person.getHomeworldName(), lukeSkywalker.homeworld_name)
    assert.equal(person.getHomeworldId(), lukeSkywalker.homeworld_id)
    assert.equal(person.isMissing(), false)
  })

  it('set as missing if there is no person for the given id', async () => {
    const service = { getById: mock.fn(() => null) }
    const person = await new CommonPeople(lukeSkywalker.id, service).init()

    assert.equal(person.isMissing(), true)
  })

  describe('return weight on a given planet', () => {
    it('successfully', async () => {
      const planet = {
        getName: () => 'irrelevant-planet-name',
        getGravity: () => 2
      }
      const expectedWeight = lukeSkywalker.mass * planet.getGravity()
      const person = await new CommonPeople(lukeSkywalker.id, service).init()

      assert.equal(person.getWeightOnPlanet(planet), expectedWeight)
    })

    it('throw an error if given planet is person\'s home planet', async () => {
      const planet = {
        getName: () => lukeSkywalker.homeworld_name
      }
      const person = await new CommonPeople(lukeSkywalker.id, service).init()

      try {
        person.getWeightOnPlanet(planet)
        throw new Error('should throw an error on person.getWeightOnPlanet')
      } catch (error) {
        assert.strictEqual(error.message, 'Not allowed to calculate weight on person\'s home planet.')
      }
    })
  })

  it('return raw value', async () => {
    const person = await new CommonPeople(lukeSkywalker.id, service).init()

    assert.deepEqual(person.toRaw(), lukeSkywalker)
  })
})

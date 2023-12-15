const {
  describe,
  it,
  mock
} = require('node:test')
const assert = require('node:assert')
const { StarWarsApi } = require('../../src/app/starWarsApi')
const { tatooine } = require('../fixtures/planets')
const { lukeSkywalker } = require('../fixtures/people')
describe('Star Wars API should', () => {
  it('fetch planets by id', async () => {
    const request = mock.fn(async () => tatooine)
    const api = new StarWarsApi(request)

    const planet = await api.getPlanetById(42)

    assert.deepEqual(planet, tatooine)
    assert.equal(request.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/planets/42' }])
  })

  it('fetch people by id', async () => {
    const request = mock.fn(async () => lukeSkywalker)
    const api = new StarWarsApi(request)

    const person = await api.getPersonById(42)

    assert.deepEqual(person, lukeSkywalker)
    assert.equal(request.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/people/42' }])
  })

  it('return null if request a person fails', async () => {
    const error = new Error('Boom!')
    const logger = { error: mock.fn() }
    const request = mock.fn(async () => { throw error })
    const api = new StarWarsApi(request, logger)

    const planet = await api.getPersonById(42)

    assert.deepEqual(planet, null)
    assert.equal(request.mock.callCount(), 1)
    assert.equal(logger.error.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/people/42' }])
    assert.deepEqual(logger.error.mock.calls[0].arguments, [error])
  })

  it('return null if request a planet fails', async () => {
    const request = mock.fn(async () => { throw new Error('Boom!') })
    const api = new StarWarsApi(request)

    const planet = await api.getPlanetById(42)

    assert.deepEqual(planet, null)
    assert.equal(request.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/planets/42' }])
  })

  it('fetch planets by id with wookiee format', async () => {
    const request = mock.fn(async () => tatooine)
    const api = new StarWarsApi(request)

    const planet = await api.getPlanetById(42, { wookiee: true })

    assert.deepEqual(planet, tatooine)
    assert.equal(request.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/planets/42', query: { format: 'wookiee' } }])
  })

  it('fetch people by id with wookiee format', async () => {
    const request = mock.fn(async () => lukeSkywalker)
    const api = new StarWarsApi(request)

    const person = await api.getPersonById(42, { wookiee: true })

    assert.deepEqual(person, lukeSkywalker)
    assert.equal(request.mock.callCount(), 1)
    assert.deepEqual(request.mock.calls[0].arguments, [{ url: 'https://swapi.dev/api/people/42', query: { format: 'wookiee' } }])
  })
})

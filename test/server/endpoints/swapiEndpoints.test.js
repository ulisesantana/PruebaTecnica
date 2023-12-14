const { describe, it, before } = require('node:test')
const assert = require('node:assert')
const request = require('supertest')
const { createExpressServer } = require('../../../src/server')
const app = require('../../../src/app')
const { lukeSkywalker } = require('../../fixtures/people')
const nock = require('nock')
const { StarWarsApi } = require('../../../src/app/starWarsApi')
const {
  rawApiPerson,
  rawApiWookiePerson,
  rawApiWookiePlanet,
  rawApiPlanet
} = require('../../fixtures/raw')
const { tatooine } = require('../../fixtures/planets')

describe('SWAPI endpoints under /hfswapi', () => {
  let application = null
  before(async () => {
    application = await createExpressServer(app)
  })
  it('/getLogs with only one result', async () => {
    const response = await request(application)
      .get('/hfswapi/getLogs')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.equal(Array.isArray(body), true)
    assert.equal(body.length, 1)
    body.forEach((log) => {
      assert.equal('id' in log, true)
      assert.equal('action' in log, true)
      assert.equal('header' in log, true)
      assert.equal('ip' in log, true)
      assert.equal('createdAt' in log, true)
      assert.equal('updatedAt' in log, true)
    })
  })

  it('/getLogs with multiple results', async () => {
    const response = await request(application)
      .get('/hfswapi/getLogs')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.equal(Array.isArray(body), true)
    assert.equal(body.length, 2)
    body.forEach((log) => {
      assert.equal('id' in log, true)
      assert.equal('action' in log, true)
      assert.equal('header' in log, true)
      assert.equal('ip' in log, true)
      assert.equal('createdAt' in log, true)
      assert.equal('updatedAt' in log, true)
    })
  })

  it('/getPeople/:id from database', async () => {
    const { id, ...expectedPerson } = lukeSkywalker

    const response = await request(application)
      .get(`/hfswapi/getPeople/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, expectedPerson)
  })

  it('/getPeople/:id from SWAPI', async () => {
    const { id, ...expectedPerson } = lukeSkywalker
    nock(StarWarsApi.baseUrl)
      .get(`/people/${id + 1}`)
      .reply(200, rawApiPerson)

    const response = await request(application)
      .get(`/hfswapi/getPeople/${id + 1}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, expectedPerson)
  })

  it('/getPeople/:id not found', async () => {
    const id = 999999
    nock(StarWarsApi.baseUrl)
      .get(`/people/${id}`)
      .reply(404, { detail: 'Not found' })

    const response = await request(application)
      .get(`/hfswapi/getPeople/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 404)
    assert.deepEqual(body, { status: 404, error: `Resource with id ${id} not found` })
  })

  it('/getPeople/:id return 400 if id is not numeric', async () => {
    const id = 'meh'

    const response = await request(application)
      .get(`/hfswapi/getPeople/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 400)
    assert.deepEqual(body, { status: 400, error: `Id expected to be a number. Received: ${id}` })
  })

  it('/getPeople/:id from SWAPI with wookiee format', async () => {
    nock(StarWarsApi.baseUrl)
      .get('/people/42')
      .query({ format: 'wookiee' })
      .reply(200, rawApiWookiePerson)
    nock(StarWarsApi.baseUrl)
      .get('/planets/1')
      .query({ format: 'wookiee' })
      .reply(200, rawApiWookiePlanet)

    const response = await request(application)
      .get('/hfswapi/getPeople/42?format=wookiee')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, {
      height: 172,
      homeworld_id: '/akanrawhwoaoc/1',
      homeworld_name: 'Traaoooooahwhwo',
      mass: 77,
      name: 'Lhuorwo Sorroohraanorworc'
    })
  })

  it('/getPlanet/:id from database', async () => {
    const { id, ...expectedPlanet } = tatooine

    const response = await request(application)
      .get(`/hfswapi/getPlanet/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, expectedPlanet)
  })

  it('/getPlanet/:id from SWAPI', async () => {
    const { id, ...expectedPlanet } = tatooine
    nock(StarWarsApi.baseUrl)
      .get(`/planets/${id + 1}`)
      .reply(200, rawApiPlanet)

    const response = await request(application)
      .get(`/hfswapi/getPlanet/${id + 1}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, expectedPlanet)
  })

  it('/getPlanet/:id not found', async () => {
    const id = 999999
    nock(StarWarsApi.baseUrl)
      .get(`/planets/${id}`)
      .reply(404, { detail: 'Not found' })

    const response = await request(application)
      .get(`/hfswapi/getPlanet/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 404)
    assert.deepEqual(body, { status: 404, error: `Resource with id ${id} not found` })
  })

  it('/getPlanet/:id return 400 if id is not numeric', async () => {
    const id = 'meh'

    const response = await request(application)
      .get(`/hfswapi/getPlanet/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 400)
    assert.deepEqual(body, { status: 400, error: `Id expected to be a number. Received: ${id}` })
  })

  it('/getPlanet/:id from SWAPI with wookiee format', async () => {
    nock(StarWarsApi.baseUrl)
      .get('/planets/42')
      .query({ format: 'wookiee' })
      .reply(200, rawApiWookiePlanet)

    const response = await request(application)
      .get('/hfswapi/getPlanet/42?format=wookiee')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { statusCode, body } = response
    assert.equal(statusCode, 200)
    assert.deepEqual(body, {
      gravity: 1,
      name: 'Traaoooooahwhwo'
    })
  })

  it('/getWeightOnPlanetRandom return person, planet and weight', async () => {
    const randomPlanet = { name: 'Mars', gravity: '0.3 standard', url: 'irrelevant/3/' }
    nock(StarWarsApi.baseUrl)
      .get(/\/people\/.*/)
      .reply(200, rawApiPerson)
    nock(StarWarsApi.baseUrl)
      .get(/\/planets\/.*/)
      .reply(200, randomPlanet)

    const response = await request(application)
      .get('/hfswapi/getWeightOnPlanetRandom')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { body, statusCode } = response
    assert.equal(statusCode, 200)
    assert.equal('person' in body, true)
    assert.equal(body.person.name, rawApiPerson.name)
    assert.equal('planet' in body, true)
    assert.equal(body.planet.name, randomPlanet.name)
    assert.equal('weight' in body, true)
    assert.equal(body.weight, rawApiPerson.mass * 0.3)
  })

  it('/getWeightOnPlanetRandom throw error if the planet is the person home planet', async () => {
    nock(StarWarsApi.baseUrl)
      .get(/\/people\/.*/)
      .reply(200, rawApiPerson)
    nock(StarWarsApi.baseUrl)
      .get(/\/planets\/.*/)
      .reply(200, rawApiPlanet)

    const response = await request(application)
      .get('/hfswapi/getWeightOnPlanetRandom')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')

    const { body, statusCode } = response
    assert.equal(statusCode, 500)
    assert.deepEqual(body, { status: 500, error: 'Not allowed to calculate weight on person\'s home planet.' })
  })
})

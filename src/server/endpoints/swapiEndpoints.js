const { peopleFactory } = require('../../app/People')
const { planetFactory } = require('../../app/Planet')
const _isWookieeFormat = (req) => {
  if (req.query.format && req.query.format === 'wookiee') {
    return true
  }
  return false
}
const _isValidId = id => /\d/.test(id)
const _getErrorBody = (status, error) => ({
  status,
  error: `${error.message || error}`
})
const _getNotFoundErrorBody = id => _getErrorBody(404, `Resource with id ${id} not found`)
const _getIdBadRequestErrorBody = id => _getErrorBody(400, `Id expected to be a number. Received: ${id}`)

const applySwapiEndpoints = (server, app) => {
  server.get('/hfswapi/test', async (req, res) => {
    const data = await app.swapiFunctions.genericRequest({
      url: 'https://swapi.dev/api/',
      logging: true
    })
    res.send(data)
  })

  server.get('/hfswapi/getPeople/:id', async (req, res, next) => {
    const { id } = req.params
    if (!_isValidId(id)) {
      return res.status(400).send(_getIdBadRequestErrorBody(id))
    }
    try {
      const person = await peopleFactory({
        id,
        lang: _isWookieeFormat(req) ? 'wookiee' : 'json',
        service: app.services.peopleService
      })
      if (person.isMissing()) {
        return res.status(404).send(_getNotFoundErrorBody(id))
      }
      return res.send(person.toRaw())
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: `${error.message || error}`
      })
    }
  })

  server.get('/hfswapi/getPlanet/:id', async (req, res) => {
    const { id } = req.params
    if (!_isValidId(id)) {
      return res.status(400).send(_getIdBadRequestErrorBody(id))
    }
    try {
      const planet = await planetFactory({
        id,
        lang: _isWookieeFormat(req) ? 'wookiee' : 'json',
        service: app.services.planetService
      })
      if (planet.isMissing()) {
        res.status(404).send(_getNotFoundErrorBody(id))
      } else {
        res.send(planet.toRaw())
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: `${error.message || error}`
      })
    }
  })

  server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
    try {
      const { planet, person, weight } = await app.services.peopleService.getWeightOnPlanetRandom()
      res.send({
        person: person.toRaw(),
        planet: planet.toRaw(),
        weight
      })
    } catch (error) {
      res.status(500).send({
        status: 500,
        error: `${error.message || error}`
      })
    }
  })

  server.get('/hfswapi/getLogs', async (req, res) => {
    const data = await app.db.logging.findAll()
    res.send(data)
  })
}

module.exports = applySwapiEndpoints

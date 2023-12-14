const { peopleFactory } = require('../../app/People')
const { planetFactory } = require('../../app/Planet')
const _isWookieeFormat = (req) => {
  if (req.query.format && req.query.format === 'wookiee') {
    return true
  }
  return false
}

const applySwapiEndpoints = (server, app) => {
  server.get('/hfswapi/test', async (req, res) => {
    const data = await app.swapiFunctions.genericRequest({
      url: 'https://swapi.dev/api/',
      logging: true
    })
    res.send(data)
  })

  server.get('/hfswapi/getPeople/:id', async (req, res) => {
    const { id } = req.params
    try {
      const person = await peopleFactory({
        id,
        lang: _isWookieeFormat(req) ? 'wookiee' : 'json',
        service: app.services.peopleService
      })
      if (person.isMissing()) {
        res.status(404).send({ status: 404, error: `Person with id ${id} not found` })
      } else {
        res.send(person.toRaw())
      }
    } catch (error) {
      res.status(500).send({ status: 500, error: `${error}` })
    }
  })

  server.get('/hfswapi/getPlanet/:id', async (req, res) => {
    const { id } = req.params
    try {
      const planet = await planetFactory({
        id,
        lang: _isWookieeFormat(req) ? 'wookiee' : 'json',
        service: app.services.planetService
      })
      if (planet.isMissing()) {
        res.status(404).send({ status: 404, error: `Planet with id ${id} not found` })
      } else {
        res.send(planet.toRaw())
      }
    } catch (error) {
      console.error('ERROR', error)
      res.status(500).send({ status: 500, error: `${error}` })
    }
  })

  server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
    res.sendStatus(501)
  })

  server.get('/hfswapi/getLogs', async (req, res) => {
    const data = await app.db.logging.findAll()
    res.send(data)
  })
}

module.exports = applySwapiEndpoints

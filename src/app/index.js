const db = require('./db')
const swapiFunctions = require('./swapiFunctions')
const { PeopleService } = require('./People')
const { StarWarsApi } = require('./starWarsApi')
const { PlanetService } = require('./Planet')
const { LoggingService } = require('./Logging')

const api = new StarWarsApi(swapiFunctions.genericRequest)

module.exports = {
  db,
  services: {
    loggingService: new LoggingService(db),
    peopleService: new PeopleService(db, api),
    planetService: new PlanetService(db, api)
  },
  swapiFunctions
}

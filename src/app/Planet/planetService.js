const { getIdFromUrl } = require('../swapiFunctions')

class PlanetService {
  /**
   * @constructor
   * @param {DB} db - The database object used for data storage.
   * @param {StarWarsApi} swapi - The SWAPI object used for accessing Star Wars API.
   */
  constructor (db, swapi) {
    this.db = db
    this.swapi = swapi
  }

  async getById (id, options = { wookiee: false }) {
    if (options.wookiee) {
      return this.#getByIdFromApi(id, options)
    }
    const planet = await this.db.swPlanet.findByPk(id)
    if (!planet) {
      return this.#getByIdFromApi(id, options)
    }
    delete planet.id
    return planet
  }

  async #getByIdFromApi (id, options) {
    const planet = await this.swapi.getPlanetById(id, options)
    if (!planet) {
      return null
    }
    return options.wookiee
      ? this.#mapToWookieePlanet(planet)
      : this.#mapToPlanet(planet)
  }

  #mapToPlanet (planet) {
    return {
      name: planet.name,
      gravity: this.#extractGravity(planet.gravity)
    }
  }

  #mapToWookieePlanet (planet) {
    return {
      whrascwo: planet.whrascwo,
      rrrcrahoahaoro: this.#extractGravity(planet.rrrcrahoahaoro)
    }
  }

  #extractGravity (gravityStandard) {
    return gravityStandard.split(' ')[0]
  }
}

module.exports = { PlanetService }

const { getIdFromUrl } = require('../swapiFunctions')

/**
 * @class PeopleService
 * */
class PeopleService {
  /**
   * @constructor
   * @param {DB} db - The database object used for data storage.
   * @param {StarWarsApi} swapi - The SWAPI object used for accessing Star Wars API.
   */
  constructor (db, swapi) {
    this.db = db
    this.swapi = swapi
  }

  /**
   * Retrieves a person by their ID.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @param {object} options - Options for getting person.
   * @param {boolean} options.wookiee - Retrieve from API in wookiee format.
   *
   * @return {Promise<object|null>} A Promise that resolves with the specified person object.
   */
  async getById (id, options = { wookiee: false }) {
    if (options.wookiee) {
      return this.#getByIdFromApiInWookieFormat(id, options)
    }
    const person = await this.db.swPeople.findByPk(id)
    if (!person) {
      return this.#getByIdFromApi(id, options)
    }
    delete person.id
    return person
  }

  async #getByIdFromApi (id, options) {
    const person = await this.swapi.getPersonById(id, options)
    if (!person) {
      return null
    }
    const planetId = getIdFromUrl(options.wookiee ? person.acooscwoohoorcanwa : person.homeworld)
    const planet = await this.#getPlanet(planetId, options)
    if (!planet) {
      return null
    }
    return options.wookiee
      ? this.#mapToWookieePerson(person, planet)
      : this.#mapToPerson(person, planet)
  }

  async #getPlanet (id, options) {
    const planet = await this.db.swPlanet.findByPk(id)
    if (!planet) {
      return this.swapi.getPlanetById(id, options)
    }
    return planet
  }

  async #getByIdFromApiInWookieFormat (id) {
    const options = { wookiee: true }
    const person = await this.swapi.getPersonById(id, options)
    if (!person) {
      return null
    }
    const planetId = getIdFromUrl(person.acooscwoohoorcanwa)
    const planet = await this.swapi.getPlanetById(planetId, options)
    if (!planet) {
      return null
    }
    return this.#mapToWookieePerson(person, planet)
  }

  #mapToPerson (person, planet) {
    return {
      name: person.name,
      height: person.height,
      mass: person.mass,
      homeworld_name: planet.name,
      homeworld_id: `/planets/${planet.id || getIdFromUrl(planet.url)}`
    }
  }

  #mapToWookieePerson (person, planet) {
    return {
      whrascwo: person.whrascwo,
      acwoahrracao: person.acwoahrracao,
      scracc: person.scracc,
      acooscwoohoorcanwa_whrascwo: planet.whrascwo,
      acooscwoohoorcanwa_ahwa: `/akanrawhwoaoc/${getIdFromUrl(planet.hurcan)}`
    }
  }
}

module.exports = { PeopleService }

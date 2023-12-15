const { getIdFromUrl } = require('../swapiFunctions')
const {
  PlanetService,
  CommonPlanet
} = require('../Planet')
const { CommonPeople } = require('./commonPeople')

/**
 * @typedef  {Object} RawPeoplePlanet
 * @property {string} id - The id of the planet.
 * @property {string} name - The name of the planet.
 * @property {string} url - The planet url
 */

/**
 * @typedef  {Object} RawWookieePeoplePlanet
 * @property {string} whrascwo - The name of the planet.
 * @property {string} hurcan - The planet url
 */

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
    this.planetService = new PlanetService(db, swapi)
  }

  /**
   * Creates a new person in the database.
   *
   * @param {Object} person - The person object to be created in the database.
   * @returns {Promise} - A promise that resolves with the new person created in the database.
   */
  create (person) {
    return this.db.swPeople.create(person)
  }

  /**
   * Retrieves a person by their ID.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @param {StarWarsApiOptions} [options] - Options for getting person.
   * @return {Promise<object|null>} A Promise that resolves with the specified person object.
   */
  async getById (id, options = { wookiee: false }) {
    if (options.wookiee) {
      return this.#getByIdFromApiInWookieFormat(id, options)
    }
    const person = await this.db.swPeople.findByPk(id)
    if (!person) {
      return this.#getByIdFromApi(id)
    }
    delete person.id
    return person
  }

  /**
   * Calculate the weight of a person on a random planet.
   *
   * @returns {Promise<{ person: CommonPeople, planet: CommonPlanet, weight: number }>} - A promise that resolves with an object containing the person, planet, and weight.
   */
  async getWeightOnPlanetRandom () {
    const person = await new CommonPeople(this.#getRandomId(), this).init()
    const planet = await new CommonPlanet(this.#getRandomId(), this.planetService).init()

    return {
      person,
      planet,
      weight: person.getWeightOnPlanet(planet)
    }
  }

  /**
   * Retrieves a person by their ID from an API.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @return {RawPeople|null} - The person object if found, or null if not found.
   */
  async #getByIdFromApi (id) {
    const person = await this.swapi.getPersonById(id)
    if (!person) {
      return null
    }
    const planetId = getIdFromUrl(person.homeworld)
    const planet = await this.#getPlanet(planetId)
    if (!planet) {
      return null
    }
    const result = this.#mapToPeople(person, planet)
    await this.create({ ...result, id })
    return result
  }

  /**
   * Retrieves a planet from the database or fetches it from the external SWAPI service.
   *
   * @param {number} id - The ID of the planet to retrieve.
   * @param {StarWarsApiOptions} [options] - The options for the SWAPI service.
   */
  async #getPlanet (id, options) {
    const planet = await this.db.swPlanet.findByPk(id)
    if (!planet) {
      const result = this.swapi.getPlanetById(id, options)
      await this.planetService.create({ ...result, id })
      return result
    }
    return planet
  }

  /**
   * Retrieves a person and their associated planet from an API in Wookiee format based on the provided ID.
   * @param {number} id - The ID of the person to fetch.
   * @returns {Promise<RawWookieePeople>} A promise that resolves to the Wookiee person object, or null if person or planet is not found.
   */
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
    return this.#mapToWookieePeople(person, planet)
  }

  /**
   * Maps a person and a planet to a raw people.
   *
   * @param {CommonPeople} person - The person object.
   * @param {RawPeoplePlanet} planet - The planet object.
   * @returns {RawPeople} - The new object with mapped properties.
   */
  #mapToPeople (person, planet) {
    return {
      name: person.name,
      height: Number(person.height),
      mass: Number(person.mass),
      homeworld_name: planet.name,
      homeworld_id: `/planets/${planet.id || getIdFromUrl(planet.url)}`
    }
  }

  /**
   * Maps a person and a planet to a Wookiee person object.
   *
   * @param {RawWookieePeople} person - The person object to be mapped.
   * @param {RawWookieePeoplePlanet} planet - The planet object to be mapped.
   * @returns {RawWookieePeople} The mapped Wookiee person object.
   */
  #mapToWookieePeople (person, planet) {
    return {
      whrascwo: person.whrascwo,
      acwoahrracao: Number(person.acwoahrracao),
      scracc: Number(person.scracc),
      acooscwoohoorcanwa_whrascwo: planet.whrascwo,
      acooscwoohoorcanwa_ahwa: `/akanrawhwoaoc/${getIdFromUrl(planet.hurcan)}`
    }
  }

  /**
   * Generates a random ID between 1 and 50 (inclusive).
   *
   * @return {number} The randomly generated ID.
   */
  #getRandomId () {
    const min = 1
    const max = 50
    const result = max - Math.floor(Math.random() * 100)
    return result >= min && result <= max ? result : this.#getRandomId()
  }
}

module.exports = { PeopleService }

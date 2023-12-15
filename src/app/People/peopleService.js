const { getIdFromUrl } = require('../swapiFunctions')
const {
  PlanetService,
  CommonPlanet
} = require('../Planet')
const { CommonPeople } = require('./commonPeople')

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
   * @param {object} [options] - Options for getting person.
   * @param {boolean} [options.wookiee] - Retrieve from API in wookiee format.
   *
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

  async getWeightOnPlanetRandom () {
    const person = new CommonPeople(this.#getRandomId(), this)
    const planet = new CommonPlanet(this.#getRandomId(), this.planetService)

    await Promise.all([
      person.init(),
      planet.init()
    ])

    return {
      person,
      planet,
      weight: person.getWeightOnPlanet(planet)
    }
  }

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
    const result = this.#mapToPerson(person, planet)
    await this.create({ ...result, id })
    return result
  }

  async #getPlanet (id, options) {
    const planet = await this.db.swPlanet.findByPk(id)
    if (!planet) {
      const result = this.swapi.getPlanetById(id, options)
      await this.planetService.create({ ...result, id })
      return result
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
      height: Number(person.height),
      mass: Number(person.mass),
      homeworld_name: planet.name,
      homeworld_id: `/planets/${planet.id || getIdFromUrl(planet.url)}`
    }
  }

  #mapToWookieePerson (person, planet) {
    return {
      whrascwo: person.whrascwo,
      acwoahrracao: Number(person.acwoahrracao),
      scracc: Number(person.scracc),
      acooscwoohoorcanwa_whrascwo: planet.whrascwo,
      acooscwoohoorcanwa_ahwa: `/akanrawhwoaoc/${getIdFromUrl(planet.hurcan)}`
    }
  }

  #getRandomId () {
    const min = 1
    const max = 50
    const result = max - Math.floor(Math.random() * 100)
    return result >= min && result <= max ? result : this.#getRandomId()
  }
}

module.exports = { PeopleService }

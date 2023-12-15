/**
 * @typedef  {Object} RawPlanetWithId
 * @property {number} [id] - The planet ID.
 * @property {string} name - The name of the planet.
 * @property {number} gravity - The planet gravity standard ratio.
 */

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

  /**
   * Creates a new planet in the database.
   *
   * @param {RawPlanetWithId} planet - The planet object to be created.
   * @return {Promise<RawPlanetWithId>} A promise that resolves to the created planet object.
   */
  create (planet) {
    return this.db.swPlanet.create(planet)
  }

  /**
   * Retrieves a planet by its ID.
   * @param {string} id - The ID of the planet to retrieve.
   * @param {StarWarsApiOptions} options - Star Wars API options.
   * @return {Promise<RawPlanet|RawWookieePlanet|null>} - A promise that resolves to the planet object.
   */
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

  /**
   * Retrieves a planet from the API by its ID.
   *
   * @param {number} id - The ID of the planet.
   * @param {StarWarsApiOptions} options - Star Wars API options.
   *
   * @returns {Promise<RawPlanet|RawWookieePlanet|null>} - A Promise that resolves with the planet object or null if it doesn't exist.
   */
  async #getByIdFromApi (id, options) {
    const planet = await this.swapi.getPlanetById(id, options)
    if (!planet) {
      return null
    }
    if (options.wookiee) {
      return this.#mapToWookieePlanet(planet)
    }
    await this.create({ ...planet, id })
    return this.#mapToPlanet(planet)
  }

  /**
   * Maps a planet object to a Planet format.
   *
   * @param {RawPlanet} planet - The planet object to map.
   * @returns {RawPlanet} - The mapped planet object.
   */
  #mapToPlanet (planet) {
    return {
      name: planet.name,
      gravity: this.#extractGravity(planet.gravity)
    }
  }

  /**
   * Maps the planet object to Wookiee planet.
   *
   * @param {RawWookieePlanet} planet - The planet object to be mapped to Wookiee planet.
   * @return {RawWookieePlanet} - The mapped planet object in Wookiee planet format.
   */
  #mapToWookieePlanet (planet) {
    return {
      whrascwo: planet.whrascwo,
      rrrcrahoahaoro: this.#extractGravity(planet.rrrcrahoahaoro)
    }
  }

  /**
   * Extracts the gravity value from the given gravity standard.
   *
   * @param {string} gravityStandard - The gravity standard string (1.0 standard).
   * @return {number} - The gravity value extracted from the gravity standard.
   */
  #extractGravity (gravityStandard) {
    return Number(gravityStandard.split(' ')[0])
  }
}

module.exports = { PlanetService }

/**
 * @typedef {Object} StarWarsApiOptions
 * @property {boolean} [wookiee] - Fetch info in Wookiee format.
 */

/**
 * @class StarWarsApi
 * */
class StarWarsApi {
  static baseUrl = 'https://swapi.dev/api/'
  /**
   * Constructor for the class.
   *
   * @param {Function} request - The request object.
   * @param {Object} [logger=console] - The logger object, default is console.
   */
  constructor (request, logger = console) {
    this.request = request
    this.logger = logger
  }

  /**
   * Retrieves data from the specified URL using a generic request.
   *
   * @param {string} url - The URL from which to retrieve the data.
   * @param {object} [options] - Options for getting person.
   * @param {boolean} [options.wookiee=false] - Retrieve from API in wookiee format.
   * @return {Promise<any | null>} - A Promise that resolves with the retrieved data or null if an error occurred.
   */
  async #getData (url, options = { wookiee: false }) {
    try {
      if (options.wookiee) {
        return this.#handleMissingData(await this.request({ url, query: { format: 'wookiee' } }))
      }
      return this.#handleMissingData(await this.request({ url }))
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  /**
   * Retrieves a person by their ID.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @param {StarWarsApiOptions} [options] - Options for getting person.
   *
   * @returns {Promise<object|null>} A Promise resolving to an Object representing the person.
   */
  getPersonById (id, options) {
    const url = `${StarWarsApi.baseUrl}people/${id}`
    return this.#getData(url, options)
  }

  /**
   * Retrieves planet data by its ID.
   *
   * @param {number} id - The ID of the planet to retrieve.
   * @param {StarWarsApiOptions} [options] - Options for getting planet.
   *
   * @returns {Promise<object|null>} - A Promise that resolves to the planet data.
   */
  getPlanetById (id, options) {
    const url = `${StarWarsApi.baseUrl}planets/${id}`
    return this.#getData(url, options)
  }

  /**
   * Handles missing data by checking if the detail property of the provided data object is 'Not found'.
   * If it is 'Not found', returns null. Otherwise, returns the provided data object.
   *
   * @param {Object} data - The data object to handle missing data for.
   * @return {Object|null} - The data object itself if the detail is not 'Not found',
   *                         otherwise returns null.
   */
  #handleMissingData (data) {
    return data.detail === 'Not found' ? null : data
  }
}

module.exports = { StarWarsApi }

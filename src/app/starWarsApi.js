/**
 * @class StarWarsApi
 * */
class StarWarsApi {
  constructor (request) {
    this.baseUrl = 'https://swapi.dev/api/'
    this.request = request
  }

  /**
   * Retrieves data from the specified URL using a generic request.
   *
   * @param {string} url - The URL from which to retrieve the data.
   * @return {Promise<any | null>} - A Promise that resolves with the retrieved data or null if an error occurred.
   */
  async #getData (url) {
    try {
      return await this.request({ url })
    } catch (error) {
      console.error(error)
      return null
    }
  }

  /**
   * Retrieves a person by their ID.
   *
   * @param {number} id - The ID of the person to retrieve.
   * @param {object} options - Options for getting person.
   * @param {boolean} options.wookiee - Retrieve from API in wookiee format.
   *
   * @returns {Promise<object|null>} A Promise resolving to an Object representing the person.
   */
  getPersonById (id, options = { wookiee: false }) {
    const url = `${this.baseUrl}people/${id}`
    if (options.wookiee) {
      return this.#getData(url + '?format=wookiee')
    }
    return this.#getData(url)
  }

  /**
   * Retrieves planet data by its ID.
   *
   * @param {number} id - The ID of the planet to retrieve.
   * @param {object} options - Options for getting planet.
   * @param {boolean} options.wookiee - Retrieve from API in wookiee format.
   *
   * @returns {Promise<object|null>} A Promise that resolves to the planet data.
   */
  getPlanetById (id, options = { wookiee: false }) {
    const url = `${this.baseUrl}planets/${id}`
    if (options.wookiee) {
      return this.#getData(url + '?format=wookiee')
    }
    return this.#getData(url)
  }
}

module.exports = { StarWarsApi }

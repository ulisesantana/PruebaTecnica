/**
 * @class StarWarsApi
 * */
class StarWarsApi {
  static baseUrl = 'https://swapi.dev/api/'
  constructor (request) {
    this.request = request
  }

  /**
   * Retrieves data from the specified URL using a generic request.
   *
   * @param {string} url - The URL from which to retrieve the data.
   * @param {object} options - Options for getting person.
   * @param {boolean} options.wookiee - Retrieve from API in wookiee format.
   * @return {Promise<any | null>} - A Promise that resolves with the retrieved data or null if an error occurred.
   */
  async #getData (url, options = { wookiee: false }) {
    try {
      if (options.wookiee) {
        return this.#handleMissingData(await this.request({ url, query: { format: 'wookiee' } }))
      }
      return this.#handleMissingData(await this.request({ url }))
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
    const url = `${StarWarsApi.baseUrl}people/${id}`
    return this.#getData(url, options)
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
    const url = `${StarWarsApi.baseUrl}planets/${id}`
    return this.#getData(url, options)
  }

  #handleMissingData (data) {
    return data.detail === 'Not found' ? null : data
  }
}

module.exports = { StarWarsApi }

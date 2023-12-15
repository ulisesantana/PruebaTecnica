/**
 * @typedef  {Object} RawPlanet
 * @property {string} name - The name of the planet.
 * @property {number} gravity - The planet gravity standard ratio.
 */

class AbstractPlanet {
  /**
   * @param {number} id
   * @param {PlanetService} service
   */
  constructor (id, service) {
    this.id = id
    this.service = service
    this.found = null
  }

  /**
   * Initializes the object.
   *
   * @returns {Promise<Object>} A Promise that resolves to the initialized object.
   */
  async init () {
    const planet = await this.service.getById(this.id)
    this.found = !!planet
    if (this.found) {
      this.setValues(planet)
    }
    return this
  }

  /**
   * Retrieves the ID associated with the current instance.
   *
   * @returns {number} The ID value.
   */
  getId () {
    return this.id
  }

  /**
   * Get the name of the object.
   *
   * @returns {string} The name of the object.
   */
  getName () {
    return this.name
  }

  /**
   * Retrieves the gravity value.
   *
   * @returns {number} The gravity value.
   */
  getGravity () {
    return this.gravity
  }

  /**
   * Checks if the item is missing.
   *
   * @returns {boolean} Returns true if the item is missing, otherwise false.
   */
  isMissing () {
    return !this.found
  }

  /**
   * Sets the values of the name and gravity properties for a planet object.
   *
   * @param {RawPlanet} planet - The planet object containing the values to set.
   *
   * @return {void}
   */
  setValues (planet) {
    this.name = planet.name
    this.gravity = planet.gravity
  }

  /**
   * Returns raw planet.
   *
   * @return {RawPlanet} - Planet with name and gravity properties.
   */
  toRaw () {
    return {
      name: this.getName(),
      gravity: this.getGravity()
    }
  }
}

module.exports = { AbstractPlanet }

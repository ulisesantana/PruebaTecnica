const { getWeightOnPlanet } = require('../swapiFunctions')

/**
 * @typedef  {Object} RawPeople
 * @property {string} name - The name of the person.
 * @property {string} height - The height of the person.
 * @property {string} mass - The mass of the person.
 * @property {string} homeworld_name - The name of the homeworld of the person.
 * @property {string} homeworld_id - The ID of the homeworld of the person.
 */

class AbstractPeople {
  /**
   * Constructor for the AbstractPeople class.
   *
   * @param {number} id - The ID of the person.
   * @param {PeopleService} peopleService - The service for managing people.
   * @throws {Error} - Throws an error if an instance of AbstractPeople is attempted to be created.
   */
  constructor (id, peopleService) {
    if (this.constructor === AbstractPeople) {
      throw new Error('Abstract classes can\'t be instantiated.')
    }
    this.id = id
    this.service = peopleService
    this.found = null
  }

  /**
   * Initializes the object and fetches data from the service.
   *
   * @returns {Promise<Object>} Resolves with the initialized object.
   */
  async init () {
    const person = await this.service.getById(this.id)
    this.found = !!person
    if (this.found) {
      this.setValues(person)
    }
    return this
  }

  /**
   * Retrieves the ID of the object.
   *
   * @return {number} The ID of the object.
   */
  getId () {
    return this.id
  }

  /**
   * Retrieves the name of the object.
   *
   * @returns {string} The name of the object.
   */
  getName () {
    return this.name
  }

  /**
   * Retrieves the mass of an object.
   *
   * @return {number} The mass of the object.
   */
  getMass () {
    return this.mass
  }

  /**
   * Returns the height of the object.
   *
   * @returns {number} The height of the object.
   */
  getHeight () {
    return this.height
  }

  /**
   * Returns the name of the homeworld.
   *
   * @returns {string} The name of the homeworld.
   */
  getHomeworldName () {
    return this.homeworldName
  }

  /**
   * Returns the homeworld id.
   * @returns {string} The homeworld id.
   */
  getHomeworldId () {
    return this.homeworldId
  }

  /**
   * Calculate the weight of an object on a specific planet.
   *
   * @param {CommonPlanet} planet - The name of the planet.
   * @return {number} - The weight of the object on the specified planet.
   * @throws {Error} - If the planet is the person's home planet.
   */
  getWeightOnPlanet (planet) {
    if (this.getHomeworldName() === planet.getName()) {
      throw new Error('Not allowed to calculate weight on person\'s home planet.')
    }
    return getWeightOnPlanet(this.getMass(), planet.getGravity())
  }

  /**
   * Checks if the item is missing in the API
   * @returns {boolean} Returns true if the item is missing, otherwise false.
   */
  isMissing () {
    return !this.found
  }

  /**
   * Retrieves the raw data of the object.
   *
   * @return {RawPeople} The raw data of the object, including its properties and values.
   */
  toRaw () {
    return {
      name: this.getName(),
      height: this.getHeight(),
      mass: this.getMass(),
      homeworld_name: this.getHomeworldName(),
      homeworld_id: this.getHomeworldId()
    }
  }

  /**
   * Sets the values of the person object properties.
   *
   * @param {RawPeople} person - The person object containing the properties to set.
   */
  setValues (person) {
    this.name = person.name
    this.height = person.height
    this.mass = person.mass
    this.homeworldName = person.homeworld_name
    this.homeworldId = person.homeworld_id
  }
}

module.exports = { AbstractPeople }

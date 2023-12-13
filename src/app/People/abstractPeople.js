const { getWeightOnPlanet } = require('../swapiFunctions')

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
      throw new Error('Abstract clases can\'t be instantiated.')
    }
    this.id = id
    this.service = peopleService
    this.found = null
  }

  async init () {
    const person = await this.service.getById(this.id)
    this.found = !!person
    if (this.found) {
      this.setValues(person)
    }
    return this
  }

  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getMass () {
    return this.mass
  }

  getHeight () {
    return this.height
  }

  getHomeworldName () {
    return this.homeworldName
  }

  getHomeworldId () {
    return this.homeworldId
  }

  /**
   * Calculate the weight of an object on a specific planet.
   *
   * @param {Planet} planet - The name of the planet.
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

  toRaw () {
    return {
      name: this.getName(),
      height: this.getHeight(),
      mass: this.getMass(),
      homeworld_name: this.getHomeworldName(),
      homeworld_id: this.getHomeworldId()
    }
  }

  setValues (person) {
    this.name = person.name
    this.height = person.height
    this.mass = person.mass
    this.homeworldName = person.homeworld_name
    this.homeworldId = person.homeworld_id
  }
}

module.exports = { AbstractPeople }

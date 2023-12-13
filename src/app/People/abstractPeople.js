class AbstractPeople {
  constructor (id, db, swapi) {
    if (this.constructor === AbstractPeople) {
      throw new Error('Abstract clases can\'t be instantiated.')
    }
    this.id = id
    this.db = db
    this.swapi = swapi
  }

  async init () {
    throw new Error('To be implemented')
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
    return this.homeworlId
  }

  getWeightOnPlanet (planetId) {
    throw new Error('To be implemented')
  }
}

module.exports = { AbstractPeople }

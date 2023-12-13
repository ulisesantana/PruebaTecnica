class Planet {
  constructor (id, service) {
    this.id = id
    this.service = service
    this.found = null
  }

  async init () {
    const planet = await this.service.getById(this.id)
    this.found = !!planet
    if (this.found) {
      this.setValues(planet)
    }
    return this
  }

  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getGravity () {
    return this.gravity
  }

  isMissing () {
    return !this.found
  }

  setValues (planet) {
    this.name = planet.name
    this.gravity = planet.gravity
  }

  toRaw () {
    return {
      name: this.getName(),
      gravity: this.getGravity()
    }
  }
}

module.exports = { Planet }

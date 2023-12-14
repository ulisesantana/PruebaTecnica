const { AbstractPlanet } = require('./abstractPlanet')

class WookieePlanet extends AbstractPlanet {
  async init () {
    const planet = await this.service.getById(this.id, { wookiee: true })
    this.found = !!planet
    if (this.found) {
      this.setValues(planet)
    }
    return this
  }

  setValues (planet) {
    this.name = planet.whrascwo
    this.gravity = planet.rrrcrahoahaoro
  }
}

module.exports = { WookieePlanet }

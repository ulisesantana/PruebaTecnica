const { AbstractPeople } = require('./abstractPeople')

/**
 * @typedef {Object} RawWookieePeople
 * @property {string} whrascwo - The Wookiee name of the person.
 * @property {number} acwoahrracao - The height of the person, converted to a number.
 * @property {number} scracc - The mass of the person, converted to a number.
 * @property {string} acooscwoohoorcanwa_whrascwo - The Wookiee name of the person's homeworld.
 * @property {string} acooscwoohoorcanwa_ahwa - The URL to the person's homeworld, derived from its ID.
 */

class WookieePeople extends AbstractPeople {
  /**
   * Initializes the object.
   *
   * @async
   * @return {Promise<Object>} Resolves with the initialized object.
   */
  async init () {
    const person = await this.service.getById(this.id, { wookiee: true })
    this.found = !!person
    if (this.found) {
      this.setValues(person)
    }
    return this
  }

  /**
   * Sets the values of the person.
   *
   * @param {RawWookieePeople} person - The person
   * @return {void}
   */
  setValues (person) {
    this.name = person.whrascwo
    this.height = person.acwoahrracao
    this.mass = person.scracc
    this.homeworldName = person.acooscwoohoorcanwa_whrascwo
    this.homeworldId = person.acooscwoohoorcanwa_ahwa
  }
}

module.exports = { WookieePeople }

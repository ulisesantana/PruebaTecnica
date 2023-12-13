const { AbstractPeople } = require('./abstractPeople')

/**
 * Constructor for the CommonPeople class.
 *
 * @param {number} id - The ID of the person.
 * @param {PeopleService} peopleService - The service for managing people.
 */
class WookieePeople extends AbstractPeople {
  constructor (id, service) {
    super(id, service)
  }

  async init () {
    const person = await this.service.getById(this.id, { wookiee: true })
    this.found = !!person
    if (this.found) {
      this.setValues(person)
    }
    return this
  }

  setValues (person) {
    this.name = person.whrascwo
    this.height = person.acwoahrracao
    this.mass = person.scracc
    this.homeworldName = person.acooscwoohoorcanwa_whrascwo
    this.homeworldId = person.acooscwoohoorcanwa_ahwa
  }
}

module.exports = { WookieePeople }

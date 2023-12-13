const { AbstractPeople } = require('./abstractPeople')

/**
 * Constructor for the CommonPeople class.
 *
 * @param {number} id - The ID of the person.
 * @param {PeopleService} peopleService - The service for managing people.
 */
class CommonPeople extends AbstractPeople {
  constructor (id, service) {
    super(id, service)
  }
}

module.exports = { CommonPeople }

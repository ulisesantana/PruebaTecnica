const {
  describe,
  it
} = require('node:test')
const assert = require('node:assert')
const { AbstractPeople } = require('../../../src/app/People/abstractPeople')

describe('Abstract people class should', () => {
  it('throw an error if is directly instantiated', () => {
    try {
      new AbstractPeople(42, {})
      throw new Error('should throw an error on creating an instance of AbstractPeople')
    } catch (error) {
      assert.strictEqual(error.message, 'Abstract classes can\'t be instantiated.')
    }
  })
})

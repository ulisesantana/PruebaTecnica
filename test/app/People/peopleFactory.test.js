const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('node:assert')
const {
  lukeSkywalker,
  wookieeSkywalker
} = require('../../fixtures/people')
const { peopleFactory } = require('../../../src/app/People')
const { CommonPeople } = require('../../../src/app/People/commonPeople')
const { WookieePeople } = require('../../../src/app/People/wookieePeople')
describe('People factory should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => lukeSkywalker) }
  })

  it('create common people', async () => {
    const { id } = lukeSkywalker

    const person = await peopleFactory({ id, service })

    assert.equal(person.getId(), id)
    assert.equal(person.getName(), lukeSkywalker.name)
    assert.equal(person.getHeight(), lukeSkywalker.height)
    assert.equal(person.getMass(), lukeSkywalker.mass)
    assert.equal(person.getHomeworldName(), lukeSkywalker.homeworld_name)
    assert.equal(person.getHomeworldId(), lukeSkywalker.homeworld_id)
    assert.equal(person.isMissing(), false)
    assert.equal(person instanceof CommonPeople, true)
  })

  it('create wookie people', async () => {
    service = { getById: mock.fn(() => wookieeSkywalker) }
    const { id } = wookieeSkywalker

    const person = await peopleFactory({ id, service, lang: 'wookiee' })

    assert.equal(person.getId(), id)
    assert.equal(person.getName(), wookieeSkywalker.whrascwo)
    assert.equal(person.getHeight(), wookieeSkywalker.acwoahrracao)
    assert.equal(person.getMass(), wookieeSkywalker.scracc)
    assert.equal(person.getHomeworldName(), wookieeSkywalker.acooscwoohoorcanwa_whrascwo)
    assert.equal(person.getHomeworldId(), wookieeSkywalker.acooscwoohoorcanwa_ahwa)
    assert.equal(person.isMissing(), false)
    assert.equal(person instanceof WookieePeople, true)
  })
})

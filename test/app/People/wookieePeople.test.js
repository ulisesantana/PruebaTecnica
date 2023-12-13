const {
  describe,
  it,
  mock,
  beforeEach
} = require('node:test')
const assert = require('assert')
const { WookieePeople } = require('../../../src/app/People/wookieePeople')
const { wookieeSkywalker } = require('../../fixtures/wookiee.lukeSkywalker')
describe('Wookiee People should', () => {
  let service

  beforeEach(() => {
    service = { getById: mock.fn(() => wookieeSkywalker) }
  })

  it('be inited asynchronously', async () => {
    const { id } = wookieeSkywalker
    const person = new WookieePeople(id, service)

    await person.init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id, { wookiee: true }])
    assert.equal(person.getId(), id)
    assert.equal(person.getName(), wookieeSkywalker.whrascwo)
    assert.equal(person.getHeight(), wookieeSkywalker.acwoahrracao)
    assert.equal(person.getMass(), wookieeSkywalker.scracc)
    assert.equal(person.getHomeworldName(), wookieeSkywalker.acooscwoohoorcanwa_whrascwo)
    assert.equal(person.getHomeworldId(), wookieeSkywalker.acooscwoohoorcanwa_ahwa)
    assert.equal(person.isMissing(), false)
  })

  it('set as missing if there is no person for the given id', async () => {
    const service = { getById: mock.fn(() => null) }
    const { id } = wookieeSkywalker
    const person = await new WookieePeople(id, service).init()

    assert.deepEqual(service.getById.mock.calls[0].arguments, [id, { wookiee: true }])
    assert.equal(person.isMissing(), true)
  })

  it('return raw value', async () => {
    const person = await new WookieePeople(wookieeSkywalker.id, service).init()

    assert.deepEqual(person.toRaw(), {
      id: wookieeSkywalker.id,
      height: wookieeSkywalker.acwoahrracao,
      homeworld_id: wookieeSkywalker.acooscwoohoorcanwa_ahwa,
      homeworld_name: wookieeSkywalker.acooscwoohoorcanwa_whrascwo,
      mass: wookieeSkywalker.scracc,
      name: wookieeSkywalker.whrascwo
    })
  })
})

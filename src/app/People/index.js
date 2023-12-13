const { WookieePeople } = require('./wookieePeople')
const { CommonPeople } = require('./commonPeople')
const { PeopleService } = require('./peopleService')

const peopleFactory = async ({
  id,
  lang,
  service
}) => {
  let people = null
  if (lang === 'wookiee') {
    people = new WookieePeople(id, service)
  } else {
    people = new CommonPeople(id, service)
  }
  await people.init()
  return people
}

module.exports = { peopleFactory, PeopleService }

const { WookieePeople } = require('./wookieePeople')
const { CommonPeople } = require('./commonPeople')
const { PeopleService } = require('./peopleService')

const peopleFactory = async ({
  id,
  lang,
  service
}) => {
  if (lang === 'wookiee') {
    return new WookieePeople(id, service).init()
  }
  return new CommonPeople(id, service).init()
}

module.exports = { peopleFactory, PeopleService }

const { CommonPlanet } = require('./commonPlanet')
const { PlanetService } = require('./planetService')
const { WookieePlanet } = require('./wookieePlanet')

const planetFactory = ({
  id,
  lang,
  service
}) => {
  if (lang === 'wookiee') {
    return new WookieePlanet(id, service).init()
  }
  return new CommonPlanet(id, service).init()
}

module.exports = { CommonPlanet, planetFactory, WookieePlanet, PlanetService }

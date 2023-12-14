const { CommonPlanet } = require('./commonPlanet')
const { PlanetService } = require('./planetService')
const { WookieePlanet } = require('./wookieePlanet')

const planetFactory = async ({
  id,
  lang,
  service
}) => {
  let planet = null
  if (lang === 'wookiee') {
    planet = new WookieePlanet(id, service)
  } else {
    planet = new CommonPlanet(id, service)
  }
  await planet.init()
  return planet
}

module.exports = { CommonPlanet, planetFactory, WookieePlanet, PlanetService }

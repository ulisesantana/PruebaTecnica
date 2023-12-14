const {
  lukeSkywalker,
  wookieeSkywalker
} = require('./people')
const { tatooine } = require('./planets')
const {
  name,
  height,
  mass
} = lukeSkywalker
const rawApiPerson = {
  ...{
    name,
    height,
    mass
  },
  homeworld: 'https://swapi.dev/api/planets/1/'
}
const {
  whrascwo,
  acwoahrracao,
  scracc
} = wookieeSkywalker
const rawApiWookiePerson = {
  ...{
    whrascwo,
    acwoahrracao,
    scracc
  },
  acooscwoohoorcanwa: 'acaoaoakc://cohraakah.wawoho/raakah/akanrawhwoaoc/1/'
}

module.exports = {
  rawApiPerson,
  rawApiPlanet: {
    url: rawApiPerson.homeworld,
    name: tatooine.name,
    gravity: '1 standard'
  },
  rawApiWookiePerson,
  rawApiWookiePlanet: {
    rrrcrahoahaoro: '1 caorawhwararcwa',
    hurcan: rawApiWookiePerson.acooscwoohoorcanwa,
    whrascwo: 'Traaoooooahwhwo'
  }
}

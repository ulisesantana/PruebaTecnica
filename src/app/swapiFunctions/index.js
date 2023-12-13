const fetch = require('node-fetch')

const getWeightOnPlanet = (mass, gravity) => {
  return mass * gravity
}

const genericRequest = async (url, method, body, logging = false) => {
  const options = {
    method
  }
  if (body) {
    options.body = body
  }
  const response = await fetch(url, options)
  const data = await response.json()
  if (logging) {
    console.log(data)
  }
  return data
}
const getIdFromUrl = url => url.split('/').filter(Boolean).at(-1)

module.exports = {
  getWeightOnPlanet,
  genericRequest,
  getIdFromUrl
}

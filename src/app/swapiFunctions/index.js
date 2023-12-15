const fetch = require('node-fetch')

/**
 * Calculates the weight on a planet based on the given mass and gravity.
 *
 * @param {number} mass - The mass of the object.
 * @param {number} gravity - The gravity of the planet.
 * @return {number} - The weight on the planet.
 */
const getWeightOnPlanet = (mass, gravity) => {
  return mass * gravity
}

/**
 * Makes a generic HTTP request and returns the response data asynchronously.
 *
 * @param {object} [params] - The parameters for the request
 * @param {string} [params.url] - The URL to send the request to
 * @param {string} [params.method='GET'] - The HTTP method to use (e.g., GET, POST, etc.)
 * @param {object} [params.body] - The data to send in the request body
 * @param {boolean} [params.logging=false] - Indicates whether to log the response data
 * @returns {Promise<object>} The response data as a JavaScript object
 */
const genericRequest = async ({ url, method, body, query, logging } = {
  method: 'GET',
  logging: false
}) => {
  const options = {
    method
  }
  if (body) {
    options.body = body
  }
  const queryUrl = query ? url + '?' + new URLSearchParams(query) : url
  const response = await fetch(queryUrl, options)
  const data = await response.json()
  if (logging) {
    console.log(data)
  }
  return data
}

/**
 * Retrieves the ID from a given URL.
 *
 * @param {string} url - The URL from which to retrieve the ID.
 * @returns {string} - The ID extracted from the URL.
 */
const getIdFromUrl = url => url.split('/').filter(Boolean).at(-1)

module.exports = {
  getWeightOnPlanet,
  genericRequest,
  getIdFromUrl
}

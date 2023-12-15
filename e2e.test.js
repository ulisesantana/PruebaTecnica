#!/usr/bin/env node
const { spawn } = require('child_process')
const fetch = require('node-fetch')
const assert = require('node:assert')

const server = spawn('node', ['--env-file=.env', 'index.js'])

setTimeout(() => fetch('http://localhost:4567/hfswapi/getPeople/1')
  .then(response => response.json())
  .then(response => {
    assert.deepEqual(response, {
      height: 172,
      homeworld_id: '/planets/1',
      homeworld_name: 'Tatooine',
      mass: 77,
      name: 'Luke Skywalker'
    })
    console.log('✅ /hfswapi/getPeople/:id from database')
    return fetch('http://localhost:4567/hfswapi/getPeople/2')
  })
  .then(response => response.json())
  .then(response => {
    assert.deepEqual(response, {
      height: 167,
      homeworld_id: '/planets/1',
      homeworld_name: 'Tatooine',
      mass: 75,
      name: 'C-3PO'
    })
    console.log('✅ /hfswapi/getPeople/:id from SWAPI')
    return fetch('http://localhost:4567/hfswapi/getPlanet/1')
  })
  .then(response => response.json())
  .then(response => {
    assert.deepEqual(response, {
      gravity: 1,
      name: 'Tatooine'
    })
    console.log('✅ /hfswapi/getPlanet/:id from database')
    return fetch('http://localhost:4567/hfswapi/getPlanet/42')
  })
  .then(response => response.json())
  .then(response => {
    assert.deepEqual(response, {
      gravity: 0.98,
      name: 'Haruun Kal'
    })
    console.log('✅ /hfswapi/getPlanet/:id from SWAPI')
    return fetch('http://localhost:4567/hfswapi/getLogs')
  })
  .then(response => response.json())
  .then(response => {
    assert.equal(Array.isArray(response.data), true)
    assert.equal(response.data.length, 5)
    assert.equal(response.currentPage, 1)
    assert.equal(response.pageSize, 10)
    assert.equal(response.pageCount, 1)
    console.log('✅ /hfswapi/getLogs')
  }).catch(error => {
    console.error('❌ Test failed:', error)
  }).finally(() => {
    killServer()
    process.exit()
  })
, 500)

process.on('exit', killServer)
process.on('SIGINT', killServer)
process.on('SIGTERM', killServer)
process.on('uncaughtException', killServer)

function killServer () {
  server.kill('SIGKILL')
}

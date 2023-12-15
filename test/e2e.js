#!/usr/bin/env node
const { spawn } = require('child_process')
const fetch = require('node-fetch')
const assert = require('node:assert')

// Start the server as a child process
const server = spawn('npm', ['start'])

// Give the server some time to start
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
    assert.equal(response.data.length, 10)
    assert.equal(response.currentPage, 1)
    assert.equal(response.pageSize, 10)
    console.log('✅ /hfswapi/getLogs')
  })
  .then(() => {
    server.kill()
    process.exit(0)
  })
  .catch(error => {
    // If there's an error, log it and exit with failure
    console.error('❌ Test failed:', error)
    server.kill()
    process.exit(1)
  }).finally()
, 500) // Adjust this timeout according to how long your server takes to start

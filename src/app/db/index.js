'use strict'

const Sequelize = require('sequelize')
const models = require('./models')

let sequelize

sequelize = new Sequelize('sqlite::memory:', {
  logging: false // console.log
})

/**
 * The database object that holds the Sequelize instance, the Sequelize library,
 * and all model instances.
 *
 * @typedef {Object<string, Sequelize | Sequelize.Model | Function<Promise<void>>>} DB
 * @property {Sequelize} Sequelize - The Sequelize library.
 * @property {Sequelize} sequelize - The Sequelize instance.
 * @property {Sequelize.Model} swPeople - The People model
 * @property {Sequelize.Model} swPlanet - The Planet model
 * @property {Sequelize.Model} logging - The Logging model
 * @property {Function<Promise<void>>} initDB - Initializes the database models.
 * @property {Function<Promise<void>>} populateDB - Populates the database with initial data.
 * @property {Function<Promise<void>>} watchDB - Logs the current state of database models.
 * @property {Function<Promise<void>>} deleteDB - Drops all tables from the database.
 */

/**
 * @type {DB}
 */
const db = {
  Sequelize,
  sequelize
}

for (const modelInit of models) {
  const model = modelInit(db.sequelize, db.Sequelize.DataTypes)
  db[model.name] = model
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

const initDB = async () => {
  await db.swPeople.sync({ force: true })
  await db.swPlanet.sync({ force: true })
  await db.logging.sync({ force: true })
}

const populateDB = async () => {
  await db.swPlanet.bulkCreate([
    {
      name: 'Tatooine',
      gravity: 1.0
    }
  ])
  await db.swPeople.bulkCreate([
    {
      name: 'Luke Skywalker',
      height: 172,
      mass: 77,
      homeworld_name: 'Tatooine',
      homeworld_id: '/planets/1'
    }
  ])
}

const deleteDB = async () => {
  await db.swPeople.drop()
  await db.swPlanet.drop()
  await db.logging.drop()
}

const watchDB = async () => {
  const planets = await db.swPlanet.findAll({
    raw: true
  })

  const people = await db.swPeople.findAll({
    raw: true
  })

  console.log('============= swPlanet =============')
  console.table(planets)
  console.log('\n')
  console.log('============= swPeople =============')
  console.table(people)
}

db.initDB = initDB
db.populateDB = populateDB
db.watchDB = watchDB
db.deleteDB = deleteDB

module.exports = db

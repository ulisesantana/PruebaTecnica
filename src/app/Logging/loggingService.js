class LoggingService {
  /**
   * @constructor
   * @param {DB} db - The database object used for data storage.
   */
  constructor (db) {
    this.db = db
  }

  create (log) {
    return this.db.logging.create(log)
  }

  async getAll (limit = 10, page = 1) {
    const { count, rows } = await this.db.logging.findAndCountAll({
      limit,
      offset: (page - 1) * limit
    })

    return {
      data: rows,
      pageCount: Math.ceil(count / limit),
      currentPage: page,
      pageSize: limit
    }
  }
}

module.exports = { LoggingService }

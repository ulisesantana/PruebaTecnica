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

  async getAll (size = 10, page = 1) {
    const { count, rows } = await this.db.logging.findAndCountAll({
      limit: size,
      offset: (page - 1) * size,
      order: [
        ['createdAt', 'DESC']
      ]
    })

    return {
      data: rows,
      pageCount: Math.ceil(count / size),
      currentPage: page,
      pageSize: size
    }
  }
}

module.exports = { LoggingService }

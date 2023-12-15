class LoggingService {
  /**
   * @constructor
   * @param {DB} db - The database object used for data storage.
   */
  constructor (db) {
    this.db = db
  }

  create ({ ip, header, action }) {
    return this.db.logging.create({ ip, header, action })
  }

  /**
   * Retrieves log entries from the database.
   *
   * @param {number} [page=1] - The page number of the entries to retrieve.
   *
   * @param {number} [size=10] - The number of entries to retrieve per page.
   * @returns {Promise<{
   *   data: Array<Object>,
   *   pageCount: number,
   *   currentPage: number,
   *   pageSize: number
   * }>} - A promise that resolves with an object containing the retrieved entries,
   *           the number of pages, the current page number, and the page size.
   */
  async getAll (page = 1, size = 10) {
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

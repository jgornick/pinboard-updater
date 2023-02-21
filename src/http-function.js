const { log } = require('./logger')
const { update: updateBookmarks } = require('./update')

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
const update = async (req, res) => {
  try {
    await updateBookmarks(req.query.lastDate)
    res.send(200);
  } catch (e) {
    log.error(e)
    res.send(500)
  }
}

module.exports = {
  update,
}

const fetch = require('node-fetch')
const convert = require('xml-js')
const { map, filter } = require('lodash')
const { loadFromString } = require('html-metadata')
const compareAsc = require('date-fns/compareAsc')
const queryString = require('query-string')

const { log } = require('./logger')

const { PINBOARD_API_KEY } = process.env

async function getBookmarks () {
  const response = await fetch(`https://api.pinboard.in/v1/posts/all?auth_token=${PINBOARD_API_KEY}`)
  const responseText = await response.text()
  const responseXmlObject = convert.xml2js(responseText, { compact: true })
  const posts = responseXmlObject.posts.post

  return map(posts, '_attributes')
}

async function scrapeBookmark (bookmark) {
  const response = await fetch(bookmark.href, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/5332 (KHTML, like Gecko) Chrome/40.0.880.0 Mobile Safari/5332'
    }
  })
  const html = await response.text()

  const metadata = await loadFromString(html)

  return {
    ...bookmark,
    description: metadata.general.title,
    extended: metadata.general.description,
  }
}

async function updateBookmark (bookmark) {
  const qs = queryString.stringify(
    {
      auth_token: PINBOARD_API_KEY,
      url: bookmark.href,
      description: bookmark.description,
      extended: bookmark.extended,
      tags: bookmark.tag,
      dt: bookmark.time,
      replace: 'yes',
      toread: bookmark.toread
    },
    {
      skipNull: true,
      skipEmptyString: true,
    }
  )

  await fetch(`https://api.pinboard.in/v1/posts/add?${qs}`)
}

function filterBookmarksAfterDate (bookmarks, date) {
  return filter(bookmarks, (bookmark) => compareAsc(new Date(bookmark.time), date) >= 0)
}

async function update (lastDate = 0) {
  const bookmarks = filterBookmarksAfterDate(
    await getBookmarks(),
    new Date(lastDate)
  )

  log.debug('bookmarks to update', bookmarks.length)

  let bookmark

  for (bookmark of bookmarks) {
    try {
      try {
        log.debug('scraping bookmark', bookmark.href)
        bookmark = await scrapeBookmark(bookmark)
      } catch (e) {
        log.error('Error while scraping bookmark', bookmark.href, e)
        throw e
      }

      try {
        log.debug('updating bookmark', bookmark.href)
        await updateBookmark(bookmark)
      } catch (e) {
        log.error('Error while updating bookmark', bookmark.href, e)
        throw e
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (e) {
      // noop
    }
  }
}

module.exports = {
  update,
}

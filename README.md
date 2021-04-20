# pinboard-updater

[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][LICENSE]

A script that updates the metadata of all your [Pinboard](https://pinboard.io) bookmarks.

## Usage

The script requires an environment variable including your [Pinboard API key](https://www.pinboard.in/settings/password).

```bash
PINBOARD_API_KEY=user:1234567890abcdefg ./src/pinboard-updater
```

You can also provide an ISO8601 formatted date representing your last run.

```bash
PINBOARD_API_KEY=user:1234567890abcdefg PINBOARD_LAST_DATE="2021-04-15T00:00:00Z"./src/pinboard-updater
```

[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012.13-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v12.x/docs/api/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/jgornick/pinboard-updater/blob/master/LICENSE

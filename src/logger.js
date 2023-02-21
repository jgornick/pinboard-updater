const debug = require('debug')('pinboard-updater')
const { Logger } = require('tslog')

const { LOG_LEVEL } = process.env

const log = new Logger({
  minLevel: LOG_LEVEL || debug.enabled ? 'debug' : 'info',
  suppressStdOutput: true,
})

const logToStdOut = (logObject) => {
  log.printPrettyLog(process.stdout, logObject);
}

const logToDebug = (logObject) => {
  debug(...logObject.argumentsArray)
}

log.attachTransport(
  {
    silly: logToStdOut,
    debug: logToDebug,
    trace: logToStdOut,
    info: logToStdOut,
    warn: logToStdOut,
    error: logToStdOut,
    fatal: logToStdOut,
  },
  'debug'
)

module.exports = {
  log,
}



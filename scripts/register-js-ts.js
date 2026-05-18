const Module = require('module')
const orig = Module._resolveFilename
Module._resolveFilename = function (request, parent, ...args) {
  try {
    return orig.call(this, request, parent, ...args)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && request.endsWith('.js')) {
      return orig.call(this, request.slice(0, -3) + '.ts', parent, ...args)
    }
    throw err
  }
}

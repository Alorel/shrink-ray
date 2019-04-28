module.exports = getZopfliModule;

function getZopfliModule() {
    try {
      return require('node-zopfli-es');
    } catch (e) {
      process.emitWarning('Module "node-zopfli-es" was unavailable',
        {
          type: 'MISSING_MODULE',
          code: 'ZOPFLI_COMPAT',
          detail: 'Zopfli compression unavailable; will fall back to gzip.'
        }
      );
    }
  // Return a signal value instead of throwing an exception, so the code in the
  // index file doesn't have to try/catch again.
  return false;
}
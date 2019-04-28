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
  // Fall back to plain zlib.
  return require('zlib');
}
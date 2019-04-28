module.exports = getBrotliModule;

function getBrotliModule() {
  const zlib = require('zlib');

  if (typeof zlib.createBrotliCompress === 'function') {
    /**
     * Map an options object for `iltorb` into an options object for `brotli`.
     */
    const ILTORB_OPTION_NAMES_TO_BROTLI_PARAM_NAMES = {
      mode: zlib.constants.BROTLI_PARAM_MODE,
      quality: zlib.constants.BROTLI_PARAM_QUALITY,
      lgwin: zlib.constants.BROTLI_PARAM_LGWIN,
      lgblock: zlib.constants.BROTLI_PARAM_LGBLOCK,
      disable_literal_context_modeling:  
        zlib.constants.BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING,
      large_window: zlib.constants.BROTLI_PARAM_LARGE_WINDOW
    };
    const iltorbOptionsToNodeZlibBrotliOpts = iltorbOpts => {
      if (!iltorbOpts) return iltorbOpts;
      const params = {};
      Object.keys(iltorbOpts).forEach(key => {
        if (ILTORB_OPTION_NAMES_TO_BROTLI_PARAM_NAMES.hasOwnProperty(key)) {
          params[ILTORB_OPTION_NAMES_TO_BROTLI_PARAM_NAMES[key]] = iltorbOpts[
            key
          ];
        }
      });
      return { params };
    }

    /**
     * Replicate the 'iltorb' interface for backwards compatibility.
     */
    return {
      compressStream: opts => zlib.createBrotliCompress(
        iltorbOptionsToNodeZlibBrotliOpts(opts)
      ),
      decompressStream: opts => zlib.createBrotliDecompress(
        iltorbOptionsToNodeZlibBrotliOpts(opts)
      )
    };

  }
  
  // If we get here, then our NodeJS does not support brotli natively.
  try {
    return require('iltorb');
  } catch (e) {
    process.emitWarning('Module "iltorb" was unavailable.',
      {
        type: 'MISSING_MODULE',
        code: 'BROTLI_COMPAT',
        detail: 'Brotli compression unavailable; will fall back to gzip.'
      }
    );
  }
  
  // Return a signal value instead of throwing an exception, so the code in the
  // index file doesn't have to try/catch again.
  return false;
}
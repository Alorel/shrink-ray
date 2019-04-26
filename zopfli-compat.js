module.exports = getZopfliModule;

function getZopfliModule() {
    try {
      return require('node-zopfli-es');
    } catch (e) {
      console.warn(
        `Cannot use zopfli compression:
        "require('node-zopfli-es')" threw this error:`,
        e
      );
    }
  return false;
}
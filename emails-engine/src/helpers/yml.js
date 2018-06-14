var YML = require('js-yaml');
module.exports = function(object) {
  return YML.safeDump(object);
};
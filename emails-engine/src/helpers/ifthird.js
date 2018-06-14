module.exports = function (index, options) {
  if (index % 3 == 0 && index !=0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
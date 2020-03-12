module.exports = function hash(str) {
  return str
    .split("")
    .reduce(function(hash, c) {
      return ((hash << 5) - hash + c.charCodeAt(0)) | 0;
    }, 0)
    .toString();
};

const gradient = require("gradient-string");

function welcome() {
  const logo = gradient.pastel("CommitPal ✨\n");

  console.log(logo);
}

module.exports = welcome;

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const chalk = require("chalk");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

function getConfig(path) {
  if (!hasFile(path)) {
    throw `${chalk.red("Error:")} ${chalk.bgRed(path)} ${chalk.red(
      "not found"
    )}`;
  }

  return readFile(path).then(rawdata => JSON.parse(rawdata));
}

function hasFile(path) {
  try {
    return fs.existsSync(path);
  } catch (error) {
    return false;
  }
}

module.exports = {
  getConfig,
  hasFile
};

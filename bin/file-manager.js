#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const findConfig = require("find-config");

function getConfig(path = "commitpal.config.json") {
  if (!hasFile(path)) {
    throw new Error(
      `${chalk.red("Error:")} ${chalk.bgRed(path)} ${chalk.red("not found")}\n`
    );
  }

  const configRaw = findConfig.read(path);

  return JSON.parse(configRaw);
}

function hasFile(path) {
  try {
    return findConfig(path);
  } catch (error) {
    return false;
  }
}

module.exports = {
  getConfig,
  hasFile
};

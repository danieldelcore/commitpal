#!/usr/bin/env node
"use strict";

const { prompt, Input, AutoComplete } = require("enquirer");
const meow = require("meow");
const findConfig = require("find-config");

const welcome = require("./welcome");
const { getConfig, hasFile } = require("./file-manager");

function getStepPrompt(step) {
  switch (step.type) {
    case "option":
      return new AutoComplete({
        name: "step",
        message: step.message,
        choices: step.options.map(option => option.description)
      })
        .run()
        .then(choice => {
          const result = step.options.find(
            option => option.description === choice
          );

          return result.value;
        });
    case "text":
      return new Input({
        message: step.message,
        initial: step.initial
      })
        .run()
        .then(choice => choice || "");
    default:
      throw `${chalk.red("Error: option type:")} ${chalk.bgRed(
        step.type
      )} ${chalk.red("not found")}`;
  }
}

function getPreset(preset) {
  switch (preset) {
    case "angular":
      return `${__dirname}/presets/angular.json`;
    case "emoji":
      return `${__dirname}/presets/emoji.json`;
    default:
      throw `${chalk.red("Error: ")} ${chalk.bgRed(preset)} ${chalk.red(
        "is not a preset"
      )}`;
      break;
  }
}

async function main(input, flags) {
  if (!flags.nowelcome) {
    welcome();
  }

  try {
    const configPath = flags.config
      ? flags.config
      : findConfig(`commitpal.config.json`);
    const presetPath = flags.preset ? getPreset(flags.preset) : undefined;

    const config = await getConfig(presetPath || configPath);

    const commitMessage = await config.steps.reduce(async (accum, step) => {
      const message = await accum;
      const prompt = getStepPrompt(step);
      const result = await prompt;

      return `${message}${step.before || ""}${result}${step.after || ""}`;
    }, "");

    // execute git commit. Maybe using: https://www.npmjs.com/package/simple-git

    console.log("OUTPUT:", commitMessage);
  } catch (error) {
    if (error) {
      console.error(error, "🙅‍♂️");
      return 1;
    }

    return 0;
  }
}

const cli = meow(
  `
  Usage
    $ commitpal

  Options
    --config, -c Custom configuration file
    --preset, -p Select an inbuilt preset. Options: 'angular', 'emoji'
    --nowelcome, -n  Omit welcome message
    --help  Help me
    --version, -v  Version number

  Examples
    $ commitpal --config ../commitpal.config.json
    $ commitpal --nowelcome
    $ commitpal --preset emoji
    $ npx commitpal
`,
  {
    flags: {
      nowelcome: {
        type: "boolean",
        alias: "n"
      },
      config: {
        type: "string",
        alias: "c"
      },
      preset: {
        type: "string",
        alias: "p"
      }
    }
  }
);

main(cli.input[0], cli.flags);

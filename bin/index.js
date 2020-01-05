#!/usr/bin/env node
"use strict";

const { prompt, Input, AutoComplete } = require("enquirer");
const meow = require("meow");
const chalk = require("chalk");
const simpleGit = require("simple-git/promise");

const presets = require("./presets");
const welcome = require("./welcome");
const { getConfig, hasFile } = require("./file-manager");

const git = simpleGit().outputHandler((command, stdout, stderr) => {
  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
});

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

async function main(input, flags) {
  if (!flags.nowelcome) welcome();

  const preset = flags.preset ? presets[flags.preset] : undefined;

  if (!preset && flags.preset) {
    throw new Error(
      `${chalk.bgRed(flags.preset)} ${chalk.red(
        "is not a valid preset."
      )} Available presets: ${Object.keys(presets).join(', ')}.\n`
    );

    return 1;
  }

  const config = preset ? preset : getConfig(flags.config);

  const message = await config.steps.reduce(async (accum, step) => {
    const message = await accum;
    const prompt = getStepPrompt(step);
    const result = await prompt;

    return `${message}${step.before || ""}${result}${step.after || ""}`;
  }, "");

  await git.commit(message);
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

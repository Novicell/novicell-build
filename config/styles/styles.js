#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const argv = require('yargs').argv;
let settings = require('../../config');

// Look for local config
if (argv.config) {
    const contents = fs.readFileSync(argv.config, 'utf8');
    settings = JSON.parse(contents);
}

const options = {
    in: `${settings.mainSettings.sourceRootFolder}*.css`,
    out: `${settings.mainSettings.dist}css`,
    config: settings.mainSettings.cssConfig,
};

// Check if folder exists, or create it
if (!fs.existsSync(options.out)){
    fs.mkdirSync(options.out, { recursive: true });
}

// for debugging
console.log(`postcss ${options.in} --dir ${options.out} --ext min.css --config ${options.config}`);

exec(`postcss ${options.in} --dir ${options.out} --ext min.css --config ${options.config}`, (err, stdout, stderr) => {
  if (err) {
    console.log(`node couldn't execute the command: ${err}`);
    return;
  }
});
#!/usr/bin/env node
const { resolve } = require('path');
const program = require('commander');
const { version } = require(resolve(__dirname, '../package.json'));
const commands = require(resolve(__dirname, '../dist/index.js'));

program.version(version);

program.usage('<command>');

program
  .command('mh')
  .description('兑换礼包码')
  .action(commands.mh);

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}

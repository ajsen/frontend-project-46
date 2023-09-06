#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .option('-v, --version', 'shows version');

program.parse();

const options = program.opts();
const version = '0.0.1';
if (options.version) {
  console.log(version);
}

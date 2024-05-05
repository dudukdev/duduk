#!/usr/bin/env node
import {build} from "./build";
import {printHelp} from "./help";
import {printVersion} from "./version";

const [,, ...args] = process.argv

if (args.includes('--help') || args.includes('-h')) {
  await printHelp();
} else {
  switch (args[0]) {
    case 'build':
      await build(args[1] === '--watch');
      break;
    case 'version':
    case '--version':
    case '-v':
      await printVersion();
      break;
    default:
      await printHelp();
  }
}



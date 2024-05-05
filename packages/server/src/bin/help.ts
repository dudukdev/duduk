import {getVersion} from "./version";

export async function printHelp(): Promise<void> {
  console.log(`Duduk ${await getVersion()}

Usage:
  duduk [options]

Options:
  build                    Bundle the Duduk app
    --watch, -w              Watch for changes and rebuild

  version, --version, -v   Show the version of Duduk
`);
}

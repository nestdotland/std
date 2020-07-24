import * as semver from "https://deno.land/x/semver@v1.0.0/mod.ts";
import {
  writeJson,
} from "https://deno.land/std@0.61.0/fs/mod.ts";

import { VERSION } from "https://denopkg.com/denoland/deno/std/version.ts";

const nestAPI = "https://x.nest.land/api/package/std";

const egg: any = await fetch(nestAPI)
  .then((response) => response.json())
  .then((data) => {
    return semver.clean(data.latestVersion.replace("std@", ""));
  });

console.log("nest.land: ", egg);
console.log("deno.land: ", VERSION);

const diff: number = semver.compare(egg, VERSION);

const config: object = {
  "name": "std",
  "description": "A decentralized mirror of Deno's Standard Modules",
  "version": VERSION,
  "entry": "./version.ts",
  "stable": false,
  "unlisted": true,
  "fmt": false,
  "repository": "https://github.com/nestdotland/std",
  "files": [
    "./**/*",
    "./README.md",
  ],
};

if (diff === 0) {
  // this ain't it chief!
  console.log(`std@${egg} is already published`);
  Deno.exit(0);
} else if (diff === 1) {
  // that's illegal!
  console.log(
    "\n\t[ERR]: I don't know how, but we are ahead of deno\n",
  );
  Deno.exit(1);
} else if (diff === -1) {
  console.log("New version found!\nCreating config...");
  await writeJson("egg.json", config, { spaces: 2 });
  console.log(`Publishing std@${VERSION}...`);
  Deno.run({
    cmd: [
      "deno",
      "run",
      "-A",
      "--unstable",
      "https://denopkg.com/nestdotland/eggs/mod.ts",
      "publish",
    ],
    stdout: "piped"
  });
  Deno.exit(0);
}

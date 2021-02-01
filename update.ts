import * as semver from "https://deno.land/x/semver@v1.0.0/mod.ts";
import { writeJson } from "https://x.nest.land/std@0.62.0/fs/mod.ts";

import { VERSION } from "https://github.com/denoland/deno_std/raw/main/version.ts";

const nestAPI = "https://x.nest.land/api/package/std";

const egg: any = await fetch(nestAPI)
  .then((response) => response.json())
  .then((data) => {
    return data.packageUploadNames
      .sort((v1: string, v2: string) => {
        return semver.rcompare(v1.replace("std@", ""), v2.replace("std@", ""));
      })[0]
      .replace("std@", "");
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
  // wait, that's illegal!
  console.error(
    "\n\t[ERR]: I don't know how, but we are ahead of deno\n",
  );
  Deno.exit(1);
} else if (diff === -1) {
  console.log("New version found!\nCreating config...");
  await writeJson("egg.json", config, { spaces: 2 });
  console.log(`Publishing std@${VERSION}...`);
  Deno.run({
    cmd: [
      "eggs",
      "publish",
      "--no-check",
      "--yes",
    ]
  });
  Deno.exit(0);
}

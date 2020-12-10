// import * as semver from "https://deno.land/x/semver@v1.0.0/mod.ts";
import { writeJson } from "https://x.nest.land/std@0.62.0/fs/mod.ts";

// import { VERSION } from "https://github.com/denoland/deno/raw/master/std/version.ts";

const VERSION: string = String(Deno.args[0])

// const nestAPI = "https://x.nest.land/api/package/std";

// const egg: any = await fetch(nestAPI)
//   .then((response) => response.json())
//   .then((data) => {
//     return semver.clean(data.latestVersion.replace("std@", ""));
//   });

// console.log("nest.land: ", egg);
console.log("deno.land: ", VERSION);

// const diff: number = semver.compare(egg, VERSION);

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

// if (diff === 0) {
//   // this ain't it chief!
//   // console.log(`std@${egg} is already published`);
//   Deno.exit(0);
// } else {
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
// }

import { readdir, writeFile } from "fs/promises";
import { resolve } from "path";

import find from "./find";

async function main() {
  const files = (await readdir(resolve("input"))).filter((p) =>
    p.endsWith(".srt"),
  );

  const matches: Record<string, number[]> = {};
  const promises: Promise<any>[] = [];

  for (const file of files) {
    const id = file.substr(0, 11);
    promises.push(
      find(resolve("input", file), /oldest anarchy/gi).then((match) => {
        if (match.length > 0) matches[id] = match;
      }),
    );
  }

  await Promise.all(promises);
  await writeFile(resolve("output.json"), JSON.stringify(matches));
}
main().then(() => console.log("OK"));

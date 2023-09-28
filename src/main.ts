import fs from "node:fs"

import { File } from "./schema.js";
import { interpretate } from "./interpreter.js";
// import { transpile } from "./transpiler.js";

const file_content = fs.readFileSync("/var/rinha/source.rinha.json", { encoding: "utf-8" })
const file_json: File = JSON.parse(file_content)
interpretate(file_json)
// transpile(file_json)

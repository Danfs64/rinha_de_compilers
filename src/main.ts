import fs from "node:fs"

import { interpretate } from "./interpreter.js";
import { File } from "./schema.js";

const file_content = fs.readFileSync("./examples/fib.json", { encoding: "utf-8" })
const file_json: File = JSON.parse(file_content)
interpretate(file_json)

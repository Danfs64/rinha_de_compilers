import fs from "node:fs"

import { File } from "./schema.js";

const file_content = fs.readFileSync("./examples/sum.json", { encoding: "utf-8" })
const file_json: File = JSON.parse(file_content)
console.log(file_json)

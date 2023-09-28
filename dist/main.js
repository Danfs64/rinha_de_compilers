import fs from "node:fs";
import { interpretate } from "./interpreter.js";
// import { transpile } from "./transpiler.js";
const file_content = fs.readFileSync("/var/rinha/source.rinha.json", { encoding: "utf-8" });
const file_json = JSON.parse(file_content);
interpretate(file_json);
// transpile(file_json)
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd4QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDaEQsK0NBQStDO0FBRS9DLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtBQUMzRixNQUFNLFNBQVMsR0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ2hELFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN2Qix1QkFBdUIifQ==
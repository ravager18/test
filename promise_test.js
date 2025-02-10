import * as fsPromises from "node:fs/promises";
const result1 = await Promise.all([fsPromises.readFile("index.js", { encoding: "utf-8" }), fsPromises.readFile("index2.js", { encoding: "utf-8" })]);
console.log(result1);
const result3 = await fsPromises.readFile("math.js", { encoding: "utf-8" });
console.log(result3);

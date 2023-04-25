import fs from "fs";

const defaultConfig = JSON.parse(fs.readFileSync('config/default.json').toString())
const environmentConfig = JSON.parse(fs.readFileSync(`config/test.json`).toString())

export const config  = { ...defaultConfig, ...environmentConfig }

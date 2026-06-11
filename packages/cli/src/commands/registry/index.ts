import { Command } from "commander";
import { add } from "./add.js";
import { build } from "./build.js";
import { mcp } from "./mcp.js";
import { validate } from "./validate.js";

export const registry = new Command()
	.command("registry")
	.addCommand(add)
	.addCommand(build)
	.addCommand(mcp)
	.addCommand(validate);

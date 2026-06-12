import process from "node:process";
import { Command } from "commander";
import { CLI_COMMAND_NAME } from "../../constants.js";

export const mcp = new Command()
	.command("mcp")
	.description("start the registry MCP server [deprecated]")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.action(() => {
		console.warn(
			`The ${CLI_COMMAND_NAME} registry mcp command is deprecated. Use ${CLI_COMMAND_NAME} mcp instead.`
		);
	});

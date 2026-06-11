import process from "node:process";
import { Command } from "commander";

export const mcp = new Command()
	.command("mcp")
	.description("start the registry MCP server [deprecated]")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.action(() => {
		console.warn(
			"The shadcn-svelte registry mcp command is deprecated. Use shadcn-svelte mcp instead."
		);
	});

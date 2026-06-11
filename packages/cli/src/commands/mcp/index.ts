import path from "node:path";
import process from "node:process";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Command } from "commander";
import { z } from "zod";
import { createMcpServer } from "../../mcp/index.js";
import { handleError } from "../../utils/prompt-helpers.js";

const mcpOptionsSchema = z.object({
	cwd: z.string(),
});

export const mcp = new Command()
	.command("mcp")
	.description("start the MCP server")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.action(async (opts) => {
		try {
			const options = mcpOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});
			process.chdir(options.cwd);

			const server = createMcpServer({ cwd: options.cwd });
			const transport = new StdioServerTransport();
			await server.connect(transport);
		} catch (cause) {
			handleError(cause);
		}
	});

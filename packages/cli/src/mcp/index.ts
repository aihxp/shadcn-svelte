import process from "node:process";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { callMcpTool, listMcpTools } from "./tools.js";
import { CLI_COMMAND_NAME } from "../constants.js";

export function createMcpServer(options: { cwd?: string } = {}) {
	const server = new Server(
		{
			name: CLI_COMMAND_NAME,
			version: "0.1.0",
		},
		{
			capabilities: {
				tools: {},
			},
		}
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => ({
		tools: listMcpTools(),
	}));

	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		return callMcpTool(
			request.params.name,
			request.params.arguments ?? {},
			options.cwd ?? process.cwd()
		);
	});

	return server;
}

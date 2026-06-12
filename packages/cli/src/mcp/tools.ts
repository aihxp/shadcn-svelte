import path from "node:path";
import process from "node:process";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { detect } from "package-manager-detector";
import { CLI_PACKAGE_NAME } from "../constants.js";
import { z } from "zod";
import { runDocs } from "../commands/docs/index.js";
import { runInfo } from "../commands/info/index.js";
import { runSearch } from "../commands/search/index.js";
import { runView } from "../commands/view/index.js";
import * as cliConfig from "../utils/config/index.js";
import { SEARCHABLE_TYPES, type RegistryConfigContext } from "../utils/registry/index.js";

const cwdSchema = z.string().optional().describe("Working directory for the project.");
const registryListSchema = z
	.array(z.string())
	.optional()
	.describe(
		"Registry names, URLs, or GitHub registry sources. Omit to use registries from components.json, falling back to @shadcn."
	);
const itemListSchema = z.array(z.string()).min(1).describe("Registry item names or addresses.");
const typeFilterSchema = z
	.array(z.string())
	.optional()
	.describe(`Filter by item type. Valid types: ${SEARCHABLE_TYPES.join(", ")}.`);

const toolSchemas = {
	get_project_info: z.object({
		cwd: cwdSchema,
	}),
	get_project_registries: z.object({
		cwd: cwdSchema,
	}),
	get_init_command: z.object({
		cwd: cwdSchema,
	}),
	list_items_in_registries: z.object({
		registries: registryListSchema,
		types: typeFilterSchema,
		limit: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe("Maximum number of items to return. Use 0 for no limit."),
		offset: z.number().int().min(0).optional().describe("Number of items to skip."),
		cwd: cwdSchema,
	}),
	search_items_in_registries: z.object({
		registries: registryListSchema,
		query: z.string().describe("Search query to match against item names and descriptions."),
		types: typeFilterSchema,
		limit: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe("Maximum number of items to return. Use 0 for no limit."),
		offset: z.number().int().min(0).optional().describe("Number of items to skip."),
		cwd: cwdSchema,
	}),
	view_items_in_registries: z.object({
		items: itemListSchema,
		cwd: cwdSchema,
	}),
	get_component_docs: z.object({
		components: z.array(z.string()).min(1).describe("Component names to look up."),
		cwd: cwdSchema,
	}),
	get_add_command_for_items: z.object({
		items: itemListSchema,
		cwd: cwdSchema,
	}),
	get_audit_checklist: z.object({}),
};

type ToolName = keyof typeof toolSchemas;

type ToolDefinition = {
	name: ToolName;
	description: string;
	inputSchema: Tool["inputSchema"];
};

type ToolResult = {
	content: Array<{ type: "text"; text: string }>;
	isError?: boolean;
};

const toolDescriptions: Record<ToolName, string> = {
	get_project_info:
		"Inspect project setup, components.json, configured registries, resolved paths, and installed components.",
	get_project_registries: "Get the default registry and namespace registries configured in components.json.",
	get_init_command: "Return the shadcn-svelte-lab init command for the current package manager.",
	list_items_in_registries:
		"List registry items from configured namespaces, explicit namespaces, URLs, or GitHub registry sources.",
	search_items_in_registries:
		"Search registry items by name and description across configured namespaces, explicit namespaces, URLs, or GitHub registry sources.",
	view_items_in_registries:
		"View full registry item JSON for one or more components, blocks, hooks, files, URLs, or GitHub registry items.",
	get_component_docs: "Get docs, registry item, registry index, and llms.txt links for components.",
	get_add_command_for_items: "Return the shadcn-svelte-lab add command for one or more registry items.",
	get_audit_checklist:
		"Return a short checklist to run after adding or generating components and registry files.",
};

export function listMcpTools(): ToolDefinition[] {
	return (Object.keys(toolSchemas) as ToolName[]).map((name) => ({
		name,
		description: toolDescriptions[name],
		inputSchema: z.toJSONSchema(toolSchemas[name]) as Tool["inputSchema"],
	}));
}

export async function callMcpTool(
	name: string,
	args: unknown,
	requestCwd = process.cwd()
): Promise<ToolResult> {
	try {
		if (!isToolName(name)) {
			throw new Error(`Tool "${name}" does not exist.`);
		}

		switch (name) {
			case "get_project_info": {
				const parsedArgs = toolSchemas.get_project_info.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				const info = await runInfo({ cwd, json: true });
				return textResult(json(info));
			}

			case "get_project_registries": {
				const parsedArgs = toolSchemas.get_project_registries.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				return textResult(json(getProjectRegistries(cwd)));
			}

			case "get_init_command": {
				const parsedArgs = toolSchemas.get_init_command.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				return textResult(await getShadcnCommand("init", cwd));
			}

			case "list_items_in_registries": {
				const parsedArgs = toolSchemas.list_items_in_registries.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				const results = await runSearch(parsedArgs.registries ?? [], {
					cwd,
					types: parsedArgs.types?.join(","),
					limit: normalizeLimit(parsedArgs.limit),
					offset: parsedArgs.offset,
					json: true,
				});
				return textResult(json(results));
			}

			case "search_items_in_registries": {
				const parsedArgs = toolSchemas.search_items_in_registries.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				const results = await runSearch(parsedArgs.registries ?? [], {
					cwd,
					query: parsedArgs.query,
					types: parsedArgs.types?.join(","),
					limit: normalizeLimit(parsedArgs.limit),
					offset: parsedArgs.offset,
					json: true,
				});
				return textResult(json(results));
			}

			case "view_items_in_registries": {
				const parsedArgs = toolSchemas.view_items_in_registries.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				const items = await runView(parsedArgs.items, { cwd });
				return textResult(json(items));
			}

			case "get_component_docs": {
				const parsedArgs = toolSchemas.get_component_docs.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				const docs = await runDocs(parsedArgs.components, { cwd, json: true });
				return textResult(json(docs));
			}

			case "get_add_command_for_items": {
				const parsedArgs = toolSchemas.get_add_command_for_items.parse(args ?? {});
				const cwd = resolveCwd(parsedArgs.cwd, requestCwd);
				return textResult(await getShadcnCommand(`add ${parsedArgs.items.join(" ")}`, cwd));
			}

			case "get_audit_checklist":
				return textResult(
					[
						"Component audit checklist:",
						"- Verify dependencies were installed.",
						"- Run the project type check.",
						"- Run the project test suite when available.",
						"- Inspect generated imports and aliases.",
						"- Smoke test affected component states in the browser.",
					].join("\n")
				);
		}
	} catch (cause) {
		return {
			content: [{ type: "text", text: formatToolError(cause) }],
			isError: true,
		};
	}
}

function isToolName(name: string): name is ToolName {
	return Object.hasOwn(toolSchemas, name);
}

function getProjectRegistries(cwd: string) {
	const rawConfig = cliConfig.loadConfig(cwd);
	const config: RegistryConfigContext = {
		registry: rawConfig?.registry ?? cliConfig.DEFAULT_CONFIG.registry,
		registries: rawConfig?.registries,
		style: rawConfig?.style ?? cliConfig.DEFAULT_CONFIG.style,
	};

	return {
		registry: config.registry,
		style: config.style,
		registries: Object.fromEntries(
			Object.entries(config.registries ?? {}).map(([name, value]) => [
				name,
				typeof value === "string" ? value : value.url,
			])
		),
	};
}

async function getShadcnCommand(command: string, cwd: string) {
	const runner = await getPackageRunner(cwd);
	return `${runner} ${CLI_PACKAGE_NAME}@latest ${command}`;
}

async function getPackageRunner(cwd: string) {
	const detected = await detect({ cwd });

	switch (detected?.agent) {
		case "pnpm":
			return "pnpm dlx";
		case "bun":
			return "bunx";
		case "yarn":
			return "yarn dlx";
		case "npm":
		default:
			return "npx";
	}
}

function resolveCwd(cwd: string | undefined, requestCwd: string) {
	return path.resolve(cwd ?? requestCwd);
}

function normalizeLimit(limit: number | undefined) {
	return limit === 0 ? undefined : limit;
}

function json(value: unknown) {
	return JSON.stringify(value, null, 2);
}

function textResult(text: string): ToolResult {
	return {
		content: [{ type: "text", text }],
	};
}

function formatToolError(cause: unknown) {
	if (cause instanceof z.ZodError) {
		return [
			"Invalid input parameters:",
			...cause.issues.map((issue) => `- ${issue.path.join(".") || "(root)"}: ${issue.message}`),
		].join("\n");
	}

	if (cause instanceof Error) {
		return cause.message;
	}

	return String(cause);
}

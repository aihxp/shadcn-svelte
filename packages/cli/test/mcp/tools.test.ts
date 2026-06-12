import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetch } from "node-fetch-native";
import { callMcpTool, listMcpTools } from "../../src/mcp/tools";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("mcp tools", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists the registry and project tools", () => {
		expect(listMcpTools().map((tool) => tool.name)).toEqual([
			"get_project_info",
			"get_project_registries",
			"get_init_command",
			"list_items_in_registries",
			"search_items_in_registries",
			"view_items_in_registries",
			"get_component_docs",
			"get_add_command_for_items",
			"get_audit_checklist",
		]);
	});

	it("searches registry items", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () =>
				Promise.resolve([
					{
						name: "button",
						title: "Button",
						type: "registry:ui",
						description: "A button component",
						relativeUrl: "button.json",
					},
					{
						name: "dashboard",
						title: "Dashboard",
						type: "registry:block",
						description: "A dashboard block",
						relativeUrl: "dashboard.json",
					},
				]),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const result = await callMcpTool("search_items_in_registries", {
			cwd: path.resolve(__dirname, "../fixtures/config-full"),
			registries: ["@shadcn"],
			query: "button",
			types: ["ui"],
			limit: 100,
			offset: 0,
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(getText(result)).items).toEqual([
			{
				name: "button",
				type: "registry:ui",
				description: "A button component",
				registry: "@shadcn",
				addCommandArgument: "@shadcn/button",
			},
		]);
	});

	it("views registry items", async () => {
		const item = {
			name: "button",
			title: "Button",
			type: "registry:ui",
			files: [
				{
					type: "registry:ui",
					target: "button/button.svelte",
					content: "<button />",
				},
			],
		} as const;
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () => Promise.resolve(item),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const result = await callMcpTool("view_items_in_registries", {
			cwd: path.resolve(__dirname, "../fixtures/config-full"),
			items: ["https://example.com/registry/button.json"],
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(getText(result))).toEqual([item]);
	});

	it("returns docs links", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () =>
				Promise.resolve([
					{
						name: "button",
						type: "registry:ui",
						relativeUrl: "button.json",
					},
				]),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const result = await callMcpTool("get_component_docs", {
			cwd: path.resolve(__dirname, "../fixtures/config-vite"),
			components: ["button"],
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(getText(result)).results[0].links.documentation).toBe(
			"https://shadcn-svelte.com/docs/components/button"
		);
	});

	it("returns add commands", async () => {
		const result = await callMcpTool("get_add_command_for_items", {
			cwd: path.resolve(__dirname, "../fixtures/config-vite"),
			items: ["@shadcn/button"],
		});

		expect(result.isError).toBeUndefined();
		expect(getText(result)).toContain("@aihxp/shadcn-svelte-lab@latest add @shadcn/button");
	});

	it("returns tool errors without throwing", async () => {
		const result = await callMcpTool("search_items_in_registries", {
			cwd: path.resolve(__dirname, "../fixtures/config-full"),
			registries: ["@shadcn"],
			query: "button",
			types: ["not-real"],
		});

		expect(result.isError).toBe(true);
		expect(getText(result)).toContain("Unknown type: not-real");
		expect(fetch).not.toHaveBeenCalled();
	});
});

function getText(result: Awaited<ReturnType<typeof callMcpTool>>) {
	return result.content[0]?.text ?? "";
}

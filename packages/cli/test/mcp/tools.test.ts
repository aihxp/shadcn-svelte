import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetch } from "node-fetch-native";
import { callMcpTool, listMcpTools } from "../../src/mcp/tools";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

const cwd = path.resolve(__dirname, "../fixtures/config-full");

describe("mcp tools", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists registry agent tools", () => {
		const toolNames = listMcpTools().map((tool) => tool.name);

		expect(toolNames).toEqual(
			expect.arrayContaining([
				"get_project_info",
				"get_project_registries",
				"get_init_command",
				"list_items_in_registries",
				"search_items_in_registries",
				"view_items_in_registries",
				"get_component_docs",
				"get_add_command_for_items",
				"get_audit_checklist",
			])
		);
	});

	it("returns add commands for items", async () => {
		const result = await callMcpTool("get_add_command_for_items", {
			items: ["button", "@acme/editor"],
			cwd,
		});

		expect(result.isError).toBeUndefined();
		expect(result.content[0]?.text).toContain(
			"shadcn-svelte@latest add button @acme/editor"
		);
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
				]),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const result = await callMcpTool("search_items_in_registries", {
			query: "button",
			types: ["ui"],
			cwd,
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(result.content[0]!.text)).toMatchObject({
			items: [
				{
					name: "button",
					registry: "@shadcn",
					addCommandArgument: "@shadcn/button",
				},
			],
		});
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
			items: ["https://example.com/registry/button.json"],
			cwd,
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(result.content[0]!.text)).toEqual([item]);
	});

	it("returns component docs links", async () => {
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
			components: ["button"],
			cwd,
		});

		expect(result.isError).toBeUndefined();
		expect(JSON.parse(result.content[0]!.text)).toMatchObject({
			results: [
				{
					component: "button",
					links: {
						documentation: "https://shadcn-svelte.com/docs/components/button",
					},
				},
			],
		});
	});
});

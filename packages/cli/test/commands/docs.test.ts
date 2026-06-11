import path from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetch } from "node-fetch-native";
import { runDocs } from "../../src/commands/docs";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("docs command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns docs links for registry components", async () => {
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

		const result = await runDocs(["button"], {
			cwd: path.resolve(__dirname, "../fixtures/config-vite"),
			json: true,
		});

		expect(result.results).toEqual([
			{
				component: "button",
				type: "registry:ui",
				links: {
					documentation: "https://shadcn-svelte.com/docs/components/button",
					registryItem: "https://shadcn-svelte.com/registry/styles/nova/button.json",
					registryIndex: "https://shadcn-svelte.com/registry/styles/nova/index.json",
					llms: "https://shadcn-svelte.com/llms.txt",
				},
			},
		]);
	});

	it("throws when a component is missing", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () => Promise.resolve([]),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		await expect(
			runDocs(["not-real"], {
				cwd: path.resolve(__dirname, "../fixtures/config-vite"),
				json: true,
			})
		).rejects.toThrow('Component "not-real" does not exist');
	});
});

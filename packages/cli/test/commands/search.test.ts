import path from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetch } from "node-fetch-native";
import { runSearch } from "../../src/commands/search";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("search command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("searches the official registry when no registries are configured", async () => {
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

		const results = await runSearch([], {
			cwd: path.resolve(__dirname, "../fixtures/config-full"),
			query: "button",
			types: "ui",
			limit: 100,
			offset: 0,
			json: false,
		});

		expect(results.items).toEqual([
			{
				name: "button",
				type: "registry:ui",
				description: "A button component",
				registry: "@shadcn",
				addCommandArgument: "@shadcn/button",
			},
		]);
		expect(fetch).toHaveBeenCalledWith(expect.any(URL), {});
	});

	it("rejects unknown item types before fetching", async () => {
		await expect(
			runSearch(["@shadcn"], {
				cwd: path.resolve(__dirname, "../fixtures/config-full"),
				types: "not-real",
				limit: 100,
				offset: 0,
				json: false,
			})
		).rejects.toThrow("Unknown type: not-real");

		expect(fetch).not.toHaveBeenCalled();
	});
});

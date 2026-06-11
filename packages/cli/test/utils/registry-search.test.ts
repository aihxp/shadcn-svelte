import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetch } from "node-fetch-native";
import {
	buildRegistryItemNameFromRegistry,
	findUnknownSearchTypes,
	searchRegistries,
} from "../../src/utils/registry/search.js";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("Registry search", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("searches configured registry catalogs", async () => {
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () =>
				Promise.resolve({
					name: "acme",
					homepage: "https://acme.test",
					items: [
						{
							name: "button",
							type: "registry:ui",
							description: "A button component",
						},
						{
							name: "dashboard",
							type: "registry:block",
							description: "A dashboard block",
						},
					],
				}),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const results = await searchRegistries(["@acme"], {
			query: "button",
			types: ["ui"],
			config: {
				registries: {
					"@acme": "https://acme.test/r/{name}.json",
				},
			},
		});

		expect(results.items).toEqual([
			{
				name: "button",
				type: "registry:ui",
				description: "A button component",
				registry: "@acme",
				addCommandArgument: "@acme/button",
			},
		]);
		expect(results.pagination).toEqual({
			total: 1,
			offset: 0,
			limit: 1,
			hasMore: false,
		});
	});

	it("collects registry errors when requested", async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

		const results = await searchRegistries(["@broken"], {
			continueOnError: true,
			config: {
				registries: {
					"@broken": "https://broken.test/r/{name}.json",
				},
			},
		});

		expect(results.items).toEqual([]);
		expect(results.errors?.[0]?.registry).toBe("@broken");
		expect(results.errors?.[0]?.message).toContain("Failed to fetch registry.");
	});

	it("builds add command arguments for GitHub registries", () => {
		expect(buildRegistryItemNameFromRegistry("button", "acme/ui#v1")).toBe(
			"acme/ui/button#v1"
		);
	});

	it("builds add command arguments for URL registry indexes", () => {
		expect(
			buildRegistryItemNameFromRegistry(
				"button",
				"http://127.0.0.1:8123/registry/index.json"
			)
		).toBe("http://127.0.0.1:8123/registry/button.json");
	});

	it("reports unknown search types", () => {
		expect(findUnknownSearchTypes(["ui", "registry:block", "not-real"])).toEqual([
			"not-real",
		]);
	});
});

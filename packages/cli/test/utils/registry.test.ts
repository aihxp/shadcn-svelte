import path from "node:path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetch } from "node-fetch-native";
import {
	getRegistryUrl,
	getRegistryIndex,
	getBaseColors,
	getRegistryTheme,
	resolveRegistryItems,
	getItemAliasDir,
	resolveItemFilePath,
	getRegistryCatalog,
	getRegistryItems,
} from "../../src/utils/registry/index.js";
import { toPosixPath } from "./test-helpers.js";
import type { ResolvedConfig } from "../../src/utils/config/index.js";
import type { RegistryItem, RegistryIndex } from "../../src/utils/registry/schema.js";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("Registry Utilities", () => {
	const cwd = "/path/to/cwd";
	const mockConfig: ResolvedConfig = {
		registry: "https://example.com/registry",
		resolvedPaths: {
			ui: path.posix.normalize(`${cwd}/ui`),
			hooks: path.posix.normalize(`${cwd}/hooks`),
			components: path.posix.normalize(`${cwd}/components`),
			cwd: path.posix.normalize(cwd),
			lib: path.posix.normalize(`${cwd}/lib`),
			utils: path.posix.normalize(`${cwd}/utils`),
		},
		sveltekit: true,
	} as ResolvedConfig;

	const mockRegistryIndex: RegistryIndex = [
		{
			name: "button",
			title: "Button",
			type: "registry:ui",
			relativeUrl: "button.json",
			registryDependencies: ["theme"],
			dependencies: [],
			devDependencies: [],
		},
		{
			name: "theme",
			title: "Theme",
			type: "registry:theme",
			relativeUrl: "theme.json",
			registryDependencies: [],
			dependencies: [],
			devDependencies: [],
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getRegistryUrl", () => {
		it("should return environment variable if set", () => {
			process.env.COMPONENTS_REGISTRY_URL = "https://custom.registry.com";
			expect(getRegistryUrl(mockConfig)).toBe("https://custom.registry.com");
			delete process.env.COMPONENTS_REGISTRY_URL;
		});

		it("should return environment variable with style if set", () => {
			process.env.REGISTRY_URL = "https://custom.registry.com";
			expect(
				getRegistryUrl({ registry: "https://example.com/registry", style: "vega" })
			).toBe("https://custom.registry.com/styles/vega");
			delete process.env.REGISTRY_URL;
		});

		it("should return config registry URL if no env var", () => {
			expect(getRegistryUrl(mockConfig)).toBe("https://example.com/registry/styles/vega");
		});

		it("should return config registry URL with style if no env var", () => {
			expect(
				getRegistryUrl({ registry: "https://example.com/registry", style: "nova" })
			).toBe("https://example.com/registry/styles/nova");
		});
	});

	describe("getRegistryIndex", () => {
		it("should fetch and parse registry index", async () => {
			const mockResponse = {
				json: () => Promise.resolve(mockRegistryIndex),
				ok: true,
				status: 200,
				statusText: "OK",
			};
			vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response);

			const result = await getRegistryIndex("https://example.com/registry");
			expect(result).toEqual(mockRegistryIndex);
			expect(fetch).toHaveBeenCalledWith(expect.any(URL), {});
		});

		it("should throw error on fetch failure", async () => {
			vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
			await expect(getRegistryIndex("https://example.com/registry")).rejects.toThrow(
				"Failed to fetch registry."
			);
		});
	});

	describe("getBaseColors", () => {
		it("should return array of base colors", () => {
			const colors = getBaseColors();
			expect(colors).toEqual([
				{ label: "Neutral", name: "neutral" },
				{ label: "Stone", name: "stone" },
				{ label: "Zinc", name: "zinc" },
				{ label: "Mauve", name: "mauve" },
				{ label: "Olive", name: "olive" },
				{ label: "Mist", name: "mist" },
				{ label: "Taupe", name: "taupe" },
			]);
		});
	});

	describe("getRegistryBaseColor", () => {
		it("should fetch and parse base color", async () => {
			const mockColorData = {
				cssVars: { light: {}, dark: {} },
			};
			const mockResponse = {
				json: () => Promise.resolve(mockColorData),
				ok: true,
				status: 200,
				statusText: "OK",
			};
			vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response);

			const result = await getRegistryTheme("https://example.com/registry", "slate");
			expect(result).toEqual(mockColorData);
			expect(fetch).toHaveBeenCalledWith(expect.any(URL), {});
		});

		it("should throw error on base color fetch failure", async () => {
			vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
			await expect(getRegistryTheme("https://example.com/registry", "slate")).rejects.toThrow(
				'Failed to fetch registry theme "slate" from https://example.com/registry/colors/slate.json.'
			);
		});

		it("should include the failing base color endpoint as error context", async () => {
			vi.mocked(fetch).mockResolvedValueOnce({
				json: () => Promise.resolve({}),
				ok: false,
				status: 404,
				statusText: "Not Found",
			} as Response);

			await expect(
				getRegistryTheme("https://example.com/registry", "slate")
			).rejects.toMatchObject({
				message:
					'Failed to fetch registry theme "slate" from https://example.com/registry/colors/slate.json.',
				cause: expect.objectContaining({
					message:
						"Failed to fetch registry from https://example.com/registry/colors/slate.json: 404 Not Found",
				}),
			});
		});

		it("should include the style path when fetching theme colors", async () => {
			vi.mocked(fetch).mockResolvedValueOnce({
				json: () => Promise.resolve({}),
				ok: false,
				status: 404,
				statusText: "Not Found",
			} as Response);

			await expect(
				getRegistryTheme("https://example.com/registry/styles/nova", "slate")
			).rejects.toMatchObject({
				message:
					'Failed to fetch registry theme "slate" from https://example.com/registry/styles/nova/colors/slate.json.',
				cause: expect.objectContaining({
					message:
						"Failed to fetch registry from https://example.com/registry/styles/nova/colors/slate.json: 404 Not Found",
				}),
			});
		});
	});

	describe("resolveRegistryItems", () => {
		const registryUrl = "https://shadcn-svelte.com/registry";

		it("should resolve items from registry index", async () => {
			const result = await resolveRegistryItems({
				registryUrl,
				registryIndex: mockRegistryIndex,
				items: ["button"],
			});

			expect(result).toHaveLength(2); // button + theme dependency
			expect(result[0]?.name).toBe("button");
			expect(result[1]?.name).toBe("theme");
		});

		it("should handle remote items", async () => {
			const mockRemoteItem: RegistryItem = {
				name: "remote-button",
				title: "Remote Button",
				type: "registry:ui",
				files: [],
			};
			const mockResponse = {
				json: () => Promise.resolve(mockRemoteItem),
				ok: true,
				status: 200,
				statusText: "OK",
			};
			vi.mocked(fetch).mockResolvedValueOnce(mockResponse as Response);

			const result = await resolveRegistryItems({
				registryUrl,
				registryIndex: mockRegistryIndex,
				items: ["https://remote.com/button.json"],
			});

			expect(result).toHaveLength(1);
			expect(result[0]?.name).toBe("remote-button");
		});

		it("should throw error on remote item fetch failure", async () => {
			vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
			await expect(
				resolveRegistryItems({
					registryUrl,
					registryIndex: mockRegistryIndex,
					items: ["https://remote.com/button.json"],
				})
			).rejects.toThrow("Failed to fetch registry.");
		});

		it("should show registry URL in error message when item not found", async () => {
			await expect(
				resolveRegistryItems({
					registryUrl: "https://custom-registry.com/registry",
					registryIndex: mockRegistryIndex,
					items: ["nonexistent-item"],
				})
			).rejects.toThrow(
				/Registry item 'nonexistent-item' does not exist in the registry at 'https:\/\/custom-registry\.com\/registry'/
			);
		});

		it("should suggest official registry URL when using custom registry", async () => {
			await expect(
				resolveRegistryItems({
					registryUrl: "https://custom-registry.com/registry",
					registryIndex: mockRegistryIndex,
					items: ["nonexistent-item"],
				})
			).rejects.toThrow(/https:\/\/shadcn-svelte\.com\/registry/);
		});

		it("should resolve namespaced items with registry auth headers", async () => {
			process.env.ACME_TOKEN = "secret";
			const namespacedItem: RegistryItem = {
				name: "calendar",
				title: "Calendar",
				type: "registry:ui",
				files: [],
				registryDependencies: ["@acme/theme"],
			};
			const namespacedTheme: RegistryItem = {
				name: "theme",
				title: "Theme",
				type: "registry:theme",
				files: [],
			};
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					json: () => Promise.resolve(namespacedItem),
					ok: true,
					status: 200,
					statusText: "OK",
				} as Response)
				.mockResolvedValueOnce({
					json: () => Promise.resolve(namespacedTheme),
					ok: true,
					status: 200,
					statusText: "OK",
				} as Response);

			const result = await resolveRegistryItems({
				registryUrl,
				registryIndex: mockRegistryIndex,
				items: ["@acme/calendar"],
				config: {
					style: "nova",
					registries: {
						"@acme": {
							url: "https://acme.test/r/{style}/{name}.json",
							params: {
								token: "${ACME_TOKEN}",
							},
							headers: {
								Authorization: "Bearer ${ACME_TOKEN}",
							},
						},
					},
				},
			});

			expect(result.map((item) => item.name)).toEqual(["calendar", "theme"]);
			expect(fetch).toHaveBeenNthCalledWith(
				1,
				"https://acme.test/r/nova/calendar.json?token=secret",
				{ headers: { Authorization: "Bearer secret" } }
			);
			expect(fetch).toHaveBeenNthCalledWith(
				2,
				"https://acme.test/r/nova/theme.json?token=secret",
				{ headers: { Authorization: "Bearer secret" } }
			);
			delete process.env.ACME_TOKEN;
		});

		it("should fail before fetching when registry auth env vars are missing", async () => {
			delete process.env.ACME_TOKEN;

			await expect(
				resolveRegistryItems({
					registryUrl,
					registryIndex: mockRegistryIndex,
					items: ["@acme/calendar"],
					config: {
						registries: {
							"@acme": {
								url: "https://acme.test/r/{name}.json",
								headers: {
									Authorization: "Bearer ${ACME_TOKEN}",
								},
							},
						},
					},
				})
			).rejects.toThrow("Missing environment variable ACME_TOKEN");

			expect(fetch).not.toHaveBeenCalled();
		});
	});

	describe("getRegistryCatalog", () => {
		it("should fetch namespaced registry catalogs", async () => {
			vi.mocked(fetch).mockResolvedValueOnce({
				json: () =>
					Promise.resolve({
						name: "acme",
						homepage: "https://acme.test",
						items: [
							{
								name: "button",
								type: "registry:ui",
								description: "A button",
							},
						],
					}),
				ok: true,
				status: 200,
				statusText: "OK",
			} as Response);

			const result = await getRegistryCatalog("@acme", {
				config: {
					registries: {
						"@acme": "https://acme.test/r/{name}.json",
					},
				},
			});

			expect(result.items.map((item) => item.name)).toEqual(["button"]);
			expect(fetch).toHaveBeenCalledWith("https://acme.test/r/registry.json", {});
		});
	});

	describe("getRegistryItems", () => {
		it("should fetch exact items from the configured registry", async () => {
			const registryItem: RegistryItem = {
				name: "button",
				title: "Button",
				type: "registry:ui",
				files: [],
				registryDependencies: ["utils"],
			};
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					json: () => Promise.resolve(mockRegistryIndex),
					ok: true,
					status: 200,
					statusText: "OK",
				} as Response)
				.mockResolvedValueOnce({
					json: () => Promise.resolve(registryItem),
					ok: true,
					status: 200,
					statusText: "OK",
				} as Response);

			const result = await getRegistryItems(["button"], {
				config: {
					registry: "https://shadcn-svelte.com/registry",
					style: "nova",
				},
			});

			expect(result).toEqual([registryItem]);
			expect(fetch).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					href: "https://shadcn-svelte.com/registry/styles/nova/index.json",
				}),
				{}
			);
			expect(fetch).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					href: "https://shadcn-svelte.com/registry/styles/nova/button.json",
				}),
				{}
			);
		});

		it("should fetch exact namespaced items with auth headers", async () => {
			process.env.ACME_TOKEN = "secret";
			const registryItem: RegistryItem = {
				name: "button",
				title: "Button",
				type: "registry:ui",
				files: [],
			};
			vi.mocked(fetch).mockResolvedValueOnce({
				json: () => Promise.resolve(registryItem),
				ok: true,
				status: 200,
				statusText: "OK",
			} as Response);

			const result = await getRegistryItems(["@acme/button"], {
				config: {
					registries: {
						"@acme": {
							url: "https://acme.test/r/{name}.json",
							headers: {
								Authorization: "Bearer ${ACME_TOKEN}",
							},
						},
					},
				},
			});

			expect(result).toEqual([registryItem]);
			expect(fetch).toHaveBeenCalledWith("https://acme.test/r/button.json", {
				headers: { Authorization: "Bearer secret" },
			});
			delete process.env.ACME_TOKEN;
		});
	});

	describe("getItemAliasDir", () => {
		it("should return correct directory for each type", () => {
			expect(toPosixPath(getItemAliasDir(mockConfig, "registry:ui"))).toBe("/path/to/cwd/ui");
			expect(toPosixPath(getItemAliasDir(mockConfig, "registry:hook"))).toBe(
				"/path/to/cwd/hooks"
			);
			expect(toPosixPath(getItemAliasDir(mockConfig, "registry:component"))).toBe(
				"/path/to/cwd/components"
			);
			expect(toPosixPath(getItemAliasDir(mockConfig, "registry:file"))).toBe("/path/to/cwd");
		});
	});

	describe("resolveItemFilePath", () => {
		it("should resolve path with target starting with ~/", () => {
			const item: RegistryItem = {
				name: "button",
				type: "registry:ui",
				files: [
					{
						type: "registry:component",
						content: "",
						target: "~/src/components/button.svelte",
					},
				],
			};
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![0]))).toBe(
				"/path/to/cwd/src/components/button.svelte"
			);
		});

		it("should resolve path for UI components", () => {
			const item: RegistryItem = {
				name: "button",
				type: "registry:ui",
				files: [
					{
						type: "registry:file",
						content: "",
						target: "button/button.svelte",
					},
				],
			};
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![0]))).toBe(
				"/path/to/cwd/ui/button/button.svelte"
			);
		});

		it("should resolve path for components", () => {
			const item: RegistryItem = {
				name: "button",
				type: "registry:component",
				files: [{ type: "registry:component", content: "", target: "button.svelte" }],
			};
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![0]))).toBe(
				"/path/to/cwd/components/button.svelte"
			);
		});

		it("should resolve path for blocks", () => {
			const item: RegistryItem = {
				name: "login",
				type: "registry:block",
				files: [
					{ type: "registry:component", content: "", target: "complex-button.svelte" },
					{ type: "registry:ui", content: "", target: "button/button.svelte" },
					{ type: "registry:page", content: "", target: "login/+page.svelte" },
				],
			};
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![0]))).toBe(
				"/path/to/cwd/components/complex-button.svelte"
			);
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![1]))).toBe(
				"/path/to/cwd/ui/button/button.svelte"
			);
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![2]))).toBe(
				"/path/to/cwd/src/routes/login/+page.svelte"
			);
		});

		it("should resolve path for hooks", () => {
			const item: RegistryItem = {
				name: "use-hook",
				title: "Use Hook",
				type: "registry:hook",
				files: [
					{
						type: "registry:hook",
						target: "use-hook.svelte.ts",
						content: "",
					},
				],
			};
			expect(toPosixPath(resolveItemFilePath(mockConfig, item, item.files![0]))).toBe(
				"/path/to/cwd/hooks/use-hook.svelte.ts"
			);
		});

		it("should resolve path for utils", () => {
			const config = { ...mockConfig };
			const item: RegistryItem = {
				name: "utils",
				type: "registry:lib",
				files: [
					{
						type: "registry:lib",
						target: "utils.ts",
						content: "",
					},
				],
			};
			expect(toPosixPath(resolveItemFilePath(config, item, item.files![0]))).toBe(
				"/path/to/cwd/utils.ts"
			);

			// points to some other path
			config.resolvedPaths = {
				...mockConfig.resolvedPaths,
				utils: `${cwd}/some-other-path/shadcn-utils`,
			};

			expect(toPosixPath(resolveItemFilePath(config, item, item.files![0]))).toBe(
				"/path/to/cwd/some-other-path/shadcn-utils.ts"
			);

			// includes a file extension
			config.resolvedPaths.utils += ".ts";
			expect(toPosixPath(resolveItemFilePath(config, item, item.files![0]))).toBe(
				"/path/to/cwd/some-other-path/shadcn-utils.ts"
			);
		});
	});
});

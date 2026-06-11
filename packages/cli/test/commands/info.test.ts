import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { collectInfo, runInfo } from "../../src/commands/info";

vi.mock("tinyexec");

describe("info command", () => {
	it("collects project and config information", async () => {
		const cwd = path.resolve(__dirname, "../fixtures/config-vite");
		const result = await collectInfo(cwd);

		expect(result.project).toMatchObject({
			cwd,
			framework: "vite",
			sveltekit: false,
			typescript: true,
			svelteVersion: "^4.2.7",
		});
		expect(result.config).toMatchObject({
			style: "nova",
			registry: "https://shadcn-svelte.com/registry",
			aliases: {
				components: "$lib/components",
				utils: "$lib/utils",
				ui: "$lib/components/ui",
			},
		});
		expect(result.config?.resolvedPaths?.cwd).toBe(cwd);
	});

	it("works without components.json", async () => {
		const cwd = path.resolve(__dirname, "../fixtures/config-none");
		const result = await runInfo({ cwd, json: true });

		expect(result.project?.cwd).toBe(cwd);
		expect(result.config).toBeNull();
		expect(result.components).toEqual([]);
	});
});

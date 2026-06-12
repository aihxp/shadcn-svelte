import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { exec } from "tinyexec";
import { afterEach, describe, expect, it, vi } from "vitest";
import { runEject, SHADCN_SVELTE_LAB_TAILWIND_IMPORT } from "../../src/commands/eject/index.js";

vi.mock("tinyexec", () => ({
	exec: vi.fn().mockResolvedValue({}),
}));

describe("eject command", () => {
	const tempDirs: string[] = [];

	afterEach(async () => {
		vi.clearAllMocks();
		for (const dir of tempDirs.splice(0)) {
			await rm(dir, { recursive: true, force: true });
		}
	});

	async function copyViteTemplate() {
		const cwd = await mkdtemp(path.join(tmpdir(), "shadcn-svelte-lab-eject-"));
		tempDirs.push(cwd);
		await cp(path.resolve(__dirname, "../../../../templates/vite-app"), cwd, {
			recursive: true,
		});
		return cwd;
	}

	it("matches shadcn-svelte-lab tailwind imports", () => {
		expect(
			SHADCN_SVELTE_LAB_TAILWIND_IMPORT.test(
				'@import "@aihxp/shadcn-svelte-lab/tailwind.css";\n'
			)
		).toBe(true);
		expect(
			SHADCN_SVELTE_LAB_TAILWIND_IMPORT.test(
				"@import '@aihxp/shadcn-svelte-lab/tailwind.css';\n"
			)
		).toBe(
			true
		);
		expect(SHADCN_SVELTE_LAB_TAILWIND_IMPORT.test('@import "shadcn-svelte/tailwind.css";\n')).toBe(
			false
		);
	});

	it("inlines tailwind css and removes the package dependency", async () => {
		const cwd = await copyViteTemplate();

		const result = await runEject({ cwd, yes: true, silent: true });
		const css = await readFile(path.join(cwd, "src/app.css"), "utf8");

		expect(result.removedDependency).toBe(true);
		expect(result.removedWithPackageManager).toBe(true);
		expect(css).toContain("/* ejected from @aihxp/shadcn-svelte-lab@0.1.0 */");
		expect(css).toContain("@custom-variant data-open");
		expect(css).not.toContain('@import "@aihxp/shadcn-svelte-lab/tailwind.css"');
		expect(exec).toHaveBeenCalledWith("pnpm", ["remove", "@aihxp/shadcn-svelte-lab"], {
			throwOnError: true,
			nodeOptions: { cwd },
		});
	});

	it("inlines tailwind css without removing a missing dependency", async () => {
		const cwd = await copyViteTemplate();
		const packageJsonPath = path.join(cwd, "package.json");
		const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
		delete packageJson.dependencies["@aihxp/shadcn-svelte-lab"];
		await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, "\t")}\n`, "utf8");

		const result = await runEject({ cwd, yes: true, silent: true });

		expect(result.removedDependency).toBe(false);
		expect(exec).not.toHaveBeenCalled();
	});

	it("fails when the stylesheet does not import shadcn-svelte-lab tailwind css", async () => {
		const cwd = await copyViteTemplate();
		await writeFile(path.join(cwd, "src/app.css"), '@import "tailwindcss";\n', "utf8");

		await expect(runEject({ cwd, yes: true, silent: true })).rejects.toThrow("Could not find");
	});
});

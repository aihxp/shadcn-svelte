import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { repoRoot } from "./utils.js";

const bitsUiRange = "^2.18.1";
const bitsUiRegistryDependency = `bits-ui@${bitsUiRange}`;

const bitsUiManifests = [
	"docs/package.json",
	"registry-template/package.json",
	"templates/sveltekit-app/package.json",
	"templates/sveltekit-monorepo/packages/ui/package.json",
	"templates/vite-app/package.json",
	"templates/vite-monorepo/packages/ui/package.json",
	"templates/astro-app/package.json",
	"templates/astro-monorepo/packages/ui/package.json",
	"repro/package.json",
] as const;

async function readJson<T>(relativePath: string): Promise<T> {
	return JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8")) as T;
}

async function findJsonFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) return findJsonFiles(entryPath);
			if (entry.isFile() && entry.name.endsWith(".json")) return [entryPath];
			return [];
		})
	);

	return nested.flat();
}

type PackageJson = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
};

type RegistryItem = {
	devDependencies?: string[];
	files?: Array<{
		target?: string;
		content?: string;
	}>;
};

describe("dependency baselines", () => {
	it("keeps every Bits UI manifest declaration on the current baseline", async () => {
		for (const manifest of bitsUiManifests) {
			const pkg = await readJson<PackageJson>(manifest);
			const declaredVersion =
				pkg.dependencies?.["bits-ui"] ?? pkg.devDependencies?.["bits-ui"];
			expect(declaredVersion, manifest).toBe(bitsUiRange);
		}
	});

	it("resolves a single Bits UI version in the workspace lockfile", async () => {
		const lockfile = await readFile(path.join(repoRoot, "pnpm-lock.yaml"), "utf8");
		const resolvedVersions = new Set(
			Array.from(lockfile.matchAll(/^  bits-ui@([0-9.]+)(?=[:(])/gm), (match) => match[1])
		);

		expect(resolvedVersions).toEqual(new Set(["2.18.1"]));
		expect(lockfile).not.toMatch(/bits-ui@2\.(11|14|16)\./);
	});

	it("publishes the Bits UI baseline and AlertDialog disabled bridge in the default registry", async () => {
		const item = await readJson<RegistryItem>(
			"docs/static/registry/styles/vega/alert-dialog.json"
		);
		const cancelFile = item.files?.find(
			(file) => file.target === "alert-dialog/alert-dialog-cancel.svelte"
		);

		expect(item.devDependencies).toContain(bitsUiRegistryDependency);
		expect(cancelFile?.content).toContain(
			'import { Button, type ButtonVariant, type ButtonSize } from "$UI$/button/index.js";'
		);
		expect(cancelFile?.content).toContain("{disabled}");
		expect(cancelFile?.content).toContain("{#snippet child({ props })}");
	});

	it("does not publish stale Bits UI registry metadata", async () => {
		const registryFiles = await findJsonFiles(path.join(repoRoot, "docs/static/registry"));

		for (const registryFile of registryFiles) {
			const content = await readFile(registryFile, "utf8");
			expect(content, path.relative(repoRoot, registryFile)).not.toMatch(
				/bits-ui@\^2\.(11|14|16)\./
			);
		}
	});

	it("points the public registry redirect at the current styled registry", async () => {
		const route = await readFile(
			path.join(repoRoot, "docs/src/routes/registry/+server.ts"),
			"utf8"
		);

		expect(route).toContain('redirect(303, "/registry/styles/vega/index.json")');
	});
});

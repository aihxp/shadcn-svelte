import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	add as addCommand,
	addRegistriesToConfig,
	parseRegistryArg,
} from "../../src/commands/registry/add.js";

const tempDirs: string[] = [];

function copyFixture(name: string) {
	const cwd = mkdtempSync(path.join(tmpdir(), "shadcn-svelte-registry-add-"));
	cpSync(path.resolve(__dirname, `../fixtures/${name}`), cwd, { recursive: true });
	tempDirs.push(cwd);
	return cwd;
}

function readComponentsJson(cwd: string) {
	return JSON.parse(readFileSync(path.resolve(cwd, "components.json"), "utf8"));
}

describe("registry add helpers", () => {
	afterEach(() => {
		for (const cwd of tempDirs.splice(0)) {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	it("parses namespace URL arguments", () => {
		expect(parseRegistryArg("@acme=https://example.com/r/{name}.json?token=a=b")).toEqual({
			namespace: "@acme",
			url: "https://example.com/r/{name}.json?token=a=b",
		});
	});

	it("rejects invalid namespaces", () => {
		expect(() => parseRegistryArg("acme=https://example.com/r/{name}.json")).toThrow(
			"Invalid registry namespace"
		);
	});

	it("rejects URL templates without the name placeholder", () => {
		expect(() => parseRegistryArg("@acme=https://example.com/r/button.json")).toThrow(
			"URL must include {name}"
		);
	});

	it("adds explicit registry URLs while preserving existing config fields", () => {
		const cwd = copyFixture("config-vite");
		const result = addRegistriesToConfig(["@acme=https://example.com/r/{name}.json"], cwd);
		const config = readComponentsJson(cwd);

		expect(result.addedRegistries).toEqual(["@acme"]);
		expect(config.registries).toEqual({
			"@acme": "https://example.com/r/{name}.json",
		});
		expect(config.tailwind.config).toBe("tailwind.config.js");
	});

	it("adds curated directory registries by namespace", () => {
		const cwd = copyFixture("config-vite");
		const result = addRegistriesToConfig(["@ofkm"], cwd);
		const config = readComponentsJson(cwd);

		expect(result.addedRegistries).toEqual(["@ofkm"]);
		expect(config.registries).toEqual({
			"@ofkm": "https://shadcn.ofkm.dev/r/{name}.json",
		});
	});

	it("skips already configured registries", () => {
		const cwd = copyFixture("config-vite");
		addRegistriesToConfig(["@ofkm"], cwd);
		const result = addRegistriesToConfig(["@ofkm"], cwd);

		expect(result.addedRegistries).toEqual([]);
		expect(result.skippedExistingRegistries).toEqual(["@ofkm"]);
	});

	it("skips built-in registries", () => {
		const cwd = copyFixture("config-vite");
		const result = addRegistriesToConfig(["@shadcn"], cwd);
		const config = readComponentsJson(cwd);

		expect(result.addedRegistries).toEqual([]);
		expect(result.skippedBuiltInRegistries).toEqual(["@shadcn"]);
		expect(config.registries).toBeUndefined();
	});

	it("requires a URL for namespaces outside the directory", () => {
		const cwd = copyFixture("config-vite");

		expect(() => addRegistriesToConfig(["@missing"], cwd)).toThrow(
			"was not found in the directory"
		);
	});

	it("requires components.json", () => {
		const cwd = copyFixture("config-none");

		expect(() => addRegistriesToConfig(["@ofkm"], cwd)).toThrow("No components.json found");
	});
});

describe("registry add command", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		for (const cwd of tempDirs.splice(0)) {
			rmSync(cwd, { recursive: true, force: true });
		}
	});

	it("adds registries through the command action", async () => {
		const cwd = copyFixture("config-vite");

		await addCommand.parseAsync(["@ofkm", "--cwd", cwd, "--silent"], { from: "user" });

		expect(readComponentsJson(cwd).registries).toEqual({
			"@ofkm": "https://shadcn.ofkm.dev/r/{name}.json",
		});
	});
});

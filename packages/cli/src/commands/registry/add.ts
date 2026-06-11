import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import { Command } from "commander";
import color from "picocolors";
import { z } from "zod";
import * as cliConfig from "../../utils/config/index.js";
import { error } from "../../utils/errors.js";
import { getDirectoryRegistry, getRegistryDirectory } from "../../utils/registry/directory.js";
import { cancel, handleError, intro } from "../../utils/prompt-helpers.js";

const NAMESPACE_PATTERN = /^@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?$/;
const BUILT_IN_REGISTRIES = new Set(["@shadcn"]);

const addOptionsSchema = z.object({
	cwd: z.string(),
	silent: z.boolean(),
});

type RegistryArg = {
	namespace: string;
	url?: string;
};

type AddRegistriesResult = {
	addedRegistries: string[];
	skippedBuiltInRegistries: string[];
	skippedExistingRegistries: string[];
	configPath: string;
};

export const add = new Command()
	.command("add")
	.description("add registries to your project")
	.argument("[registries...]", "registries (@namespace) or registry URLs (@namespace=url)")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("-s, --silent", "mute output", false)
	.action(async (registries: string[], opts) => {
		try {
			const options = addOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});

			if (!options.silent) {
				intro();
			}

			const registryArgs = registries.length
				? registries
				: await promptForRegistries({ silent: options.silent });
			const result = addRegistriesToConfig(registryArgs, options.cwd);

			if (!options.silent) {
				printResult(result);
				p.outro(`${color.green("Success!")} Registry configuration updated.`);
			}
		} catch (e) {
			handleError(e);
		}
	});

export function parseRegistryArg(arg: string): RegistryArg {
	const [rawNamespace = "", ...rest] = arg.split("=");
	const namespace = rawNamespace.trim();
	const url = rest.length > 0 ? rest.join("=").trim() : undefined;

	if (!NAMESPACE_PATTERN.test(namespace)) {
		throw error(
			`Invalid registry namespace: ${namespace}. Registry names must start with @ and contain only letters, numbers, hyphens, or underscores.`
		);
	}

	if (url !== undefined) {
		if (!url || !url.includes("{name}")) {
			throw error(
				`Invalid registry URL for ${namespace}. URL must include {name}. Example: ${namespace}=https://example.com/r/{name}.json`
			);
		}
	}

	return { namespace, url };
}

export function addRegistriesToConfig(registryArgs: string[], cwd: string): AddRegistriesResult {
	const configPath = path.resolve(cwd, "components.json");
	if (!existsSync(configPath)) {
		throw error("No components.json found. Run shadcn-svelte init first.");
	}

	cliConfig.loadConfig(cwd);

	const existingConfig = readComponentsConfig(configPath);
	const existingRegistries = getObject(existingConfig.registries);
	const parsed = registryArgs.map(parseRegistryArg);
	const newRegistries: Record<string, string> = {};
	const skippedBuiltInRegistries: string[] = [];
	const skippedExistingRegistries: string[] = [];

	for (const { namespace, url } of parsed) {
		if (BUILT_IN_REGISTRIES.has(namespace)) {
			skippedBuiltInRegistries.push(namespace);
			continue;
		}

		if (existingRegistries[namespace] !== undefined || newRegistries[namespace] !== undefined) {
			skippedExistingRegistries.push(namespace);
			continue;
		}

		const registryUrl = url ?? getDirectoryRegistry(namespace)?.url;
		if (!registryUrl) {
			throw error(
				`Registry ${namespace} was not found in the directory. Provide a URL with ${namespace}=https://example.com/r/{name}.json.`
			);
		}

		newRegistries[namespace] = registryUrl;
	}

	const addedRegistries = Object.keys(newRegistries);
	if (addedRegistries.length > 0) {
		const updatedConfig = {
			...existingConfig,
			registries: {
				...existingRegistries,
				...newRegistries,
			},
		};

		writeFileSync(configPath, JSON.stringify(updatedConfig, null, "\t") + "\n", "utf8");
	}

	return {
		addedRegistries,
		skippedBuiltInRegistries,
		skippedExistingRegistries,
		configPath,
	};
}

async function promptForRegistries(options: { silent: boolean }) {
	if (options.silent) {
		throw error("No registries provided. Pass a namespace or @namespace=url.");
	}

	const directory = getRegistryDirectory().sort((a, b) => a.name.localeCompare(b.name));
	if (!directory.length) {
		throw error("No directory registries are available. Provide a registry URL.");
	}

	const selected = await p.multiselect({
		message: "Which registries would you like to add?",
		options: directory.map((registry) => ({
			label: registry.name,
			value: registry.name,
			hint: registry.description,
		})),
	});

	if (p.isCancel(selected)) {
		cancel();
	}

	if (!selected.length) {
		cancel("No registries selected.");
	}

	return selected;
}

function readComponentsConfig(configPath: string): Record<string, unknown> {
	const parsed = JSON.parse(readFileSync(configPath, "utf8"));
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
		throw error("Invalid components.json. Expected an object.");
	}

	return parsed as Record<string, unknown>;
}

function getObject(value: unknown): Record<string, unknown> {
	if (typeof value === "object" && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}

	return {};
}

function printResult(result: AddRegistriesResult) {
	if (result.addedRegistries.length) {
		console.log(color.green(`Added ${pluralize(result.addedRegistries.length, "registry")}:`));
		for (const registry of result.addedRegistries) {
			console.log(`  - ${registry}`);
		}
	}

	if (result.skippedExistingRegistries.length) {
		console.log(
			color.yellow(
				`Skipped ${pluralize(result.skippedExistingRegistries.length, "registry")} already configured:`
			)
		);
		for (const registry of result.skippedExistingRegistries) {
			console.log(`  - ${registry}`);
		}
	}

	if (result.skippedBuiltInRegistries.length) {
		console.log(
			color.yellow(
				`Skipped ${pluralize(result.skippedBuiltInRegistries.length, "built-in registry")}:`
			)
		);
		for (const registry of result.skippedBuiltInRegistries) {
			console.log(`  - ${registry}`);
		}
	}

	if (
		!result.addedRegistries.length &&
		!result.skippedExistingRegistries.length &&
		!result.skippedBuiltInRegistries.length
	) {
		console.log("No new registries to add.");
	}
}

function pluralize(count: number, singular: string) {
	return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

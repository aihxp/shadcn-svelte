import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import color from "picocolors";
import { z } from "zod";
import { handleError } from "../../utils/prompt-helpers.js";
import * as cliConfig from "../../utils/config/index.js";
import * as project from "../../utils/project.js";
import { detect } from "package-manager-detector";
import type { PackageJson } from "type-fest";

const infoOptionsSchema = z.object({
	cwd: z.string(),
	json: z.boolean(),
});

type InfoOptions = z.infer<typeof infoOptionsSchema>;

export const info = new Command()
	.command("info")
	.description("get information about your project")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("--json", "output as JSON", false)
	.action(async (opts) => {
		try {
			const options = infoOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});
			const data = await collectInfo(options.cwd);

			if (options.json) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printInfo(data);
			}
		} catch (cause) {
			handleError(cause);
		}
	});

export async function runInfo(options: InfoOptions) {
	return collectInfo(options.cwd);
}

export async function collectInfo(cwd: string) {
	const packageJson = readPackageJson(cwd);
	const packageManager = (await detect({ cwd }))?.agent ?? null;
	const rawConfig = cliConfig.loadConfig(cwd);
	let resolvedConfig: cliConfig.ResolvedConfig | undefined;

	try {
		resolvedConfig = await cliConfig.getConfig(cwd);
	} catch {
		resolvedConfig = undefined;
	}

	return {
		project: packageJson
			? {
					cwd,
					packageManager,
					framework: detectFramework(packageJson),
					sveltekit: hasDependency(packageJson, "@sveltejs/kit"),
					typescript: existsSync(path.resolve(cwd, "tsconfig.json")),
					svelteVersion: getDependencyVersion(packageJson, "svelte"),
					tailwindVersion: getDependencyVersion(packageJson, "tailwindcss"),
				}
			: null,
		config: rawConfig
			? {
					style: rawConfig.style ?? cliConfig.DEFAULT_CONFIG.style,
					registry: rawConfig.registry,
					registries: getRegistries(rawConfig.registries),
					typescript: rawConfig.typescript,
					iconLibrary: rawConfig.iconLibrary ?? null,
					menuColor: rawConfig.menuColor ?? null,
					menuAccent: rawConfig.menuAccent ?? null,
					aliases: rawConfig.aliases,
					tailwind: rawConfig.tailwind,
					resolvedPaths: resolvedConfig?.resolvedPaths ?? null,
				}
			: null,
		components: resolvedConfig ? await getInstalledComponents(resolvedConfig) : [],
		links: {
			docs: "https://shadcn-svelte.com/docs",
			components: "https://shadcn-svelte.com/docs/components",
			schema: "https://shadcn-svelte.com/schema.json",
		},
	};
}

function readPackageJson(cwd: string) {
	try {
		return project.getPackageInfo(cwd);
	} catch {
		return null;
	}
}

function detectFramework(packageJson: PackageJson) {
	if (hasDependency(packageJson, "@sveltejs/kit")) return "sveltekit";
	if (hasDependency(packageJson, "astro")) return "astro";
	if (hasDependency(packageJson, "vite") && hasDependency(packageJson, "svelte")) return "vite";
	if (hasDependency(packageJson, "svelte")) return "svelte";
	return "unknown";
}

function hasDependency(packageJson: PackageJson, dependency: string) {
	return getDependencyVersion(packageJson, dependency) !== null;
}

function getDependencyVersion(packageJson: PackageJson, dependency: string) {
	const deps = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
		...packageJson.peerDependencies,
	};
	return deps[dependency] ?? null;
}

function getRegistries(registries: cliConfig.RawConfig["registries"]) {
	if (!registries) return {};

	return Object.fromEntries(
		Object.entries(registries).map(([name, value]) => [
			name,
			typeof value === "string" ? value : value.url,
		])
	);
}

async function getInstalledComponents(config: cliConfig.ResolvedConfig) {
	const names = new Set<string>();
	const dirs = [
		config.resolvedPaths.ui,
		config.resolvedPaths.components,
		config.resolvedPaths.hooks,
	];

	for (const dir of dirs) {
		if (!existsSync(dir)) continue;

		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory()) {
				names.add(entry.name);
			}
		}
	}

	const utilsPath = config.resolvedPaths.utils.match(/\.(ts|js)$/)
		? config.resolvedPaths.utils
		: `${config.resolvedPaths.utils}.ts`;
	if (existsSync(utilsPath)) {
		names.add("utils");
	}

	return Array.from(names).sort();
}

function printInfo(data: Awaited<ReturnType<typeof collectInfo>>) {
	console.log(color.cyan("Project"));
	if (data.project) {
		printEntries({
			cwd: data.project.cwd,
			packageManager: data.project.packageManager ?? "-",
			framework: data.project.framework,
			sveltekit: data.project.sveltekit ? "yes" : "no",
			typescript: data.project.typescript ? "yes" : "no",
			svelteVersion: data.project.svelteVersion ?? "-",
			tailwindVersion: data.project.tailwindVersion ?? "-",
		});
	} else {
		console.log("  No package.json found.");
	}

	console.log();
	console.log(color.cyan("Configuration"));
	if (data.config) {
		printEntries({
			style: data.config.style,
			registry: data.config.registry,
			typescript:
				typeof data.config.typescript === "boolean"
					? data.config.typescript
						? "yes"
						: "no"
					: data.config.typescript.config,
			iconLibrary: data.config.iconLibrary ?? "-",
			menuColor: data.config.menuColor ?? "-",
			menuAccent: data.config.menuAccent ?? "-",
		});

		console.log();
		console.log(color.cyan("Aliases"));
		printEntries(data.config.aliases);

		if (data.config.resolvedPaths) {
			console.log();
			console.log(color.cyan("Resolved Paths"));
			printEntries(data.config.resolvedPaths);
		}

		if (Object.keys(data.config.registries).length) {
			console.log();
			console.log(color.cyan("Registries"));
			printEntries(data.config.registries);
		}
	} else {
		console.log("  No components.json found.");
	}

	console.log();
	console.log(color.cyan("Installed Components"));
	console.log(data.components.length ? `  ${data.components.join(", ")}` : "  None found.");
}

function printEntries(entries: Record<string, string>) {
	const maxKeyLength = Math.max(...Object.keys(entries).map((key) => key.length));
	for (const [key, value] of Object.entries(entries)) {
		console.log(`  ${key.padEnd(maxKeyLength + 2)}${value}`);
	}
}

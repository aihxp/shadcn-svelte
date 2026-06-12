import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import { Command } from "commander";
import { detect } from "package-manager-detector";
import color from "picocolors";
import { exec } from "tinyexec";
import { z } from "zod";
import { highlight } from "../../utils/colors.js";
import * as cliConfig from "../../utils/config/index.js";
import { error } from "../../utils/errors.js";
import { handleError, intro, cancel } from "../../utils/prompt-helpers.js";
import { CLI_COMMAND_NAME, CLI_PACKAGE_NAME, CLI_TAILWIND_CSS_IMPORT } from "../../constants.js";
import type { PackageJson } from "type-fest";

export const SHADCN_SVELTE_LAB_TAILWIND_IMPORT =
	/@import\s+(?:url\()?["']@aihxp\/shadcn-svelte-lab\/tailwind\.css["']\)?;?\s*\n?/;

const ejectOptionsSchema = z.object({
	cwd: z.string(),
	yes: z.boolean(),
	silent: z.boolean(),
});

type EjectOptions = z.infer<typeof ejectOptionsSchema>;

type EjectResult = {
	cssPath: string;
	removedDependency: boolean;
	removedWithPackageManager: boolean;
};

export const eject = new Command()
	.command("eject")
	.description(`inline ${CLI_TAILWIND_CSS_IMPORT} and remove the ${CLI_PACKAGE_NAME} dependency`)
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("-y, --yes", "skip confirmation prompt", false)
	.option("-s, --silent", "mute output", false)
	.action(async (opts) => {
		try {
			const options = ejectOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});

			if (!options.silent) {
				intro();
			}

			const config = await cliConfig.getConfig(options.cwd);
			if (!config) {
				throw error(`No components.json found. Run ${CLI_COMMAND_NAME} init first.`);
			}

			const cssPath = config.resolvedPaths.tailwindCss;
			const cssPathRelative = path.relative(options.cwd, cssPath);
			const packageJson = await readPackageJson(options.cwd);
			const packageVersion = getShadcnSvelteVersion(packageJson);

			if (!options.silent) {
				p.log.warn(
					"Future shadcn-svelte-lab CLI updates to tailwind.css will not apply automatically."
				);
				p.log.message(
					`This will inline ${highlight(CLI_TAILWIND_CSS_IMPORT)} into ${highlight(cssPathRelative)} and remove ${highlight(CLI_PACKAGE_NAME)} when it is installed.`
				);
			}

			if (!options.yes) {
				const proceed = await p.confirm({
					message: "Proceed?",
					initialValue: false,
				});

				if (p.isCancel(proceed) || !proceed) {
					cancel();
				}
			}

			await runEject({
				...options,
				config,
				packageJson,
				packageVersion,
			});

			if (!options.silent) {
				p.outro(
					`${color.green("Success!")} Ejected ${highlight(CLI_TAILWIND_CSS_IMPORT)} into ${highlight(cssPathRelative)}.`
				);
			}
		} catch (e) {
			handleError(e);
		}
	});

export async function runEject(
	options: EjectOptions & {
		config?: cliConfig.ResolvedConfig;
		packageJson?: PackageJson | null;
		packageVersion?: string;
	}
): Promise<EjectResult> {
	const config = options.config ?? (await cliConfig.getConfig(options.cwd));
	if (!config) {
		throw error(`No components.json found. Run ${CLI_COMMAND_NAME} init first.`);
	}

	const cssPath = config.resolvedPaths.tailwindCss;
	const cssPathRelative = path.relative(options.cwd, cssPath);
	let cssContent = await fs.readFile(cssPath, "utf8");

	if (!SHADCN_SVELTE_LAB_TAILWIND_IMPORT.test(cssContent)) {
		throw error(
			`Could not find ${highlight(`@import "${CLI_TAILWIND_CSS_IMPORT}"`)} in ${highlight(cssPathRelative)}. Nothing to eject.`
		);
	}

	const packageJson = options.packageJson ?? (await readPackageJson(options.cwd));
	const packageVersion = options.packageVersion ?? getShadcnSvelteVersion(packageJson);
	const tailwindCssPath = resolveShadcnSvelteTailwindCss(options.cwd);
	const tailwindCss = await fs.readFile(tailwindCssPath, "utf8");

	cssContent = cssContent.replace(
		SHADCN_SVELTE_LAB_TAILWIND_IMPORT,
		() => `/* ejected from ${CLI_PACKAGE_NAME}@${packageVersion} */\n${tailwindCss.trim()}\n\n`
	);

	await fs.writeFile(cssPath, cssContent, "utf8");

	const removal = await removeShadcnSvelteDependency(options.cwd, packageJson);

	return {
		cssPath,
		removedDependency: removal.removed,
		removedWithPackageManager: removal.withPackageManager,
	};
}

function resolveShadcnSvelteTailwindCss(cwd: string) {
	const projectCss = path.join(
		cwd,
		"node_modules",
		...CLI_PACKAGE_NAME.split("/"),
		"dist",
		"tailwind.css"
	);
	if (existsSync(projectCss)) {
		return projectCss;
	}

	const commandDir = path.dirname(fileURLToPath(import.meta.url));
	const candidates = [
		path.join(commandDir, "tailwind.css"),
		path.join(commandDir, "..", "..", "tailwind.css"),
		path.join(commandDir, "..", "..", "..", "dist", "tailwind.css"),
		path.join(process.cwd(), "packages", "cli", "src", "tailwind.css"),
		path.join(process.cwd(), "packages", "cli", "dist", "tailwind.css"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	throw error(`Could not resolve ${CLI_TAILWIND_CSS_IMPORT}.`);
}

async function readPackageJson(cwd: string) {
	const packageJsonPath = path.join(cwd, "package.json");
	if (!existsSync(packageJsonPath)) {
		return null;
	}

	return JSON.parse(await fs.readFile(packageJsonPath, "utf8")) as PackageJson;
}

function getShadcnSvelteVersion(packageJson: PackageJson | null) {
	const version =
		packageJson?.dependencies?.[CLI_PACKAGE_NAME] ??
		packageJson?.devDependencies?.[CLI_PACKAGE_NAME] ??
		"unknown";

	return version.replace(/^[\^~]/, "").trim();
}

function hasShadcnSvelteDependency(packageJson: PackageJson | null) {
	return Boolean(
		packageJson?.dependencies?.[CLI_PACKAGE_NAME] ??
		packageJson?.devDependencies?.[CLI_PACKAGE_NAME]
	);
}

async function removeShadcnSvelteDependency(cwd: string, packageJson: PackageJson | null) {
	if (!hasShadcnSvelteDependency(packageJson)) {
		return { removed: false, withPackageManager: false };
	}

	const detected = await detect({ cwd });
	const command = getRemoveCommand(detected?.agent);

	if (command) {
		await exec(command.command, command.args, {
			throwOnError: true,
			nodeOptions: { cwd },
		});
		return { removed: true, withPackageManager: true };
	}

	await removeDependencyFromPackageJson(cwd, packageJson);
	return { removed: true, withPackageManager: false };
}

function getRemoveCommand(agent: string | undefined) {
	switch (agent) {
		case "npm":
			return { command: "npm", args: ["uninstall", CLI_PACKAGE_NAME] };
		case "pnpm":
			return { command: "pnpm", args: ["remove", CLI_PACKAGE_NAME] };
		case "yarn":
			return { command: "yarn", args: ["remove", CLI_PACKAGE_NAME] };
		case "bun":
			return { command: "bun", args: ["remove", CLI_PACKAGE_NAME] };
		default:
			return null;
	}
}

async function removeDependencyFromPackageJson(cwd: string, packageJson: PackageJson | null) {
	if (!packageJson) {
		return;
	}

	let changed = false;
	for (const field of ["dependencies", "devDependencies"] as const) {
		if (packageJson[field]?.[CLI_PACKAGE_NAME]) {
			delete packageJson[field][CLI_PACKAGE_NAME];
			changed = true;
		}
	}

	if (changed) {
		await fs.writeFile(
			path.join(cwd, "package.json"),
			`${JSON.stringify(packageJson, null, "\t")}\n`,
			"utf8"
		);
	}
}

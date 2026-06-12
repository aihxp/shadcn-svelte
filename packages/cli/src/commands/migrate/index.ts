import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import { Command } from "commander";
import color from "picocolors";
import { glob, isDynamicPattern } from "tinyglobby";
import { z } from "zod";
import { highlight } from "../../utils/colors.js";
import * as cliConfig from "../../utils/config/index.js";
import { error } from "../../utils/errors.js";
import { transformDirection } from "../../utils/transformers/transform-direction.js";
import { cancel, handleError, intro } from "../../utils/prompt-helpers.js";
import { CLI_COMMAND_NAME } from "../../constants.js";

export const migrations = [
	{
		name: "rtl",
		description: "migrate generated components to right-to-left friendly utilities",
	},
] as const;

const migrationNames = migrations.map((migration) => migration.name) as [
	(typeof migrations)[number]["name"],
	...(typeof migrations)[number]["name"][],
];

const migrateOptionsSchema = z.object({
	cwd: z.string(),
	list: z.boolean(),
	yes: z.boolean(),
	migration: z.enum(migrationNames).optional(),
	path: z.string().optional(),
});

type MigrateOptions = z.infer<typeof migrateOptionsSchema>;
type MigrationName = (typeof migrations)[number]["name"];

type MigrationResult = {
	migration: MigrationName;
	files: string[];
	transformed: string[];
	manualReview: string[];
	configUpdated: boolean;
};

const DEFAULT_GLOB = "**/*.{svelte,js,ts,css,html}";
const SUPPORTED_EXTENSIONS = new Set([".svelte", ".js", ".ts", ".css", ".html"]);
const IGNORE_PATTERNS = [
	"**/node_modules/**",
	"**/.svelte-kit/**",
	"**/.git/**",
	"**/dist/**",
	"**/build/**",
];
const MANUAL_REVIEW_FILES = [/sidebar/i, /pagination/i, /calendar/i, /range-calendar/i];

export const migrate = new Command()
	.command("migrate")
	.description("run a migration")
	.argument("[migration]", "the migration to run")
	.argument("[path]", "optional path or glob pattern to migrate")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("-l, --list", "list all migrations", false)
	.option("-y, --yes", "skip confirmation prompt", false)
	.action(async (migration, migratePath, opts) => {
		try {
			const options = migrateOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
				migration,
				path: migratePath,
			});

			if (options.list || !options.migration) {
				printMigrations();
				return;
			}

			intro();

			const result = await runMigrate(options);
			p.outro(
				`${color.green("Success!")} Migration complete. ${highlight(String(result.transformed.length))} file(s) transformed.`
			);
		} catch (cause) {
			handleError(cause);
		}
	});

export async function runMigrate(options: MigrateOptions): Promise<MigrationResult> {
	if (options.list || !options.migration) {
		return {
			migration: "rtl",
			files: [],
			transformed: [],
			manualReview: [],
			configUpdated: false,
		};
	}

	if (!existsSync(options.cwd)) {
		throw error(`The path ${color.cyan(options.cwd)} does not exist. Please try again.`);
	}

	const config = await cliConfig.getConfig(options.cwd);
	if (!config) {
		throw error(
			`Configuration file is missing. Please run ${color.green("init")} to create a ${highlight("components.json")} file.`
		);
	}

	if (options.migration !== "rtl") {
		throw error(
			`Unknown migration ${highlight(options.migration)}. Run ${highlight(`${CLI_COMMAND_NAME} migrate --list`)} to see available migrations.`
		);
	}

	return migrateRtl(config, options);
}

async function migrateRtl(config: cliConfig.ResolvedConfig, options: MigrateOptions) {
	const target = await resolveMigrationFiles(config, options.path);
	if (!target.files.length) {
		throw error(`No files found matching ${highlight(options.path ?? target.displayPath)}.`);
	}

	if (!options.yes) {
		const proceed = await p.confirm({
			message: `Migrate ${target.files.length} file(s) in ${target.displayPath} to RTL-friendly utilities?`,
			initialValue: false,
		});

		if (p.isCancel(proceed) || proceed === false) {
			cancel();
		}
	}

	const configUpdated = await updateComponentsJsonRtl(config.resolvedPaths.cwd);
	const transformed: string[] = [];
	const manualReview = new Set<string>();

	await Promise.all(
		target.files.map(async (file) => {
			const filePath = path.resolve(target.basePath, file);
			const content = await fs.readFile(filePath, "utf8");
			const nextContent = transformDirection(content, true);
			const relativeFile = path.relative(config.resolvedPaths.cwd, filePath);

			if (content !== nextContent) {
				await fs.writeFile(filePath, nextContent, "utf8");
				transformed.push(relativeFile);
			}

			if (needsManualReview(filePath)) {
				manualReview.add(relativeFile);
			}
		})
	);

	if (manualReview.size) {
		p.log.warn("Some files may need manual RTL review:");
		for (const file of [...manualReview].sort()) {
			p.log.info(`  - ${file}`);
		}
	}

	return {
		migration: "rtl",
		files: target.files.map((file) =>
			path.relative(config.resolvedPaths.cwd, path.resolve(target.basePath, file))
		),
		transformed: transformed.sort(),
		manualReview: [...manualReview].sort(),
		configUpdated,
	} satisfies MigrationResult;
}

async function resolveMigrationFiles(config: cliConfig.ResolvedConfig, migratePath?: string) {
	const cwd = config.resolvedPaths.cwd;

	if (!migratePath) {
		const basePath = config.resolvedPaths.ui;
		return {
			basePath,
			displayPath: `./${path.relative(cwd, basePath)}`,
			files: await findFiles(DEFAULT_GLOB, basePath),
		};
	}

	if (isDynamicPattern(migratePath)) {
		return {
			basePath: cwd,
			displayPath: migratePath,
			files: await findFiles(migratePath, cwd),
		};
	}

	const fullPath = path.resolve(cwd, migratePath);
	const stat = await fs.stat(fullPath).catch(() => null);
	if (!stat) {
		throw error(`File not found: ${migratePath}`);
	}

	if (stat.isDirectory()) {
		return {
			basePath: fullPath,
			displayPath: `./${path.relative(cwd, fullPath)}`,
			files: await findFiles(DEFAULT_GLOB, fullPath),
		};
	}

	if (!stat.isFile()) {
		throw error(`Unsupported path type: ${migratePath}`);
	}

	if (!SUPPORTED_EXTENSIONS.has(path.extname(fullPath))) {
		throw error(
			`Unsupported file type: ${path.relative(cwd, fullPath)}. Supported extensions: ${[
				...SUPPORTED_EXTENSIONS,
			].join(", ")}.`
		);
	}

	return {
		basePath: cwd,
		displayPath: `./${path.relative(cwd, fullPath)}`,
		files: [path.relative(cwd, fullPath)],
	};
}

async function findFiles(pattern: string, cwd: string) {
	const files = await glob(pattern, {
		cwd,
		onlyFiles: true,
		ignore: IGNORE_PATTERNS,
	});

	return files
		.filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file)))
		.sort((a, b) => a.localeCompare(b));
}

async function updateComponentsJsonRtl(cwd: string) {
	const componentsJsonPath = path.resolve(cwd, "components.json");
	const raw = JSON.parse(await fs.readFile(componentsJsonPath, "utf8"));
	if (raw.rtl === true) {
		return false;
	}

	raw.rtl = true;
	await fs.writeFile(componentsJsonPath, `${JSON.stringify(raw, null, "\t")}\n`, "utf8");
	return true;
}

function needsManualReview(filePath: string) {
	const basename = path.basename(filePath);
	return MANUAL_REVIEW_FILES.some((pattern) => pattern.test(basename));
}

function printMigrations() {
	p.log.info("Available migrations:");
	for (const migration of migrations) {
		p.log.info(`- ${migration.name}: ${migration.description}`);
	}
}

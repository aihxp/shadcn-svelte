import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import color from "picocolors";
import { z } from "zod";
import { error } from "../../utils/errors.js";
import { handleError } from "../../utils/prompt-helpers.js";
import * as cliConfig from "../../utils/config/index.js";
import { CLI_COMMAND_NAME } from "../../constants.js";
import {
	findUnknownSearchTypes,
	formatSearchResultType,
	resolveSearchRegistries,
	searchRegistries,
	SEARCHABLE_TYPES,
	type RegistryConfigContext,
} from "../../utils/registry/index.js";
import type { SearchResults } from "../../utils/registry/schema.js";

const searchOptionsSchema = z.object({
	cwd: z.string(),
	query: z.string().optional(),
	types: z.string().optional(),
	limit: z.coerce.number().int().positive().optional(),
	offset: z.coerce.number().int().min(0).optional(),
	json: z.boolean(),
});

type SearchOptions = z.infer<typeof searchOptionsSchema>;

export const search = new Command()
	.command("search")
	.alias("list")
	.description("search items from registries")
	.argument(
		"[registries...]",
		"registry addresses to search. Supports namespaces, GitHub sources, and URLs"
	)
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("-q, --query <query>", "query string")
	.option(
		"-t, --type <type>",
		"filter by item type, e.g. ui, block, hook. Comma-separated for multiple"
	)
	.option("-l, --limit <number>", "maximum number of items to display", "100")
	.option("-o, --offset <number>", "number of items to skip", "0")
	.option("--json", "output as JSON", false)
	.action(async (registries: string[], opts) => {
		try {
			const options = searchOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});
			const results = await runSearch(registries, options);

			if (options.json) {
				console.log(JSON.stringify(results, null, 2));
			} else {
				printSearchResults(results, {
					query: options.query,
					types: parseTypes(options.types),
					registries: resolveRegistriesToSearch(registries, loadSearchConfig(options.cwd)),
				});
			}
		} catch (cause) {
			handleError(cause);
		}
	});

export async function runSearch(registries: string[], options: SearchOptions) {
	const config = loadSearchConfig(options.cwd);
	const types = parseTypes(options.types);

	if (types.length) {
		const unknownTypes = findUnknownSearchTypes(types);
		if (unknownTypes.length) {
			throw error(
				`Unknown ${unknownTypes.length === 1 ? "type" : "types"}: ${unknownTypes.join(", ")}. Valid types: ${SEARCHABLE_TYPES.join(", ")}.`
			);
		}
	}

	const registriesToSearch = resolveRegistriesToSearch(registries, config);

	if (!registriesToSearch.length) {
		throw error(
			`No registries are configured in components.json. Provide a registry, e.g. ${CLI_COMMAND_NAME} search @shadcn.`
		);
	}

	return searchRegistries(registriesToSearch, {
		query: options.query,
		types,
		limit: options.limit,
		offset: options.offset,
		config,
		continueOnError: registries.length === 0,
	});
}

function loadSearchConfig(cwd: string): RegistryConfigContext {
	const config = cliConfig.loadConfig(cwd);

	return {
		registry: config?.registry ?? cliConfig.DEFAULT_CONFIG.registry,
		registries: config?.registries,
		style: config?.style ?? cliConfig.DEFAULT_CONFIG.style,
	};
}

function resolveRegistriesToSearch(registries: string[], config: RegistryConfigContext) {
	if (registries.length) return registries;

	const configured = resolveSearchRegistries([], config);
	return configured.length ? configured : ["@shadcn"];
}

function parseTypes(types?: string) {
	return (
		types
			?.split(",")
			.map((type) => type.trim())
			.filter(Boolean) ?? []
	);
}

function printSearchResults(
	results: SearchResults,
	options: {
		query?: string;
		types: string[];
		registries: string[];
	}
) {
	for (const registryError of results.errors ?? []) {
		console.warn(color.yellow(`Skipped ${registryError.registry}: ${registryError.message}`));
	}

	if (!results.items.length) {
		console.log(`No items found${formatSearchScope(options)}.`);
		return;
	}

	const count = `${results.pagination.total} item${results.pagination.total === 1 ? "" : "s"}`;
	console.log(`Found ${count}${formatSearchScope(options)}.`);
	console.log(
		`Showing ${results.pagination.offset + 1}-${Math.min(
			results.pagination.offset + results.pagination.limit,
			results.pagination.total
		)} of ${results.pagination.total}.`
	);
	console.log();

	const showRegistry = options.registries.length > 1;
	for (const item of results.items) {
		const type = formatSearchResultType(item.type);
		const typeSuffix = type ? ` (${type})` : "";
		const registrySuffix = showRegistry ? ` [${item.registry}]` : "";
		const descriptionSuffix = item.description ? ` - ${formatDescription(item.description)}` : "";
		console.log(
			`${color.cyan(item.addCommandArgument)}${typeSuffix}${registrySuffix}${descriptionSuffix}`
		);
	}

	if (results.pagination.hasMore) {
		console.log();
		console.log(`More items available. Use --offset ${results.pagination.offset + results.pagination.limit}.`);
	}
}

function formatSearchScope(options: { query?: string; types: string[]; registries: string[] }) {
	let scope = "";
	if (options.types.length) {
		scope += ` of type ${options.types.map((type) => formatSearchResultType(type)).join(", ")}`;
	}
	if (options.query) {
		scope += ` matching "${options.query}"`;
	}
	if (options.registries.length) {
		scope += ` in ${options.registries.join(", ")}`;
	}
	return scope;
}

function formatDescription(description: string, maxLength = 80) {
	const normalized = description.trim().replace(/\s+/g, " ");
	if (normalized.length <= maxLength) return normalized;

	const truncated = normalized.slice(0, maxLength - 3).trimEnd();
	const lastSpace = truncated.lastIndexOf(" ");
	const base = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated;
	return `${base.trimEnd()}...`;
}

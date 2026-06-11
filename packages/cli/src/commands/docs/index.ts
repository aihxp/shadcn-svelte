import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import color from "picocolors";
import { z } from "zod";
import { SITE_BASE_URL } from "../../constants.js";
import { error } from "../../utils/errors.js";
import { handleError } from "../../utils/prompt-helpers.js";
import * as cliConfig from "../../utils/config/index.js";
import {
	getRegistryIndex,
	getRegistryUrl,
	getSiteUrl,
} from "../../utils/registry/index.js";
import type { RegistryIndexItem } from "../../utils/registry/schema.js";
import { resolveURL } from "../../utils/utils.js";

const docsOptionsSchema = z.object({
	cwd: z.string(),
	json: z.boolean(),
});

type DocsOptions = z.infer<typeof docsOptionsSchema>;

export const docs = new Command()
	.command("docs")
	.description("get docs, api references and usage examples for components")
	.argument("<components...>", "component names")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.option("--json", "output as JSON", false)
	.action(async (components: string[], opts) => {
		try {
			const options = docsOptionsSchema.parse({
				...opts,
				cwd: path.resolve(opts.cwd),
			});
			const result = await runDocs(components, options);

			if (options.json) {
				console.log(JSON.stringify(result, null, 2));
			} else {
				printDocs(result);
			}
		} catch (cause) {
			handleError(cause);
		}
	});

export async function runDocs(components: string[], options: DocsOptions) {
	const config = loadDocsConfig(options.cwd);
	const registryUrl = getRegistryUrl(config);
	const siteUrl = getSiteUrl(config);
	const index = await getRegistryIndex(registryUrl);

	return {
		registryUrl,
		results: components.map((component) => {
			const item = index.find((entry) => entry.name === component);
			if (!item) {
				throw error(`Component "${component}" does not exist in the registry at "${registryUrl}".`);
			}

			return {
				component,
				type: item.type,
				links: buildLinks(item, registryUrl, siteUrl),
			};
		}),
	};
}

function loadDocsConfig(cwd: string) {
	const config = cliConfig.loadConfig(cwd);

	return {
		registry: config?.registry ?? cliConfig.DEFAULT_CONFIG.registry,
		style: config?.style ?? cliConfig.DEFAULT_CONFIG.style,
	};
}

function buildLinks(item: RegistryIndexItem, registryUrl: string, siteUrl: string) {
	return {
		documentation: `${SITE_BASE_URL}${getDocsPath(item)}`,
		registryItem: resolveURL(registryUrl, `${item.name}.json`).toString(),
		registryIndex: resolveURL(registryUrl, "index.json").toString(),
		llms: `${siteUrl}/llms.txt`,
	};
}

function getDocsPath(item: RegistryIndexItem) {
	if (item.type === "registry:ui") {
		return `/docs/components/${item.name}`;
	}

	if (item.type === "registry:block") {
		return `/blocks/${item.name}`;
	}

	return "/docs/registry";
}

function printDocs(data: Awaited<ReturnType<typeof runDocs>>) {
	for (const result of data.results) {
		console.log(color.cyan(result.component));
		const maxKeyLength = Math.max(...Object.keys(result.links).map((key) => key.length));
		for (const [key, value] of Object.entries(result.links)) {
			console.log(`  ${key.padEnd(maxKeyLength + 2)}${value}`);
		}
		console.log();
	}
}

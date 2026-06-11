import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import { z } from "zod";
import { handleError } from "../../utils/prompt-helpers.js";
import * as cliConfig from "../../utils/config/index.js";
import { getRegistryItems, type RegistryConfigContext } from "../../utils/registry/index.js";

const viewOptionsSchema = z.object({
	cwd: z.string(),
});

type ViewOptions = z.infer<typeof viewOptionsSchema>;

export const view = new Command()
	.command("view")
	.description("view items from the registry")
	.argument("<items...>", "item addresses to view")
	.option("-c, --cwd <path>", "the working directory", process.cwd())
	.action(async (items: string[], opts) => {
		try {
			const options = viewOptionsSchema.parse({
				cwd: path.resolve(opts.cwd),
			});
			const payload = await runView(items, options);
			console.log(JSON.stringify(payload, null, 2));
		} catch (cause) {
			handleError(cause);
		}
	});

export async function runView(items: string[], options: ViewOptions) {
	const config = loadViewConfig(options.cwd);
	return getRegistryItems(items, { config });
}

function loadViewConfig(cwd: string): RegistryConfigContext {
	const config = cliConfig.loadConfig(cwd);

	return {
		registry: config?.registry ?? cliConfig.DEFAULT_CONFIG.registry,
		registries: config?.registries,
		style: config?.style ?? cliConfig.DEFAULT_CONFIG.style,
	};
}

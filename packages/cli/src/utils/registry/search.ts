import type { z } from "zod";
import { resolveGitHubRegistrySource } from "./address.js";
import { getRegistryCatalog } from "./index.js";
import * as schemas from "./schema.js";
import type { RegistryConfigContext } from "./namespaces.js";

const BUILTIN_REGISTRIES = new Set(["@shadcn"]);
const INTERNAL_TYPES = new Set(["registry:example", "registry:internal"]);
export const SEARCHABLE_TYPES = schemas.registryItemTypeSchema.options
	.filter((type) => !INTERNAL_TYPES.has(type))
	.map((type) => formatSearchResultType(type));

export function resolveSearchRegistries(
	registries: string[],
	config?: RegistryConfigContext
): string[] {
	if (registries.length > 0) return registries;

	return Object.keys(config?.registries ?? {}).filter(
		(registry) => !BUILTIN_REGISTRIES.has(registry)
	);
}

export async function searchRegistries(
	registries: string[],
	options: {
		query?: string;
		types?: string[];
		limit?: number;
		offset?: number;
		config?: RegistryConfigContext;
		continueOnError?: boolean;
	} = {}
) {
	let allItems: z.infer<typeof schemas.searchResultItemSchema>[] = [];
	const errors: z.infer<typeof schemas.searchResultErrorSchema>[] = [];

	for (const registry of registries) {
		try {
			const catalog = await getRegistryCatalog(registry, { config: options.config });
			allItems = allItems.concat(
				catalog.items.map((item) => ({
					name: item.name,
					type: item.type,
					description: item.description,
					registry,
					addCommandArgument: buildRegistryItemNameFromRegistry(item.name, registry),
				}))
			);
		} catch (cause) {
			if (!options.continueOnError) throw cause;
			errors.push({
				registry,
				message: cause instanceof Error ? cause.message : String(cause),
			});
		}
	}

	if (options.types?.length) {
		const wantedTypes = new Set(
			options.types.map((type) => formatSearchResultType(type).toLowerCase())
		);
		allItems = allItems.filter((item) => {
			const itemType = formatSearchResultType(item.type).toLowerCase();
			return itemType && wantedTypes.has(itemType);
		});
	}

	if (options.query) {
		const query = options.query.toLowerCase();
		allItems = allItems.filter((item) => {
			const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
			return haystack.includes(query);
		});
	}

	const offset = options.offset ?? 0;
	const limit = options.limit ?? allItems.length;
	const total = allItems.length;

	return schemas.searchResultsSchema.parse({
		pagination: {
			total,
			offset,
			limit,
			hasMore: offset + limit < total,
		},
		items: allItems.slice(offset, offset + limit),
		...(errors.length ? { errors } : {}),
	});
}

export function buildRegistryItemNameFromRegistry(name: string, registry: string) {
	const githubSource = resolveGitHubRegistrySource(registry);
	if (githubSource) {
		const itemAddress = `${githubSource.owner}/${githubSource.repo}/${name}`;
		return githubSource.ref ? `${itemAddress}#${githubSource.ref}` : itemAddress;
	}

	if (!isUrl(registry)) {
		return `${registry}/${name}`;
	}

	const url = new URL(registry);
	if (url.pathname.endsWith("/index.json")) {
		url.pathname = url.pathname.replace(/\/index\.json$/, `/${name}.json`);
		return url.toString();
	}
	if (url.pathname.endsWith("/registry.json")) {
		url.pathname = url.pathname.replace(/\/registry\.json$/, `/${name}.json`);
		return url.toString();
	}

	const segments = url.pathname.split("/");
	const registryIndex = segments.lastIndexOf("registry");
	if (registryIndex !== -1) {
		segments[registryIndex] = name;
		url.pathname = segments.join("/");
		return url.toString();
	}

	url.pathname = `${url.pathname.replace(/\/$/, "")}/${name}.json`;
	return url.toString();
}

export function formatSearchResultType(type?: string) {
	if (!type) return "";
	return type.startsWith("registry:") ? type.slice("registry:".length) : type;
}

export function findUnknownSearchTypes(types: string[]) {
	const valid = new Set(SEARCHABLE_TYPES.map((type) => type.toLowerCase()));

	return types.filter((type) => !valid.has(formatSearchResultType(type).toLowerCase()));
}

function isUrl(value: string) {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

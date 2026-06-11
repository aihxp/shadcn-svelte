import {
	components,
	changelog,
	darkMode,
	forms,
	gettingStarted,
	installation,
	migration,
	rtl,
	registry,
} from "$content/index.js";
import { error } from "@sveltejs/kit";
import type { Component } from "svelte";

const allDocs = [
	...gettingStarted,
	...migration,
	...components,
	...changelog,
	...installation,
	...darkMode,
	...forms,
	...rtl,
	...registry,
];

type DocResolver = () => Promise<{ default: Component; metadata: components }>;
type DocMetadata = (typeof allDocs)[number];
export type ChangelogPage = (typeof changelog)[number];

function transformPath(path: string): string {
	return path.replace("/content/", "").replace(".md", "").replace("/index", "").trim();
}

function getDocMetadata(slug: string): DocMetadata | undefined {
	return allDocs.find((doc) => doc.path === slug);
}

export async function getDoc(
	_slug: string
): Promise<{ component: Component; metadata: DocMetadata }> {
	const modules = import.meta.glob("/content/**/*.md");
	const slug = _slug === "" ? "index" : _slug;

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (transformPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();
	const metadata = getDocMetadata(slug);

	if (!doc || !metadata) {
		error(404, "Could not find the documentation page.");
	}

	return {
		component: doc.default,
		metadata,
	};
}

export function getChangelogPages(): ChangelogPage[] {
	return [...changelog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

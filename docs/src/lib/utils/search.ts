import type { Id } from "flexsearch";

export type SearchContent = {
	title: string;
	content: string;
	description: string;
	href: string;
	category: string;
	type: "page" | "heading" | "text";
	pageTitle: string;
};

export type SearchResult = SearchContent & {
	snippet?: string;
	highlights?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let titleIndex: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let contentIndex: any;
let content: SearchContent[] = [];

export async function createContentIndex(data: SearchContent[]) {
	if (import.meta.env.SSR) return;

	const { Index } = await import("flexsearch");

	titleIndex = new Index({
		tokenize: "forward",
		resolution: 9,
	});

	contentIndex = new Index({
		tokenize: "forward",
		resolution: 5,
	});

	data.forEach((item, i) => {
		titleIndex.add(i, item.title);
		contentIndex.add(i, `${item.content} ${item.description}`);
	});

	content = data;
}

function getContentSnippet(text: string, query: string, maxLength = 150): string {
	const words = query.toLowerCase().split(/\s+/);
	const textLower = text.toLowerCase();
	let bestIndex = -1;

	for (const word of words) {
		const index = textLower.indexOf(word);
		if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
			bestIndex = index;
		}
	}

	if (bestIndex === -1) {
		return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
	}

	const start = Math.max(0, bestIndex - Math.floor(maxLength / 2));
	const end = Math.min(text.length, start + maxLength);
	const snippet = text.slice(start, end);

	return (start > 0 ? "..." : "") + snippet + (end < text.length ? "..." : "");
}

function highlightMatches(text: string, query: string): string {
	const words = query
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 1);
	let highlighted = text;

	for (const word of words) {
		const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
		highlighted = highlighted.replace(regex, "<mark>$1</mark>");
	}

	return highlighted;
}

function substringMatch(text: string, query: string): boolean {
	return text.toLowerCase().includes(query.toLowerCase());
}

function normalizeSearchText(text: string): string {
	return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function getSearchScore(item: SearchContent, query: string, baseScore: number): number {
	const normalizedQuery = normalizeSearchText(query);
	const normalizedTitle = normalizeSearchText(item.title);
	const normalizedPageTitle = normalizeSearchText(item.pageTitle);
	let score = baseScore;

	if (normalizedTitle === normalizedQuery) {
		score += 40;
	} else if (normalizedPageTitle === normalizedQuery) {
		score += 35;
	} else if (normalizedTitle.startsWith(normalizedQuery)) {
		score += 25;
	} else if (normalizedTitle.split(" ").includes(normalizedQuery)) {
		score += 20;
	} else if (normalizedTitle.includes(normalizedQuery)) {
		score += 12;
	}

	if (item.type === "page") {
		score += 3;
	}

	return score;
}

export function searchContentIndex(query: string): SearchResult[] {
	if (!query.trim() || !titleIndex || !contentIndex) return [];

	const titleResults = titleIndex.search(query, { limit: 20 });
	const contentResults = contentIndex.search(query, { limit: 20 });
	const resultMap = new Map<Id, { score: number; source: string }>();

	for (const id of titleResults) {
		resultMap.set(id, { score: 10, source: "title" });
	}

	for (const id of contentResults) {
		const existing = resultMap.get(id);
		if (existing) {
			existing.score += 5;
		} else {
			resultMap.set(id, { score: 5, source: "content" });
		}
	}

	if (resultMap.size === 0) {
		content.forEach((item, idx) => {
			if (substringMatch(item.title, query)) {
				resultMap.set(idx, { score: 8, source: "substring-title" });
			} else if (
				substringMatch(item.content, query) ||
				substringMatch(item.description, query)
			) {
				resultMap.set(idx, { score: 3, source: "substring-content" });
			}
		});
	}

	const sortedResults = Array.from(resultMap.entries())
		.map(([idx, result]) => {
			const item = content[Number(idx)];
			return [idx, { ...result, score: getSearchScore(item, query, result.score) }] as const;
		})
		.sort(([idxA, a], [idxB, b]) => {
			if (b.score !== a.score) return b.score - a.score;
			const itemA = content[Number(idxA)];
			const itemB = content[Number(idxB)];
			return (
				itemA.title.length - itemB.title.length || itemA.title.localeCompare(itemB.title)
			);
		})
		.slice(0, 10);

	return sortedResults.map(([idx]) => {
		const item = content[Number(idx)];
		const snippet = getContentSnippet(item.content, query);
		return {
			...item,
			snippet: highlightMatches(snippet, query),
			highlights: query
				.toLowerCase()
				.split(/\s+/)
				.filter((w) => w.length > 1),
		};
	});
}

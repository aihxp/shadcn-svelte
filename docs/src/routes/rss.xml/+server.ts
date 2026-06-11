import { changelog } from "$content/index.js";
import { siteConfig } from "$lib/config.js";
import type { RequestHandler } from "@sveltejs/kit";

export const prerender = true;

export const GET: RequestHandler = async () => {
	const items = [...changelog]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.map((page) => {
			const link = `${siteConfig.url}/docs/changelog/${page.slug}`;
			return [
				"<item>",
				`<title>${escapeXml(page.title)}</title>`,
				`<link>${escapeXml(link)}</link>`,
				`<guid>${escapeXml(link)}</guid>`,
				`<description>${escapeXml(page.description)}</description>`,
				`<pubDate>${new Date(page.date).toUTCString()}</pubDate>`,
				"</item>",
			].join("");
		})
		.join("");

	const body = [
		'<?xml version="1.0" encoding="UTF-8" ?>',
		'<rss version="2.0">',
		"<channel>",
		`<title>${escapeXml(`${siteConfig.name} changelog`)}</title>`,
		`<link>${escapeXml(`${siteConfig.url}/docs/changelog`)}</link>`,
		`<description>${escapeXml("Latest shadcn-svelte updates and announcements.")}</description>`,
		items,
		"</channel>",
		"</rss>",
	].join("");

	return new Response(body, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
		},
	});
};

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

import { buildRegistryBase } from "$lib/registry/config.js";
import { error, json } from "@sveltejs/kit";
import { decodePreset } from "@aihxp/shadcn-svelte-lab/preset";

export async function GET({ request }) {
	const url = new URL(request.url);

	const preset = url.searchParams.get("preset");
	const presetConfig = decodePreset(preset ?? "");

	if (!preset || !presetConfig) {
		return error(400, { message: "Expected ?preset= parameter to be a valid preset" });
	}

	return json(buildRegistryBase(presetConfig));
}

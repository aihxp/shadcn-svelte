import path from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fetch } from "node-fetch-native";
import { runView } from "../../src/commands/view";

vi.mock("node-fetch-native", () => ({
	fetch: vi.fn(),
}));

describe("view command", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns registry item payloads", async () => {
		const item = {
			name: "button",
			title: "Button",
			type: "registry:ui",
			files: [
				{
					type: "registry:ui",
					target: "button/button.svelte",
					content: "<button />",
				},
			],
		} as const;
		vi.mocked(fetch).mockResolvedValueOnce({
			json: () => Promise.resolve(item),
			ok: true,
			status: 200,
			statusText: "OK",
		} as Response);

		const result = await runView(["https://example.com/registry/button.json"], {
			cwd: path.resolve(__dirname, "../fixtures/config-full"),
		});

		expect(result).toEqual([item]);
		expect(fetch).toHaveBeenCalledWith("https://example.com/registry/button.json", {});
	});
});

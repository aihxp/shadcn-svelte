import type { CssSchema } from "./registry/schema.js";
import { CLI_TAILWIND_CSS_IMPORT } from "../constants.js";

export function createGlobalCssFile(): string {
	return `
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));
`;
}

export const shadcnSvelteTailwindCssImport: CssSchema = {
	[`@import "${CLI_TAILWIND_CSS_IMPORT}"`]: {},
};

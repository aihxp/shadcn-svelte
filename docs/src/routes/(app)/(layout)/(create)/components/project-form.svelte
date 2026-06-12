<script lang="ts">
	import * as Dialog from "$lib/registry/ui/dialog/index.js";
	import * as Tabs from "$lib/registry/ui/tabs/index.js";
	import { Button, buttonVariants } from "$lib/registry/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
	import {
		UserConfigContext,
		type PackageManager as UserPackageManager,
	} from "$lib/user-config.svelte.js";
	import {
		getCommand,
		type PackageManager as CommandPackageManager,
	} from "$lib/package-manager.js";
	import { useDesignSystem } from "$lib/features/design-system/index.js";
	import CheckIcon from "@lucide/svelte/icons/check";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import FolderIcon from "@lucide/svelte/icons/folder";
	import SquareTerminalIcon from "@lucide/svelte/icons/square-terminal";

	type Props = {
		class?: string;
	};

	type Tab = "command" | "template";

	const packageManagers: UserPackageManager[] = ["pnpm", "npm", "yarn", "bun"];

	const templates = [
		{
			label: "SvelteKit",
			app: "templates/sveltekit-app",
			monorepo: "templates/sveltekit-monorepo",
		},
		{
			label: "Vite",
			app: "templates/vite-app",
			monorepo: "templates/vite-monorepo",
		},
		{
			label: "Astro",
			app: "templates/astro-app",
			monorepo: "templates/astro-monorepo",
		},
	] as const;

	let { class: className }: Props = $props();

	const designSystem = useDesignSystem();
	const userConfig = UserConfigContext.get();
	const clipboard = new UseClipboard();

	let open = $state(false);
	let activeTab = $state<Tab>("command");
	let copiedTarget = $state<string | undefined>();
	let selectedTemplate = $state<string>(templates[0].app);

	const command = $derived(`shadcn-svelte-lab init --preset ${designSystem.preset}`);
	const fullCommand = $derived(commandTextForPm(userConfig.current.packageManager));

	function commandTextForPm(agent: UserPackageManager) {
		const resolved = getCommand(agent as CommandPackageManager, "execute", command);
		return `${resolved.command} ${resolved.args.join(" ")}`.trim();
	}

	function selectPackageManager(agent: UserPackageManager) {
		userConfig.setConfig({ packageManager: agent });
	}

	async function copy(text: string, target: string) {
		await clipboard.copy(text);
		copiedTarget = target;
		window.setTimeout(() => {
			if (copiedTarget === target) copiedTarget = undefined;
		}, 2000);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: "default" }), className)}>
		<SquareTerminalIcon />
		Get Code
	</Dialog.Trigger>
	<Dialog.Content
		class="dark top-[64px] flex max-h-[calc(100svh-2rem)] max-w-lg translate-y-0 flex-col overflow-hidden rounded-2xl p-0 shadow-xl **:data-[slot=dialog-close]:top-4.5 **:data-[slot=dialog-close]:right-4"
	>
		<Dialog.Header class="border-b px-6 py-5">
			<Dialog.Title>Get Code</Dialog.Title>
			<Dialog.Description class="sr-only">
				Copy project commands and starter template paths.
			</Dialog.Description>
		</Dialog.Header>

		<Tabs.Root bind:value={activeTab} class="min-h-0">
			<div class="border-b px-6 py-3">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="command">Command</Tabs.Trigger>
					<Tabs.Trigger value="template">Template</Tabs.Trigger>
				</Tabs.List>
			</div>

			<Tabs.Content value="command" class="min-h-0">
				<div class="flex min-h-0 flex-col gap-4 overflow-y-auto px-6 py-5">
					<div class="grid grid-cols-4 gap-1 rounded-xl border p-1">
						{#each packageManagers as agent (agent)}
							<button
								type="button"
								class={cn(
									"text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-2 py-1.5 font-mono text-sm transition-colors",
									userConfig.current.packageManager === agent &&
										"bg-muted text-foreground"
								)}
								aria-pressed={userConfig.current.packageManager === agent}
								onclick={() => selectPackageManager(agent)}
							>
								{agent}
							</button>
						{/each}
					</div>

					<div class="bg-popover overflow-hidden rounded-xl border">
						<div class="no-scrollbar overflow-x-auto p-3">
							<code class="font-mono text-sm whitespace-nowrap">{fullCommand}</code>
						</div>
					</div>
				</div>

				<Dialog.Footer class="border-t p-6">
					<Button class="w-full" onclick={() => copy(fullCommand, "command")}>
						{#if copiedTarget === "command" && clipboard.copied}
							<CheckIcon />
						{:else}
							<CopyIcon />
						{/if}
						Copy Command
					</Button>
				</Dialog.Footer>
			</Tabs.Content>

			<Tabs.Content value="template" class="min-h-0">
				<div class="grid gap-3 overflow-y-auto px-6 py-5">
					{#each templates as template (template.label)}
						<div class="rounded-xl border p-3">
							<div class="mb-3 flex items-center gap-2 text-sm font-medium">
								<FolderIcon class="size-4" />
								{template.label}
							</div>
							<div class="grid grid-cols-2 gap-2">
								<button
									type="button"
									class={cn(
										"text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-2 text-left text-sm transition-colors",
										selectedTemplate === template.app &&
											"bg-muted text-foreground"
									)}
									aria-pressed={selectedTemplate === template.app}
									onclick={() => (selectedTemplate = template.app)}
								>
									App
								</button>
								<button
									type="button"
									class={cn(
										"text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-2 text-left text-sm transition-colors",
										selectedTemplate === template.monorepo &&
											"bg-muted text-foreground"
									)}
									aria-pressed={selectedTemplate === template.monorepo}
									onclick={() => (selectedTemplate = template.monorepo)}
								>
									Monorepo
								</button>
							</div>
						</div>
					{/each}

					<div class="bg-popover overflow-hidden rounded-xl border">
						<div class="no-scrollbar overflow-x-auto p-3">
							<code class="font-mono text-sm whitespace-nowrap"
								>{selectedTemplate}</code
							>
						</div>
					</div>
				</div>

				<Dialog.Footer class="border-t p-6">
					<Button class="w-full" onclick={() => copy(selectedTemplate, "template")}>
						{#if copiedTarget === "template" && clipboard.copied}
							<CheckIcon />
						{:else}
							<CopyIcon />
						{/if}
						Copy Path
					</Button>
				</Dialog.Footer>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>

<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { Button, type ButtonVariant, type ButtonSize } from "$lib/registry/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "outline",
		size = "default",
		disabled = false,
		children,
		...restProps
	}: AlertDialogPrimitive.CancelProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<AlertDialogPrimitive.Cancel bind:ref data-slot="alert-dialog-cancel" {disabled} {...restProps}>
	{#snippet child({ props })}
		<Button
			{variant}
			{size}
			{disabled}
			class={cn("cn-alert-dialog-cancel", className)}
			{...props}
		>
			{@render children?.()}
		</Button>
	{/snippet}
</AlertDialogPrimitive.Cancel>

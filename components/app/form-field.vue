<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="((props.type === 'number' || props.type === 'text') && 'input') || props.type"
      :name="props.name"
      :type="props.type || 'text'"
      :disabled="props.disabled"
      class="w-full"
      :class="{
        'input-error': props.error,
        'input': !props.type || props.type === 'text' || props.type === 'number',
        'textarea': props.type === 'textarea',
      }"
    />
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>

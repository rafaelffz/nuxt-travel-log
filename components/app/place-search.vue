<script setup lang="ts">
import type { FetchError } from "ofetch";

import { motion } from "motion-v";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";
import { getFetchErrorMessage } from "~/utils/get-fetch-error-message";

const emit = defineEmits<{
  (e: "resultSelected", result: NominatimResult): void;
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    errorMessage.value = "";
    searchResults.value = [];
    const results = await $fetch("/api/search", {
      query,
    });
    searchResults.value = results;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }

  loading.value = false;
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  hasSearched.value = false;
  errorMessage.value = "";
  if (form.value)
    form.value.resetForm();
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join">
        <div class="w-3xs">
          <label class="input join-item" :class="{ 'input-error': errors.q }">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              :disabled="loading"
              placeholder="Search for a location..."
            />
          </label>
          <div v-if="errors.q" class="validator-hint visible text-error">
            {{ errors.q }}
          </div>
        </div>
        <button class="btn btn-neutral join-item" :disabled="loading" type="submit">
          <span v-if="loading" class="loading loading-spinner" />
          <span v-else>Search</span>
        </button>
      </div>
    </Form>

    <motion.div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error mt-4"
      :initial="{ scale: 0 }"
      :animate="{ scale: 1 }"
      :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span> {{ errorMessage }} </span>
    </motion.div>

    <motion.div
      v-if="!loading && hasSearched && !searchResults.length"
      role="alert"
      class="alert alert-warning mt-4"
      :initial="{ scale: 0 }"
      :animate="{ scale: 1 }"
      :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span> No results found </span>
    </motion.div>

    <div class="flex flex-col overflow-auto gap-2 max-h-72">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location <Icon name="tabler:map-pin-check" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

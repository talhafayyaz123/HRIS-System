<script setup lang="ts">
import CreateEditForm from "./components/CreateEditForm/index.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Document Service",
      to: "/settings/document-service/template-list",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Template List"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-form :is-edit="false" />
  </div>
</template>

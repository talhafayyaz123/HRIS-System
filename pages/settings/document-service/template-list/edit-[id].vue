<script setup lang="ts">
import CreateEditForm from "./components/CreateEditForm/index.vue";
import commonCode from "~/composables/common";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router } = commonCode();
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Template List"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-form :id="router.params.id" :is-edit="true" />
  </div>
</template>

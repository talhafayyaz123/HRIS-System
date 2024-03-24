<script setup lang="ts">
import createEditAttachmentForm from "./components/createEditAttachmentForm.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { t } = useI18n();

const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Contract Management",
      to: "/",
    },
    {
      text: "Attachments",
      to: "/settings/contract-management/attachments",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Attachments"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-attachment-form />
  </div>
</template>

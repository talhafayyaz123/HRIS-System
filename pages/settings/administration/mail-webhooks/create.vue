<script setup lang="ts">
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

import CreateEditMailWebhooksForm from "./components/CreateEditMailWebhooksForm.vue";

const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Mail Webhooks",
      to: "/settings/administration/mail-webhooks",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Mail Webhooks"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-mail-webhooks-form />
  </div>
</template>

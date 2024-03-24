<script setup lang="ts">
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

import commonCode from "~/composables/common";
import CreateEditMailWebhooksForm from "./components/CreateEditMailWebhooksForm.vue";

import { computed } from "vue";
const { router, Toast } = commonCode();
const { t } = useI18n();
const id = router.params.id;

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
      text: "Mail Webhooks",
      active: true,
    },
  ],
  { title } = useTitle("Edit Mail Webhooks"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-mail-webhooks-form :id="id" />
  </div>
</template>

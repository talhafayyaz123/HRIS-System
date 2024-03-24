<script setup lang="ts">
import commonCode from "~/composables/common";
import createEditAttachmentForm from "./components/createEditAttachmentForm.vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const id = router.params.id;
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Attachments"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-attachment-form :id="id" />
  </div>
</template>

<script setup lang="ts">
import commonCode from "~/composables/common";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();
const id = router.params.id;
const breadCrumbsConfig = [
    {
      text: t("Global Settings"),
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Terms Of Payment",
      to: "/settings/global-settings/terms-of-payment",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Terms of Payment"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);
// Use the composable function to get translated columns

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-terms-form :id="id" />
  </div>
</template>

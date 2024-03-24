<script setup lang="ts">
import commonCode from "~/composables/common";
import { computed } from "vue";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();
const id = router.params.id;
const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Countries",
      to: "/settings/global-settings/countries",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Countries"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

useHead({
  title: `Edit Countries`,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <create-edit-countries-form :id="id" />
  </div>
</template>

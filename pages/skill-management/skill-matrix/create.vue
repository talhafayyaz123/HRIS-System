<script setup lang="ts">
import SkillMatrixFormData from "~/pages/skill-management/skill-matrix/component/skill-matrix-form-data.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const
    { t } = useI18n(),
    breadCrumbsConfig = [
        {
          text: "Admin portal",
          to: "/",
        },
        {
          text: "Skills Matrix",
          to: "/skill-management/skill-matrix",
        },
        {
          text: "Create",
          active: true,
        },
    ];
    const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Create Skill Matrix");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
      <div class="wizard-content">
          <!--=======================================================-->
          <skill-matrix-form-data
              :isUpdate="false"
          />
          <!--=======================================================-->
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import ProjectMilstone from '../components/MileStoneAddEdit.vue';
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  
  isUpdate = ref(false),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Projects",
      to: "/project-management/projects",
    },
    {
      text: "Milestones",
      to: "/project-management/projects/edit-"+router.params.id+'?milestone=1',
    },
    {
      text: "Create",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Milestone Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <ProjectMilstone
          :isUpdate="isUpdate"
          :projectId="router.params.id"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>

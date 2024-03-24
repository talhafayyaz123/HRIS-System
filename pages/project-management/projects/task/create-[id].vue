<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import TaskAddEdit from '../components/TaskAddEdit.vue';
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
      text: "Tasks",
      to: "/project-management/projects/edit-"+router.params.id+'?task=1',
    },
    {
      text: "Create",
      active: true,
    },
  ];

  const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Task Create");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="wizard-content">
      
      <!--=======================================================-->
        <TaskAddEdit
          :isUpdate="isUpdate"
          :projectId="router.params.id"
        />
      <!--=======================================================-->
    </div>
  </div>
</template>

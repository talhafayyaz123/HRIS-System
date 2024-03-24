<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import ProjectMilstone from '../../components/MileStoneAddEdit.vue'
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
projectId = ref(""),
milestoneId = ref(""),
isUpdate = ref(true),
currentPage = ref(1),
  { t } = useI18n(),

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
      to: "/project-management/projects/edit-"+ router.params.projectId+'?milestone=1',
    },
    {
      text: "Edit",
      active: true,
    },
  ];

  function refresh() {
    projectId.value = router.params.projectId;
    milestoneId.value = router.params.milestoneId;
}

refresh();
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Milestone Edit");

useHead({
    title: title,
    });
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div class="wizard-content">
      <!--=======================================================-->
      
        <div class="wizard-content">
       
        <ProjectMilstone
          :isUpdate="isUpdate"
          :projectId="projectId"
          :mileStoneId="milestoneId"
        /> 

    </div>
   

    </div>
  </div>
</template>

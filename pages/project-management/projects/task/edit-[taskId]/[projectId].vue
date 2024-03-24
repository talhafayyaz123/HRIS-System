<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import TaskAddEdit from '../../components/TaskAddEdit.vue';


const { router, Toast } = commonCode(),
projectId = ref(""),
taskId = ref(""),
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
      text: "Tasks",
      to: "/project-management/projects/edit-"+ router.params.projectId+'?task=1',
    },
    {
      text: "Edit",
      active: true,
    },
  ];

  function refresh() {
    projectId.value = router.params.projectId;
    taskId.value = router.params.taskId;
}

refresh();
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Task Edit");

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
       
        <TaskAddEdit
          :isUpdate="isUpdate"
          :projectId="projectId"
          :taskId="taskId"
        /> 

    </div>
   

    </div>
  </div>
</template>

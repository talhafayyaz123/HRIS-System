<script setup lang="ts">
import { ref, reactive,onBeforeMount  } from "vue";

import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

import commonCode from "~/composables/common";
import ProjectMilstone from './milestone/index.vue';
import ProjectTask  from './task/index.vue';
import ProjectBacklog from './backlog/index.vue';
import ProjectBoard from './board/index.vue';
import Overview from './overview/index.vue';
import Resource from './resource/index.vue';

const {
    apiRoute,
    data,
    listingFunc
  } = genericFunctionality();

const { router, Toast } = commonCode(),
projectId = ref(""),
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
      text: "Edit",
      active: true,
    },
  ],
  step = ref(1);


  onBeforeMount(() => {

      if(router.query){
        let queryString=router.query;
        if(queryString?.milestone==1){
          step.value=2;
        }else if(queryString?.task==1){
          step.value=3;
        }
       
      }
     
    });

  function refresh(page = 1,perPage = 10,column = "id",order = "asc",search = "") {
    projectId.value = router.params.id;
    apiRoute.value = routes.PROJECT_TASK;
    listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
    project_id:router.params.id
  });

}
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Project Edit");

useHead({
    title: title,
    });
refresh();

</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="tab-header">
      <ul class="">
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 1" :class="{ active: step === 1}">
            {{$t("Project Details")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 2"  :class="{ active: step === 2}">
            {{$t("Milestones")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 3"  :class="{ active: step === 3}">
            {{$t("Tasks")}}
           
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 4"  :class="{ active: step === 4}">
            {{$t("Backlog")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 5"  :class="{ active: step === 5}">
            {{$t("Resources")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 6"  :class="{ active: step === 6}">
            {{$t("Board")}}
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" @click="step = 7"  :class="{ active: step === 7}">
            {{$t("Overview")}}
          </button>
        </li>
      </ul>
    </div>
    <div class="wizard-content">
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 1">
      
        <div class="wizard-content">
          <project-detail
          :projectId="projectId"
          :isUpdate="isUpdate"
        />
    </div>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 2">
        <ProjectMilstone/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 3">
        <ProjectTask
        :tasks="data"
        />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 4">
       <ProjectBacklog
       />
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 5">
       <Resource :tasks="data?.project_tasks"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 6">
        <ProjectBoard  :tasks="data?.project_tasks"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
      <div class="" v-show="step === 7">
       <Overview  :tasks="data?.project_tasks"/>
      </div>
      <!--=======================================================-->
      <!--=======================================================-->
    </div>
  </div>
</template>

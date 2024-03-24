<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref,watch } from "vue";
import commonCode from "~/composables/common";
const { $listen,$event } = useNuxtApp();
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { t } = useI18n();
const props = defineProps({
  tasks: {
      type: Array,
      default: []
  }
  });

const {
    apiRoute,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    destroy,
  } = genericFunctionality(),
  { router } = commonCode();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Projects",
    active: true,
  },
];

const columnConfig = [
  {
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    label: "Planned Start Date",
    field: "planned_start_date",
    sortable: true,
  },
  {
    label: "Planned Finished Date",
    field: "planned_finished_date",
    sortable: true,
  },
  {
    label: "Actual Start Date",
    field: "actual_start_date",
    sortable: true,
  },
  {
    label: "Actual Finished Date",
    field: "actual_finished_date",
    sortable: true,
  },

  {
    label: "Earliest start date",
    field: "earliest_start_date",
    sortable: true,
  },
  {
    label: "Expected Finished Date",
    field: "expected_finished_date",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
];

apiRoute.value = routes.PROJECT_TASK;
const tasks = ref([])
    function refresh(
        page = 1,
        perPage = 10,
        column = "id",
        order = "desc",
        search = ""
) {
    listingFunc({
        page: page,
        perPage: perPage,
        sortBy:  column,
        sortOrder:order,
        search:  "",
        project_id:router.params.id
    });
}

watch(
  () => props.tasks,
  () => {
    tasks.value = props.tasks;
  }
);

watch(
  () => data.value,
  () => {
    tasks.value =data.value;
    $event('projectBoardBacklogTasks',1)
  }
);

$listen('updateProjectTasks', (id) => {
  listingFunc({
    page: 1,
    perPage: 10,
    sortBy:  "id",
    sortOrder:"asc",
    search:  "",
    project_id:router.params.id
  });
  
})
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Projects");

useHead({
    title: title,
    });
</script>

<template>
  <div>

      <div class="d-flex align-items-center justify-content-end">
        <NuxtLink :to="'/project-management/projects/task/create-'+router.params.id"> <button class="secondary-btn" Nuxt>{{ $t('Create Task') }}</button></NuxtLink>
      </div>
     <br>
    
    <Table
      class="doc-table"
      :key="tasks?.project_tasks?.length"
      :columns="columns"
      :rows="tasks?.project_tasks"
      editPath="/project-management/projects/task/edit-"
      :orderColumn="orderColumn"
      :orderDirection="orderDirection"
      @onSortChange="onSortChange"
      @destroy="destroy"
      isUUid=1
      :parentId=router.params.id
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :data="tasks"
    />
  </div>
</template>

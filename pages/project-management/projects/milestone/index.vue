<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";


const { t } = useI18n();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
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
    label: "earliest start date",
    field: "earliest_start_date",
    sortable: true,
  },
  {
    label: "expected Finished Date",
    field: "expected_finished_date",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
];
const rows = ref([]);
function refresh(
  page = 1,
  perPage = 10,
  column = "id",
  order = "asc",
  search = ""
) {
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
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Projects");

useHead({
    title: title,
    });
apiRoute.value = routes.PROJECT_MILESTONE;
refresh();
</script>

<template>
  <div>

      <div class="d-flex align-items-center justify-content-end">
        <NuxtLink :to="'/project-management/projects/milestone/create-'+router.params.id"> <button class="secondary-btn" Nuxt>{{ $t('Create MileStone') }}</button></NuxtLink>
      </div>
     <br>
    <Table
      class="doc-table"
      :key="data?.project_milestones?.length"
      :columns="columns"
      :rows="data?.project_milestones"
      editPath="/project-management/projects/milestone/edit-"
      @onSortChange="onSortChange"
      @destroy="destroy"
      isUUid=1
      :parentId=router.params.id
    />
  </div>
  <div class="mt-3">
    <Pagination
      @change="refresh"
      :totalPages="data?.totalPages"
      :nextPage="data?.nextPageUrl"
      :firstPageUrl="data?.firstPageUrl"
      :lastPageUrl="data?.lastPageUrl"
      :previousPageUrl="data?.previousPageUrl"
      :currentPage="currentPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import editCompany from "~/pages/time-trackers/company/editCompany.vue";
import { useTimeTrackerStore } from "~/store/timeTracker";
import { routes } from "~/utils/apiRoutes";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode();
const timeTackerStrore = useTimeTrackerStore();
const filters = timeTackerStrore.$state.filters;
const {
  apiRoute,
  currentPerPage,
  currentPage,
    orderColumn,
    orderDirection,
  data,
  listingFunc,
  onSortChange,
  handleSearch,
  destroy,
} = genericFunctionality(),
  { t } = useI18n(),

  columnConfig = [
    {
      label: "Type",
      field: "moduleType",
      sortable: true,
    },
    {
      label: "Object",
      field: "moduleId",
      sortable: true,
    },
    {
      label: "Description",
      field: "description",
      sortable: true,
    },
    {
      label: "Time",
      field: "time",
      sortable: true,
    },
    {
      label: "Customer",
      field: "company",
      sortable: true,
    },
    {
      label: "is Goodwill?",
      field: "isGoodwill",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
    { columns } = useTranslatedColumns(columnConfig),
    { title } = useTitle("Time Tracker");
  useHead({
  title: title,
});
function refresh() {
  listingFunc(filters);
}

apiRoute.value = routes.TIME_TRACKER;

const props = defineProps(["isModalOpen", "customers"]);

watch(
  () => props.isModalOpen,
  () => {
    if (!props.isModalOpen) {
      refresh();
    }
  }
);

watch(
  () => filters,
  (newFilters) => {
    if (!newFilters.userId) {
      filters.userId = localStorage.getItem("user_id") ?? null;
    }
    listingFunc(filters);
  },
  { deep: true }
)


watch(
  () => data,
  () => {
    if (data) {
      timeTackerStrore.$state.timeTrackerRecord=data;
    }
  },
  { deep: true }
);

const companyRecord = ref('');
const isEdit = ref(false);

function openModal(val: any) {
  isEdit.value = true;
  companyRecord.value = val;
}


function hideModal() {
  isEdit.value = false;
  listingFunc(filters);
}



refresh();

</script>
<template>
  
  <div class="table-responsive mt-3">
    <div class="table-responsive">
    
      <Table class="doc-table" :removeSerialAble="true" :key="data?.timeTrackerComapny?.length" :columns="columns" :isCustomBody="true"
        @onSortChange="onSortChange" isUUid=1  :orderColumn="orderColumn" :orderDirection="orderDirection">
        <tr v-if="data?.timeTrackerComapny?.length > 0"  v-for="(row) in data?.timeTrackerComapny" :key="row.id">
          <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">

            <span v-if="col.field === 'moduleId'">
              {{
                row.moduleType === "ticket"
                    ? row.additionalInfo
                        ?.ticketNumber ??
                      $t("N/A")
                    :row.moduleType ===
                      "travel-expense"
                    ? row.additionalInfo
                          ?.travelNumber ??
                      $t("N/A")
                    : row.moduleId ?? $t("N/A")
            }}

            </span>
            <span v-else-if="col.field === 'isGoodwill'">
              {{
                row.isGoodwill
                ? $t("Yes")
                : $t("No")
              }}

            </span>
            <span v-else>
              {{ row[col.field] }}
            </span>
          </td>
          <td>
            <ul class="list-inline table-action m-0">

              <li class="list-inline-item ml-1" @click="openModal(row)">
                  <ElementsIcon v-bind:icon="'editIcon'"/>
              </li>
              <li class="list-inline-item ml-1" @click="destroy(row.uuid, filters)">
                <ElementsIcon v-bind:icon="'deleteIcon'" />
              </li>
            </ul>
          </td>
          <td></td>
        </tr>
        <tr v-else>
          <td :colspan="columns ? (columns.length + 2) : 1" class="text-sm text-center">
            {{ $t("No Records Added") }}
          </td>
        </tr>
      </Table>
    </div>
  </div>

  <editCompany :showModal="isEdit" :customers="customers" :hideModal="hideModal" :companyRecord="companyRecord" />
</template>
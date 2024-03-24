<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import editGoverment from "~/pages/time-trackers/goverment/editGoverment.vue";
import { useTimeTrackerStore } from "~/store/timeTracker";
import { routes } from "~/utils/apiRoutes";
import {diff} from  '~/utils/helperFunctions';

const { router, Toast } = commonCode();
const timeTackerStrore = useTimeTrackerStore();
const timeTrackerRecord = timeTackerStrore.$state.timeTrackerRecord;
const filters = timeTackerStrore.$state.filters;
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

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
      label: "#",
      field: "count",
      sortable: false,
    },
    {
      label: "Type",
      field: "type",
      sortable: true,
    },
    {
      label: "Description",
      field: "description",
      sortable: true,
    },
    {
      label: "Start Time",
      field: "startTime",
      sortable: true,
    },
    {
      label: "End Time",
      field: "endTime",
      sortable: true,
    },
    {
      label: "Hours",
      field: "hours",
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
  title: title
});

function refresh() {
  //  useTimeTrackerStore.$state.timeTrackerRecord
}
 apiRoute.value = routes.TIME_TRACKER;
const props = defineProps(["isModalOpen", "goverments"]);
const govermentArray = ref([]);

watch(
  () => data,
  () => {
    if (data) {
     
      timeTackerStrore.$state.timeTrackerRecord=data;
    }
  },
  { deep: true }
);

watch(
  () => props.isModalOpen,
  () => {
    if (!props.isModalOpen) {
      refresh();
    }
  }
);

watch(
  () => timeTackerStrore.$state.timeTrackerRecord,
  () => {
    govermentArray.value = props?.goverments?.timeTrackerGovernment?.map((trackerData:any) => {
    return {
      ...trackerData,
      hours: diff(
        trackerData.startTime,
        trackerData.endTime
      ).toFixed(2),
    };
  });
  },
  { deep: true }
);


const govermentRecord = ref('');
const isEdit = ref(false);
const isUuid = ref('');

function openModal(val: any) {
  isEdit.value = true;
  isUuid.value = val.uuid;
  govermentRecord.value = val;
}


function hideModal() {
  isEdit.value = false;
  listingFunc(filters);
}

refresh();

</script>
<template>
 
  <div class="table-responsive mt-3 mb-0">
    <div class="table-responsive">
      <Table class="doc-table" :removeSerialAble="true"  :orderColumn="orderColumn" :orderDirection="orderDirection" :key="govermentArray?.length" :columns="columns"
        :isCustomBody="true" @onSortChange="onSortChange" isUUid=1>
        <tr v-if="govermentArray?.length > 0"
          v-for="(row, index) in govermentArray" :key="row?.id">
          <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">
           
            <span>
              <span v-show="col.field == 'count'">{{ index + 1 }}</span>
              {{ row[col.field] }}
            </span>
          </td>
          <td>
            <ul class="list-inline table-action m-0">

              <li class="list-inline-item ml-1 cursor-pointer" @click="openModal(row)">
                <ElementsIcon v-bind:icon="'editIcon'" />
              </li>
              <li class="list-inline-item ml-1 cursor-pointer" @click="destroy(row.uuid,filters)">
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

   <editGoverment :showModal="isEdit" :isUuid="isUuid" :hideModal="hideModal" :govermentRecord="govermentRecord" />
</template>
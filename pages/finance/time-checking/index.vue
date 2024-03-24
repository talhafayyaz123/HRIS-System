<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref , nextTick} from "vue";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
import editCompany from "./editCompany.vue";

const store = useLayoutStore();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
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
  updateFunc
} = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
  const {fetchListing} = genericFeatures();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Time Checking",
    active: true,
  },
];
const optionalItems = {
  searchBar: false,
  isBtnShow: false,
  btnText: "",
  path: "",
};

const columnConfig = [
  {
    label: "Date ",
    field: "date",
    sortable: true,
  },
  {
    label: "Type",
    field: "type",
    sortable: true,
  },
  {
    label: "Company",
    field: "companyName",
    sortable: true,
  },
  {
    label: "Person/Reference",
    field: "userName",
    sortable: true,
  },
  {
    label: "Activity Description",
    field: "description",
    sortable: true,
  },
  {
    label: "Quantity / Unit",
    field: "quantity",
    sortable: true,
  },
  {
    label: "Goodwill",
    field: "isGoodwill",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Time Checking");
 const state = reactive({
    companyId: "",
    userId: "",
    type: "",
    status: "",
  }),
  typeOptions = [
    { value: "task", name: "Task" },
    { value: "ticket", name: "Ticket" },
    { value: "ams", name: "AMS" },
    { value: "travel-expense", name: "Travel Expense" },
    { value: "newEntry", name: "New Entry" },
  ],

  statusOptions = [
    { value: "", name: "All" },
    { value: "1", name: "Accepted" },
    { value: "0", name: "Rejected" },
    { value: "2", name: "To Do" },
  ];

const employees=ref([]);
const isEdit = ref(false);
const companyRecord = ref('');
const customers=ref([]);
const rows = ref([]);
function refresh() {

  fetchListing(runtimeConfig.public.authBaseUrl + routes.LIST_USERS, {
    limit_start: 0,
    limit_count: 255,
    type: "employee",
  },true).then((response) => {
    employees.value = response?.value?.data?.map((manager: any) => {
      return {
        value: manager.id,
        name: manager.first_name + '  ' + manager.last_name,
      };
    });
  });

  fetchListing(routes.COMPANY).then((response: any) => {
    customers.value = response?.value?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id
      };
    });
  });


}


const getTimeCheckingRecord=async(page = 1,
  perPage = 10,
  column = "id",
  order = "desc",
  search = "")=>{
    await nextTick();
    listingFunc({
    page: page,
    perPage: perPage,
    sortBy: column,
    sortOrder: order,
    search: search,
    companyId:state.companyId,
    userId:state.userId,
    status:state.status,
    type:state.type
  });

}

const updateTimeCheckingStatus=(val:string,status:number)=>{
 
  let payLoad= {
      status: status,
  }
  updateFunc(payLoad,val);
  getTimeCheckingRecord();
}


function openModal(val: any) {
  isEdit.value = true;
  companyRecord.value = val;
}

function hideModal() {
  isEdit.value = false;
  getTimeCheckingRecord();
}


apiRoute.value = routes.TIME_CHECKING;
refresh();
getTimeCheckingRecord();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @watchEvent="handleSearch" />
    <div class="row">
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect @select="getTimeCheckingRecord" v-model="state.userId" :options="employees" :key="state.userId" label="name" track-by="value"
            :textLabel="$t('Person')" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect @select="getTimeCheckingRecord" v-model="state.companyId" :key="state.companyId" :options="customers" label="text" track-by="value"
            :textLabel="$t('Company')" />
        </div>
      </div>
      <div class="col-lg-3">
        {{state.type}}
        <div class="form-group">
          <elements-multiselect @select="getTimeCheckingRecord" v-model="state.type" :key="state.type" :options="typeOptions" label="name" track-by="value"
            :textLabel="$t('Type')" />
        </div>
      </div>
      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect @select="getTimeCheckingRecord" v-model="state.status" :key="state.status" :options="statusOptions" label="name" track-by="value"
            :textLabel="$t('Status')" />
        </div>
      </div>
    </div>
   
    <div class="row mt-3 mb-3">
      <div class="col-lg-3"></div>
      <div class="col-lg-3 text-center">
        <h2> {{data?.totaltime}} hours</h2>
        <p>Total Time</p>
      </div>
      <div class="col-lg-3 text-center">
        <h2>{{data?.kulnazTime}} hours</h2>
        <p>Kulanz Time</p>
      </div>
      <div class="col-lg-3"></div>
    </div>


      <Table class="doc-table" :key="data?.timeRecord?.length" :columns="columns" :isCustomBody="true"
            @onSortChange="onSortChange" isUUid=1 :removeSerialAble="true" :orderColumn="orderColumn"
            :orderDirection="orderDirection">


            <tr v-if="data?.timeRecord?.length > 0" v-for="(row, index) in data?.timeRecord" :key="row.id">

              <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">

                <span >
                  {{ row[col.field] }}
                </span>
              </td>
              <td>
                <ul class="list-inline table-action m-0">
                  <li class="list-inline-item ml-1" @click="openModal(row)">
                    <i class="mdi mdi-pencil edit-icon"></i>
                  </li>
                 

                <li class="list-inline-item ml-1"  v-if="row.status === null || row.status == 0 || row.status == false"  @click="updateTimeCheckingStatus(row.uuid, 1)">
                  <i class="mdi mdi-check"></i>
                  </li>
                  <li class="list-inline-item ml-1"  v-if="row.status === null || row.status == 1 || row.status == true"  @click="updateTimeCheckingStatus(row.uuid, 0)">
                    <i class="mdi mdi-close-octagon-outline"></i>
                  </li>
                </ul>
              </td>
              <td></td>
            </tr>

            <tr v-else>
              <td :colspan="columns?.length" class="text-sm text-center">
                {{ $t("No Records Added") }}
              </td>
            </tr>
          </Table>

  </div>
  <div class="mt-3">
    <Pagination :data="data" @change="refresh" />
  </div>
  <editCompany :showModal="isEdit" :customers="customers" :companyRecord="companyRecord" :hideModal="hideModal"/>
</template>

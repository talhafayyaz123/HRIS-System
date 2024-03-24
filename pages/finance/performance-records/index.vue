<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { getApiResponse, MethodType } from "~/utils/axiosFunctions";
import { useAppStore } from "~/store/app";
import CreatePerfromanceRecordModal from "./components/CreatePerformanceRecordModal.vue";
const { $event, $listen } = useNuxtApp();
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

import {
  getEmployeeByIdRequest,
  docSelectedListRequest,
  invoicePdfGenerationRequest
} from "~/utils/apiRequests";

const appStore = useAppStore();
appStore.setEmployees();
const layoutStore = useLayoutStore();
const { t } = useI18n();
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
  storeFunc,
  submitted
} = genericFunctionality(),
  { showGenericListing } = genericFeatures(),
  { router, Toast, deleteAlert } = commonCode();
apiRoute.value = routes.PERFORMANCE_RECORD;

const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Performance Records",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Manual Performance Record",
  path: "/finance/performance-records/create",
  modalBtn:true,
  modalBtnText:'Create Performance Record',
  modalBtnIcon:'addIcon',
};

const columnConfig = [
  {
    label: "#",
    field: "count",
    sortable: false,
  },
  {
    label: "LN Number",
    field: "performanceNumber",
    sortable: true,
  },
  {
    label: "Customer Number",
    field: "companyNumber",
    sortable: true,
  },
  {
    label: "Customer",
    field: "company",
    sortable: true,
  },
  {
    label: "Performance Period",
    field: "performancePeriod",
    sortable: true,
  },
  {
    label: "Hours",
    field: "totalHours",
    sortable: true,
  },
  {
    label: "Goodwill",
    field: "goodWillHours",
    sortable: true,
  },
  {
    label: "Invoice",
    field: "customInvoice",
    sortable: true,
  },
  {
    label: "Create Date",
    field: "createdDate",
    sortable: true,
  },
  {
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    label: "Updated At",
    field: "updatedAt",
    sortable: true,
  },
  {
    label: "Updated By",
    field: "updatedBy",
    sortable: true,
  },
  {
    label: "Generate Document",
    field: "generateDocument",
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
  { title } = useTitle("Performance Records");


// const formObj = {
//     startDate: "",
//     endDate: ""
// },
//     form = reactive({ ...formObj }),
//     rules = {
//         startDate: { required },
//         endDate: { required },
//     },
//     v$ = useVuelidate(rules, form);

const templateId = ref('');
const isLoading = ref(false);
const documentTemplates = ref([]);
const offerTemplateId = ref('');
const performanceRecords = ref({});
const performanceReqPayload = ref(
  {
    search: "",
    company: "",
    sortBy: "",
    sortOrder: "desc"
  }
);

const refresh = async () => {
  layoutStore.$state.loader = true;
  await showGenericListing(routes.PERFORMANCE_RECORD, performanceReqPayload.value).then((response: any) => {
    performanceRecords.value = response?.data ?? [];
  }).catch((e) => {
    console.log(e);
  }).finally(() => {
    layoutStore.$state.loader = false;
  });
  performanceRecords?.value?.records.forEach((el: object, index: number) => {
    let advisor = appStore.$state.employees.find(emp => emp.value === el.advisorId);
    performanceRecords.value.records[index] = {
      ...el,
      advisor: {
        id: advisor?.value,
        first_name: advisor?.first_name,
        last_name: advisor?.last_name,
        phone: advisor?.phone,
      }
    }
  });
}


const deleteRequest = async (uuid: string, payload: Object) => {
  await destroy(uuid, payload)
  refresh();
}

$listen("storePerformanceRecord", (data: any) => {

});

const generateProcessTemplate = async (item: any, type: any, documentType: any) => {
  // let userData = {};
  // if (type == "bulk") {
  //   userData = advisor;
  // } else {
  //   getUserDetail(item.advisorId);
  // }
  // let userData = {};
  // userData = item.advisor

  let payLoad = {
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    customerId: item.companyId,
  }

  if (documentTemplates.value) {
    let offerTemplate: any = {};
    offerTemplate = documentTemplates.value.find((el) => el.key === "perfRecordTemplateId");
    offerTemplateId.value = offerTemplate;
    templateId.value = offerTemplate.value;
  }

  layoutStore.$state.loader = true;
  await getApiResponse(`/performance-record/record/${item.uuid}`, true, MethodType.get, {}, payLoad).then((response: any) => {

    //Create template payload and process template
    if (templateId.value != "" && response?.data != "") {
      const templatePayload = {
        ...response?.data,
        id: templateId.value,
        userFirstName: item.advisor?.first_name,
        userLastName: item.advisor?.last_name,
        userPhone: item.advisor?.phone ?? 123456789,
        output: documentType,
        updatedTime: Date.now(),
      };
      invoicePdfGenerationRequest(templatePayload).then((response) => {
        // Create a Blob from the data
        const blob = new Blob([response], {
          type: `application/${documentType === "pdf"
            ? "pdf"
            : "vnd.openxmlformats-officedocument.wordprocessingml.document"
            }`,
        });

        // Create a URL for the file
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `performance-records-${item.performanceNumber}.${documentType}`);

        // Add the link to the DOM and click it to initiate the download
        document.body.appendChild(link);
        link.click();
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        layoutStore.$state.loader = false;
      });
    }

  })
};


const isModalOpen = ref(false);

function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}
// For edit case fetch the record
onMounted(async function () {
  try {
    const document = await docSelectedListRequest({ start: 0, count: 25 });
    documentTemplates.value = document?.data
  } catch (e) {
    console.log(e);
  }
});

refresh();


useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" @modalEvent="openModal"
      @watchEvent="handleSearch" />
    <CreatePerfromanceRecordModal :showModal="isModalOpen" :hideModal="hideModal" @refreshEvent="refresh"/>
    <Table class="doc-table" :orderColumn="orderColumn" :orderDirection="orderDirection"
      :key="performanceRecords?.records?.length" :columns="columns" :isCustomBody="true" @onSortChange="onSortChange"
      @destroy="destroy" uuid=1 :removeSerialAble="true">
      <tr v-if="performanceRecords?.records?.length > 0" v-for="(row, index) in performanceRecords?.records"
        :key="row?.id">
        <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">
          <span>
            <span v-show="col.field == 'count'">{{ index + 1 }}</span>
            <span v-show="col.field == 'customInvoice'">
              <span v-if="row.invoice &&
                row.invoice?.status === 'draft'
                " @click.stop="
    navigateTo(
      `/finance/invoices/edit-${row?.invoice.id}`
    )
    " class="cursor-pointer px-1 btn btn-sm btn-outline-secondary" icon="fa-solid fa-eye">{{
    row.invoice?.id
    ? 'Show Invoice'
    : 'Create Invoice' }}</span>
              <span v-else-if="row.invoice &&
                (row.invoice?.status === 'approved' ||
                  row.invoice?.status === 'sent')
                " @click.stop="
    navigateTo(`/finance/invoices`)
    " class="w-5 h-5 cursor-pointer btn btn-sm btn-outline-secondary">Show</span>
              <span v-else class="cursor-pointer px-1 btn btn-sm btn-outline-secondary" @click.stop="
                navigateTo(
                  row.invoice?.id
                    ? `/finance/invoices/edit-${row?.invoice.id}`
                    : `/finance/invoices/create?startDate=${row.startDate}&endDate=${row.endDate}&performanceRecord=${row.id}`
                )
                ">
                <!-- <ElementsIcon v-bind:icon="'eyeIcon'"></ElementsIcon> -->
                {{ row.invoice?.id
                  ? 'Show Invoice'
                  : 'Create Invoice' }}</span>
            </span>
            <span v-show="col.field == 'generateDocument'">
              <div class="cursor-pointer btn btn-sm btn-outline-secondary"
                @click="generateProcessTemplate(row, 'generate', 'pdf')">
                <ElementsIcon v-bind:icon="'docIcon'"></ElementsIcon>Generate Document
              </div>
            </span>
            <span class="text-capitalize" v-show="col.field == 'updatedBy'">{{ `${row?.advisor?.first_name}
                          ${row?.advisor?.last_name}` }}</span>
            <span class="text-capitalize" v-show="col.field == 'performancePeriod'">{{ `${row.startDate} - ${row.endDate}`
            }}</span>
            {{ row[col.field] }}
          </span>
        </td>
        <td>
          <ul class="list-inline table-action m-0" v-if="!row.invoice?.id">
            <li class="list-inline-item ml-1" @click="navigateTo({
              path: '/finance/performance-records/edit-' + row.uuid,
            })">
              <i class="mdi mdi-pencil edit-icon"></i>
            </li>
            <li class="list-inline-item ml-1" @click="deleteRequest(row.uuid, performanceReqPayload)">
              <ElementsIcon v-bind:icon="'deleteIcon'" />
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
    <Pagination @change="refresh" :totalPages="performanceRecords?.totalPages" :nextPage="performanceRecords?.nextPageUrl"
      :firstPageUrl="performanceRecords?.firstPageUrl" :lastPageUrl="performanceRecords?.lastPageUrl"
      :previousPageUrl="performanceRecords?.previousPageUrl" :currentPage="performanceRecords?.currentPage" />
  </div>
</template>

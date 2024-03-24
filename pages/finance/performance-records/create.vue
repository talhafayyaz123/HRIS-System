<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import AddEditModel from "~/components/Finance/performance-records/Add-Edit.vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { useAppStore } from "~/store/app";
import { getApiResponse, MethodType } from "~/utils/axiosFunctions";
import { useLayoutStore } from "@/store/layout";
const { $event, $listen } = useNuxtApp();
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


import {
  getEmployeeByIdRequest,
  docSelectedListRequest,
  invoicePdfGenerationRequest
} from "~/utils/apiRequests";



const runtimeConfig = useRuntimeConfig();
const appStore = useAppStore();
const layoutStore = useLayoutStore();
const { fetchListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc, onSortChange, orderDirection, orderColumn, currentPerPage,
    currentPage, destroy, data } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  companies = ref([]),
  managers = ref([]),
  templateId = ref(''),
  selectedCompany: any = ref([]),
  documentTemplates = ref([]),
  offerTemplateId = ref(''),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Performance Records",
      to: "/finance/performance-records",
    },
    {
      text: "Create",
      active: true,
    },
  ];

const isModalOpen = ref(false);
const isAdd = ref(true);
const editRecord = ref([]);

type performanceRecord = {
  companyId: string;
  advisorId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  entries: any;
  status: string;
  customerNumber: string;
}

const columnConfig = [
  {
    label: "Date",
    field: "date",
    sortable: true,
  },
  {
    label: "Person/Reference",
    field: "userId",
    sortable: true,
  },
  {
    label: "Activity Description",
    field: "description",
    sortable: true,
  },
  {
    label: "Quantity Unit",
    field: "quantity",
    sortable: true,
  },
  {
    label: "Goodwill",
    field: "isGoodwill",
    sortable: true,
  },

  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Create Performance Record");

const formObj: performanceRecord = {
  companyId: "",
  advisorId: "",
  projectId: "",
  startDate: "",
  endDate: "",
  entries: [],
  status: "open",
  customerNumber: "",
},
  form = reactive({ ...formObj }),
  validationRulesForm = {
    companyId: { required },
    startDate: { required },
    endDate: { required },
  },
  vForm$ = useVuelidate(validationRulesForm, form);
const refresh = async () => {
  fetchListing(routes.COMPANY).then((response: any) => {
    companies.value = response.value?.data?.customers.map((ts: any) => {
      return {
        value: ts.id,
        name: ts.name,
        number: ts.number,
        address: ts.location.addressFirst + "  " + ts.location.addressSecond,
        state: ts.location.state,
        country: ts.location.country?.name,
        code: ts.location.zip + ":  " + ts.location.city,
      };
    });
  });

  managers.value = appStore.$state.employees;

  fetchProjects();
};

const hideModal = () => {
  isAdd.value = true;
  isModalOpen.value = false;
};

const openModal = (index?: string) => {

  if (index !== undefined) {
    editRecord.value = form.entries[index];
    isAdd.value = false;
    editRecord.value = { ...editRecord.value, index };
  }

  isModalOpen.value = true;
};

const fileInput = ref(null);

const importFile = () => {
  fileInput.value.click();
};

const setCustomerNumber = async () => {
  await nextTick();
  let company: any = companies.value.filter(
    (item: any) => item.value === form.companyId
  );
  selectedCompany.value = company[0];
  form.customerNumber = company[0]?.number;
};

const uploadFile = async (event: any) => {
  try {
    layoutStore.changeLoaderValue(true);
    const file = event?.target?.files?.[0] ?? null;
    const formData = new FormData();
    formData.set("csv", file);
    await getApiResponse(routes.PERFORMANCE_RECORD_IMPORT_CSV, true, MethodType.post, formData).then((response: any) => {
      const timeTrackerRecords = response?.data ?? [];
      (timeTrackerRecords instanceof Array
        ? timeTrackerRecords
        : []
      ).forEach((record) => {
        const user = appStore.$state.employees?.find((user) => user?.text == record.advisor) ?? {};
        const modifiedRecord = {
          createdDate: record.date
            ? new Date(record.date).toISOString().slice(0, 10)
            : "",
          date: record.date
            ? new Date(record.date).toISOString().slice(0, 10)
            : "",
          description: record.activityDescription,
          isGoodwill: 0,
          quantity: record.time,
          taskNumber: record.taskNumber,
          time: record.time,
          userId: user.value,
        };
        form.entries = [
          ...form.entries,
          { ...modifiedRecord },
        ];
      });

    }).finally(() => {
      layoutStore.changeLoaderValue(false);
    })
  } catch (e) {
    console.log(e);
  }
};

const projects = ref([]);
const fetchProjects = async () => {
  fetchListing(routes.PROJECT_DETAIL).then((response: any) => {
    projects.value = response?.value?.data?.projects.map((project: any) => {
      return {
        text: project.name,
        value: project.uuid,
      };
    });
  });
};

function performanceEntry(data: any) {

  if (data?.index !== undefined) {
    form.entries.splice(data?.index, 1);
  }
  form.entries.push(data);

}
refresh();
const removeEntry = (index: string) => {
  form.entries.splice(index, 1);
};


const totalHours = computed(() => {
  let total = 0;
  (form.entries ?? []).forEach((record: any) => {
    if (record.isGoodwill == 0) total += +record.quantity;
  });
  return total;
})


const totalGoodwillHours = computed(() => {
  let total = 0;
  (form.entries ?? []).forEach((record: any) => {
    if (record.isGoodwill == 1) total += +record.quantity;
  });
  return total;
});


const createPerformanceRecord = () => {
  apiRoute.value = routes.PERFORMANCE_RECORD_STORE;
  let payLoad = {
    projectId: form.projectId,
    startDate: form.startDate,
    endDate: form.endDate,
    advisorId: form.advisorId,
    companyId: form.companyId,
    entries: form.entries,
    status: form.status ?? "open",
  }
  //storeFunc(payLoad,'/finance/performance-records');
  storeFunc(payLoad);
}

watch(
  () => data.value,
  (val) => {
    console.log(val.data);
    generateProcessTemplate(val.data, 'generate', 'pdf');
  }
);

// For edit case fetch the record
onMounted(async function () {
  try {
    const document = await docSelectedListRequest({ start: 0, count: 25 });
    documentTemplates.value = document?.data
  } catch (e) {
    console.log(e);
  }
});

const generateProcessTemplate = async (item: any, type: any, documentType: any) => {
  // let userData = {};
  // if (type == "bulk") {
  //   userData = advisor;
  // } else {
  //   getUserDetail(item.advisorId);
  // }
  let userData = {};
  userData = item.advisor

  let payLoad = {
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    customerId: item.companyId,
  }

  if (documentTemplates.value) {
    let offerTemplate: any = {};
    offerTemplate = documentTemplates.value.find((el: any) => el.key === "perfRecordTemplateId");
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
        userFirstName: userData?.first_name,
        userLastName: userData?.last_name,
        userPhone: userData?.phone ?? 123456789,
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
        link.setAttribute("download", "invoice");

        // Add the link to the DOM and click it to initiate the download
        document.body.appendChild(link);
        link.click();
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        layoutStore.$state.loader = false;
        navigateTo('/finance/performance-records');
      });
    }

  })
};

const downloadCsv = () => {
  const csvData = `
  Zusammenfassung,Vorgangsschlüssel,Vorgangs-ID,Vorgangstyp,Status,Projektschlüssel,Projektname,Projekttyp,Projektleiter,ID des Projektleiters,Projektbeschreibung,Priorität,Lösung,Zugewiesene Person,ID der zugewiesenen Person,Autor,ID des Autors,Ersteller,Ersteller-ID,Erstellt,Aktualisiert,Zuletzt angezeigt,Erledigt,Fälligkeitsdatum,Stimmen,Beschreibung,Umgebung,Beobachter,ID des Beobachters,Arbeit protokollieren,Ursprüngliche Schätzung,Restschätzung,Benötigte Zeit,Verhältnis tatsächlicher zu geschätzter Arbeit,Σ Ursprüngliche Schätzung,Σ Restschätzung,Σ Benötigte Zeit,Sicherheitsstufe,Anhang,Anhang,Anhang,Anhang,Anhang,Benutzerdefinierte Felder (Flagged),Benutzerdefinierte Felder (Issue color),Benutzerdefinierte Felder (Rank),Sprint,Benutzerdefinierte Felder (Start date),Benutzerdefinierte Felder (development),Statuskategorie,Übergeordnet,Parent summary
  use this column and place some dummy values
  `;
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample.csv';
  a.click();
  window.URL.revokeObjectURL(url);

}
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Configuration") }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4" v-if="form.customerNumber">
            <div class="form-group">
              <elements-input v-model="form.customerNumber" :label="$t('Customer Number')" :required="true"
                id="group-name" :disabled="true" type="number" />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="form.companyId" :options="companies" label="name" track-by="value"
                :textLabel="$t('Customer')" :class="{ 'is-invalid': vForm$.companyId.$error }" :required="true"
                :onSelect="setCustomerNumber" />
            </div>
            <div v-if="vForm$.companyId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="vForm$.companyId.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="form.projectId" :options="projects" label="text" track-by="value"
                :textLabel="$t('Project Reference')" :required="true" />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="form.advisorId" :options="managers" label="text" track-by="value"
                :textLabel="$t('Advisor')" :required="true" />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="form.startDate" :label="$t('Start Date')" :required="true" id="group-name"
                :disabled="submitted" :class="{ 'is-invalid': vForm$.startDate.$error }" type="date" />
            </div>
            <div v-if="vForm$.startDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="vForm$.startDate.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input v-model="form.endDate" :label="$t('End Date')" :required="true" id="group-name"
                :disabled="submitted" :class="{ 'is-invalid': vForm$.endDate.$error }" type="date" />
            </div>
            <div v-if="vForm$.endDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="vForm$.endDate.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4">
            <!-- <div class="form-group">
              <elements-select :required="true" v-model="newRecordObj.status" :label="$t('Status')"
                :error="v$.status.$error ? 'is-invalid' : ''">
                <option value="open">{{ $t("Open") }}</option>
                <option value="approved">{{ $t("Approved") }}</option>
                <option value="done">{{ $t("Done") }}</option>
              </elements-select>
            </div> -->
          </div>
        </div>

        <div v-if="form.customerNumber">
          <h6 class="text-xl font-normal leading-normal mb-2 text-cyan-800">
            Company Details
          </h6>

          <div class="w-1/4 bg-white rounded-md shadow mb-8 p-4">
            <p>
              {{ selectedCompany.name }} <br />{{ selectedCompany.address }}
              <br />{{ selectedCompany.code }}<br />
              {{ selectedCompany.state }} <br />{{ selectedCompany.country }}
            </p>
          </div>
        </div>
      </div>

      <div class="card-footer d-flex">
        <button class="secondary-btn" @click="importFile">
          {{ $t("Import") }}
        </button>
        <button class="secondary-btn ms-3" @click="downloadCsv">
          {{ $t("Download Sample") }}
        </button>
        <input @input="uploadFile" ref="fileInput" class="hidden d-none" accept=".csv" type="file" />
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center justify-content-end">
        <button class="secondary-btn" @click="openModal()">
          {{ $t("Add +") }}
        </button>
      </div>
      <div class="card-body">

        <div class="table-responsive mt-3">
          <Table class="doc-table" :key="form.entries?.length" :columns="columns" :isCustomBody="true"
            @onSortChange="onSortChange" isUUid=1 :removeSerialAble="true" :orderColumn="orderColumn"
            :orderDirection="orderDirection">


            <tr v-if="form.entries?.length > 0" v-for="(row, index) in form.entries" :key="row.id">

              <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">

                <span v-if="col.field === 'userId'">
                  {{ row?.userId[0]?.text }}

                  <!--  {{
              row?.type ===
              String.raw`App\Models\TicketComment`
                  ? "Ticket"
                  : row?.type ===
                    String.raw`App\Models\Task`
                  ? "Task"
                  : ""
          }}{{ row?.ticketNumber }} -->

                </span>

                <span v-else-if="col.field === 'isGoodwill'">

                  {{
                    row.isGoodwill == 1
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

                  <li class="list-inline-item ml-1" @click="openModal(index)">
                    <i class="mdi mdi-pencil edit-icon"></i>
                  </li>
                  <li class="list-inline-item ml-1" @click="removeEntry(index)">
                    <ElementsIcon v-bind:icon="'deleteIcon'" />
                  </li>
                </ul>
              </td>
              <td></td>
            </tr>


            <tr v-if="(form.entries ?? []).length > 0">
              <td class=""></td>
              <td class=""></td>
              <td class=""></td>
              <td style="grid-template-columns: 1fr 1fr" class="grid mt-4 justify-around font-bold bg-gray-300">
                <p style="justify-self: center">
                  {{ (totalHours) }}
                </p>
                <p>{{ $t("Hours") }}</p>
              </td>
              <td class=""></td>
              <td class=""></td>
            </tr>


            <tr v-if="(form.entries ?? []).length > 0">
              <td class=""></td>
              <td class=""></td>
              <td class=""></td>
              <td style="grid-template-columns: 1fr 1fr" class="grid my-1 justify-around font-bold bg-gray-300">
                <p style="justify-self: center">
                  {{ (totalGoodwillHours) }}
                </p>
                <p>{{ $t("Goodwill") }}</p>
              </td>
              <td class=""></td>
              <td class=""></td>
            </tr>

            <tr v-else>
              <td :colspan="columns?.length" class="text-sm text-center">
                {{ $t("No Records Added") }}
              </td>
            </tr>
          </Table>
        </div>
      </div>
    </div>
    <AddEditModel :showModal="isModalOpen" :hideModal="hideModal" :managers="managers" :isAdd="isAdd"
      :editRecord="editRecord" @performanceEntry="performanceEntry" />
    <div class="mt-4 d-flex align-items-center justify-content-end">

      <submittal-button @click="createPerformanceRecord()" v-if='form?.entries?.length' :buttonName="$t('Save')" />

    </div>
  </div>
</template>

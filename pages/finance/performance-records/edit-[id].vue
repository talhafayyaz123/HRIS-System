<script setup lang="ts">
import { ref, reactive, onBeforeMount,nextTick  } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import AddEditModel from "~/components/Finance/performance-records/Add-Edit.vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { useAppStore } from "~/store/app";
import TasksAccordion from "./Accordion/TasksAccordion.vue";
import TicketsAccordion from "./Accordion/TicketsAccordion.vue";
import AMSAccordion from "./Accordion/AMSAccordion.vue";
import NewEntryAccordion from "./Accordion/NewEntryAccordion.vue";
import { useLayoutStore } from "@/store/layout";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";



const runtimeConfig = useRuntimeConfig();
const appStore = useAppStore();
const layoutStore = useLayoutStore();
const { fetchListing } = genericFeatures(),
  {
    submitted,
    isLoading,
    apiRoute,
    storeFunc,
    onSortChange,
    orderDirection,
    orderColumn,
    currentPerPage,
    currentPage,
    destroy,
    updateFunc
  } = genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  companies = ref([]),
  managers = ref([]),
  selectedCompany: any = ref([]),
  actionType = ref("Add"),
  toggleModal = ref(false),
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
const isAdd = ref("insertSingle");
const recordToBeEdited = ref({});

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
  { title } = useTitle("Update Performance Records"),
formObj = {
  id: "",
  performanceNumber: "",
  customerNumber: "",
  company: "",
  project: "",
  advisor: "",
  createDate: "",
  startDate: "",
  endDate: "",
  timeTrackerRecords: [],
  updatedAt: "",
  isEdited: 0,
  editedUserId: 0,
  tasks: null,
  ticketComments: null,
  ams: null,
  newEntry: null,
  status: "open",
};

const hours = ref(0);
const goodwillHours = ref(0);
const openAccordions = ref([]);
const form = reactive({ ...formObj });

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

const toggleAccordion = (key: any) => {
  const index = openAccordions.value.indexOf(key);
  if (index === -1) {
    openAccordions.value.push(key);
  } else {
    openAccordions.value.splice(index, 1);
  }
};

const goodWillFind = (value: boolean) => {
  if (value) {
    return 1;
  } else {
    return 0;
  }
};

const editEntry = (record: any) => {
  recordToBeEdited.value = { ...record };

  let userId = managers.value.find((user: any) => user.value == record.userId);
  recordToBeEdited.value.userId = userId;
  recordToBeEdited.value.isGoodwill = goodWillFind(
    recordToBeEdited.value.isGoodwill
  );

  isAdd.value = "updateSingle";
  isModalOpen.value = true;
};

const hideModal = () => {
  isAdd.value = "insertSingle";
  fetchPerformanceRecordlist();
  isModalOpen.value = false;
};

const openModal = () => {
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
const uploadFile = (event: any) => {
  alert("Uploading");
};

const projects = ref([]);
const fetchProjects = async () => {
  fetchListing(routes.PROJECT_DETAIL).then((response: any) => {
    projects.value = response?.value?.data?.projects.map((project: any) => {
      return {
        text: project.name,
        value: project.uuid,
        id: project.id,
      };
    });
  });
};

refresh();

const updatePerformanceRecord = () => {
  apiRoute.value = routes.PERFORMANCE_RECORD;
  let PerformanceId = router.params.id;
  let payLoad= {
      projectId:form.project,
      startDate:  form.startDate,
      endDate:form.endDate,
      advisorId:form.advisor,
      editedUserId:form.editedUserId?.value,
      status: form.status ?? "open",
  }
  updateFunc(payLoad,PerformanceId);
    
};


const fetchPerformanceRecordlist = async() => {
  if (router.query) {
    let PerformanceId = router.params.id;
    layoutStore.$state.loader = true;

     fetchListing(routes.PERFORMANCE_RECORD + "/" + PerformanceId)
      .then((response: any) => {
        const {
          performanceNumber,
          createdDate,
          companyNumber,
          startDate,
          endDate,
          id,
          companyId,
          updatedAt,
          editedUserId,
          status,
          tasks,
          ticketComments,
          ams,
          newEntry,
          totalHours,
          totalGoodwillHours,
          projectId,
          advisor
        } = response.value?.data;
        form.performanceNumber = performanceNumber;
        form.createDate = createdDate;
        form.customerNumber = companyNumber;
        form.startDate = startDate;
        form.endDate = endDate;
        form.id = id;
        form.updatedAt = updatedAt;
        form.editedUserId = editedUserId;
        form.status = status;
        form.tasks = tasks;
        form.ticketComments = ticketComments;
        form.ams = ams;
        form.advisor = advisor;

        form.newEntry = newEntry;
        hours.value = totalHours;
        goodwillHours.value = totalGoodwillHours;
     
      
          let project= projects.value.find(
          (project: any) => project.id == projectId
        );
        if(project){
          form.project=project.value;
        }

        form.editedUserId = managers.value.find(
          (user: any) => user.value == editedUserId
        );

       

        let company = companies.value.find(
          (item: any) => item.value === companyId
        );

       if(company){
        form.company=company;
       }

      })
      .finally(() => {
        layoutStore.$state.loader = false;
      });
  }
};

onBeforeMount(() => {
  fetchPerformanceRecordlist();
});
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
              <elements-input
                v-model="form.performanceNumber"
                :label="$t('LN Number')"
                :disabled="true"
                type="text"
              />
            </div>
          </div>

          <div class="col-lg-4" v-if="form.customerNumber">
            <div class="form-group">
              <elements-input
                v-model="form.customerNumber"
                :label="$t('Customer Number')"
                :required="true"
                id="group-name"
                :disabled="true"
                type="number"
              />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="form.company.value"
                :options="companies"
                label="name"
                track-by="value"
                :key="form.company.value"
                :textLabel="$t('Customer')"
                :required="true"
                :onSelect="setCustomerNumber"
              />
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="form.project"
                :options="projects"
                :key="form.project"
                label="text"
                track-by="value"
                :textLabel="$t('Project Reference')"
                :required="true"
              />
            </div>
          </div>
        
    
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="form.advisor"
                :options="managers"
                :key="form.advisor"
                label="text"
                track-by="value"
                :textLabel="$t('Advisor')"
                :required="true"
              />
            </div>
          </div>

          <div class="col-lg-4" v-if="form.createDate">
            <div class="form-group">
              <elements-input
                v-model="form.createDate"
                :label="$t('Create Date')"
                :disabled="true"
                type="text"
              />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="form.startDate"
                :label="$t('Start Date')"
                :required="true"
                id="group-name"
                :disabled="submitted"
                type="date"
              />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="form.endDate"
                :label="$t('End Date')"
                :required="true"
                id="group-name"
                :disabled="submitted"
                type="date"
              />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-select
                v-model="form.status"
                :key="form.status"
                :label="$t('Status')"
              >
                <option value="open">{{ $t("Open") }}</option>
                <option value="approved">{{ $t("Approved") }}</option>
                <option value="done">{{ $t("Done") }}</option>
              </elements-select>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-input
              v-model="form.updatedAt"
              :label="$t('Updated At')"
              :disabled="true"
              type="date"
            />
          </div>
        </div>

        <div class="col-lg-4">
          <div class="form-group">
            <elements-multiselect
              v-if="form.isEdited"
              :key="form.isEdited"
              v-model="form.isEdited"
              :options="managers"
              label="text"
              track-by="value"
              :textLabel="$t('Updated By')"
              :required="true"
            />
          </div>
         
      <submittal-button
        @click="updatePerformanceRecord()"
      
        :buttonName="$t('Save')"
      />
    
          <div v-if="form.company">
            <h6 class="text-xl font-normal leading-normal mb-2 text-cyan-800">
              Company Details
            </h6>

            <div class="w-1/4 bg-white rounded-md shadow mb-8 p-4">
              {{ form.company?.name }} <br />{{ form.company?.address }}
              <br />{{ form.company?.code }}<br />
              {{ form.company?.state }} <br />{{ form.company?.country }}
              
            
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center justify-content-end">
        <button class="secondary-btn" @click="openModal()">
          {{ $t("Add +") }}
        </button>
      </div>
      <div class="card-body">
        <!-- Tasks Accordion -->
        <TasksAccordion
          v-if="form.tasks && form.tasks.length > 0"
          :tasks="form.tasks"
          :open-accordions="openAccordions"
          @toggle-accordion="toggleAccordion"
          @edit-entry="editEntry"
        />

        <!-- Tickets Accordion -->
        <TicketsAccordion
          v-if="form.ticketComments && form.ticketComments?.length > 0"
          :comments="form.ticketComments"
          @edit-entry="editEntry"
        />

        <!-- AMS Accordion -->
        <AMSAccordion
          v-if="form.ams && form.ams?.length > 0"
          :ams="form.ams"
          :open-accordions="openAccordions"
          @toggle-accordion="toggleAccordion"
          @edit-entry="editEntry"
        />

        <!-- New Entry Accordion -->

        <NewEntryAccordion
          v-if="form.newEntry?.length > 0"
          :entry="form.newEntry"
          @edit-entry="editEntry"
        />
      </div>

      <table class="w-full whitespace-nowrap mt-2">
        <tr v-if="hours != 0">
          <td colspan="5"></td>
          <td
            colspan="1"
            style="grid-template-columns: 1fr 1fr"
            class="grid mt-4 justify-around font-bold bg-gray-300"
          >
            <p style="justify-self: center">
              {{ hours }}
            </p>
            <p>{{ $t("Hours") }}</p>
          </td>
          <td colspan="1"></td>
        </tr>
        <tr v-if="goodwillHours != 0">
          <td colspan="5"></td>
          <td
            colspan="1"
            style="grid-template-columns: 1fr 1fr"
            class="grid my-1 justify-around font-bold bg-gray-300"
          >
            <p style="justify-self: center">
              {{ goodwillHours }}
            </p>
            <p>{{ $t("Goodwill") }}</p>
          </td>
          <td colspan="1"></td>
        </tr>
      </table>
    </div>

    <AddEditModel
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :managers="managers"
      :isAdd="isAdd"
      :editRecord="recordToBeEdited"
    />

 
  </div>
</template>

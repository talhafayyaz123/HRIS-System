<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import commonCode from "~/composables/common";
import {
  listEmployeesRequest,
  requestContactReportSourceRequest,
  leadRequest,
  customerRequest,
  requestReportCategoryRequest,
  contactReportCreateRequest,
  contactReportFileCreateRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useDropzone } from "vue3-dropzone";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const files = reactive({
  dropzoneFiles: [],
});

const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
  onDrop,
});
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  state = reactive({
    isLoading: false,
    submitted: false,
    subject: "",
    resubmitOn: "",
    text: "",
    type: "",
    assignee: "",
    createdBy: "",
    employees: [],
    initiatedBy: "",
    priority: "",
    contactType: "",
    customer: "",
    requestReportCategory: "",
    contractReportsSource: [],
    customerEmployees: [],
  }),
  employees = ref([]),
  customers = ref([]),
  leads = ref([]),
  companies = ref([]),
  talkedToPeople = ref([]),
  requestReportCategories = ref([]),
  contractReportsSources = ref([]),
  typeOptions = [
    { value: "customer", name: "Customer" },
    { value: "lead", name: "Lead" },
  ],
  initiatedByOptions = [
    { value: "customer", name: "Customer" },
    { value: "docshero", name: "Docshero" },
  ],
  priorityOptions = [
    { value: "low", name: "Low" },
    { value: "medium", name: "Medium" },
    { value: "High", name: "High" },
  ],
  contactTypeOptions = [
    { value: "mail", name: "Mail" },
    { value: "phone", name: "Phone" },
    { value: "facebook", name: "Facebook" },
    { value: "visit", name: "Visit" },
  ],
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Handouts",
      to: "/consulting/handouts",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  validationRules = {
    subject: { required },
    text: { required },
    type: { required },
    assignee: { required },
    createdBy: { required },
    employees: { required },
    initiatedBy: { required },
    priority: { required },
    contactType: { required },
    customer: { required },
    requestReportCategory: { required },
    customerEmployees: { required },
  },
  v$ = useVuelidate(validationRules, state),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { title } = useTitle("Handouts Create");

const changeValue = (val) => {
  state.customer = "";
  customers.value = [];
  talkedToPeople.value = [];
  state.customerEmployees = [];
  if (val == "customer") {
    customers.value = companies.value;
  }
  if (val == "lead") {
    customers.value = leads.value;
  }
};

const getLead = (val) => {
  talkedToPeople.value = [];
  state.customerEmployees = [];
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "customer",
    company_id: val,
  }).then((response) => {
    talkedToPeople.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  });
};

watch(isDragActive, () => {
  console.log("isDragActive", isDragActive.value, rest);
});

function onDrop(acceptFiles, rejectReasons) {
  console.log(acceptFiles);
  console.log(rejectReasons);
  files.dropzoneFiles = acceptFiles;
}

function handleClickDeleteFile(index) {
  files.dropzoneFiles.splice(index, 1);
}

function refresh() {
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "employee",
    company_id: "",
  }).then((response) => {
    employees.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  });

  requestContactReportSourceRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    contractReportsSources.value = response?.data?.data.map(
      (contractReportsSource: any) => {
        return {
          text: contractReportsSource.name,
          value: contractReportsSource.id,
        };
      }
    );
  });

  requestReportCategoryRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    requestReportCategories.value = response?.data?.data.map(
      (requestReportCategory: any) => {
        return {
          text: requestReportCategory.name,
          value: requestReportCategory.id,
        };
      }
    );
  });

  leadRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    leads.value = response?.data?.leads.map((lead: any) => {
      return {
        text: lead.name,
        value: lead.id,
      };
    });
  });

  customerRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    companies.value = response?.data?.customers.map((company: any) => {
      return {
        text: company.name,
        value: company.id,
      };
    });
  });

  state.assignee = localStorage.getItem("user_id");
  state.createdBy = localStorage.getItem("user_id");
}

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    createContactReport();
  }
};
const createContactReport = () => {
  try {
    state.isLoading = true;
    contactReportCreateRequest({
      subject: state.subject,
      resubmitOn: state.resubmitOn,
      text: state.text,
      type: state.type,
      customerId: state.customer,
      assigneeId: state.assignee,
      customerEmployees: state.customerEmployees,
      employees: state.employees,
      contactReportSources: state.contractReportsSource,
      createdBy: state.createdBy,
      priority: state.priority,
      categoryId: state.requestReportCategory,
      contactType: state.contactType,
      initiatedBy: state.initiatedBy,
    })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Contact report created successfully!"),
        });
        if (files.dropzoneFiles.length > 0) uploadFiles(response?.data?.id);
        state.isLoading = false;
        state.submitted = false;
        navigateTo("/contact-reports");
      })
      .catch((error) => {
        state.isLoading = false;
        state.submitted = false;
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  } catch (e) {
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    state.isLoading = false;
    state.submitted = false;
  }
};

const uploadFiles = (id) => {
  const formData = new FormData(); // pass data as a form
  for (var x = 0; x < files.dropzoneFiles.length; x++) {
    formData.append("files[]", files.dropzoneFiles[x]);
  }
  formData.append("contactReportId", id);
  contactReportFileCreateRequest(formData);
};
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="card">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
        <ElementsTooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.type"
                :options="typeOptions"
                label="name"
                track-by="value"
                :textLabel="$t('Customer')"
                :required="true"
                @select="changeValue"
                :class="{ 'is-invalid': v$.type.$error }"
              />
            </div>
            <div v-if="v$.type.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.type.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.customer"
                :options="customers"
                label="text"
                @select="getLead"
                track-by="value"
                :key="state.customer"
                :textLabel="$t('System')"
                :required="true"
                :class="{ 'is-invalid': v$.customer.$error }"
              />
            </div>
            <div v-if="v$.customer.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.customer.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <ElementsIcon v-bind:icon="'dateIcon'" />
                    </span>
                  </div>
              <elements-input
                v-model="state.resubmitOn"
                :label="$t('Creation Date')"
                id="group-name"
                :disabled="state.submitted"
                type="date"
              />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.subject"
                :label="$t('Consultant')"
                :required="true"
                id="subject"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.subject.$error }"
              />
            </div>
            <div v-if="v$.subject.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.subject.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex align-items-center justify-content-end">
      <button class="me-3 primary-btn">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        {{ $t('Cancel') }}
      </button>
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>

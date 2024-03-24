<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import commonCode from "~/composables/common";
import {
  listEmployeesRequest,
  requestContactReportSourceRequest,
  leadRequest,
  customerRequest,
  requestReportCategoryRequest,
  contactReportUpdateRequest,
  contactReportFileCreateRequest,
  contactReportShowRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "~/store/layout";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import DropZone from "@/components/DropZone.vue";
import { useDropzone } from "vue3-dropzone";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import genericFeatures from "~/composables/generic";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const files = reactive({
  dropzoneFiles: [],
});

const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
  onDrop,
});
const { router, Toast } = commonCode(),
  { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
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
  }),form = reactive({
    files: []
  }),
  isUpdate = ref(false),
  employees = ref([]),
  customers = ref([]),
  leads = ref([]),
  companies = ref([]),
  talkedToPeople = ref([]),
  requestReportCategories = ref([]),
  contractReportsSources = ref([]),
  contactReportId = router.params.id,
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
      text: "Contact Reports",
      to: "/contact-reports",
    },
    {
      text: "Edit",
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
  { title } = useTitle("Contact Reports Edit");

const changeValue = (val) => {
  if (isUpdate.value == true) {
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
  }
};

const getLead = (val) => {
  if (isUpdate.value == true) {
    talkedToPeople.value = [];
    state.customerEmployees = [];
    getTalkedToPeople(val);
  }
};

const removeFile = (index) => {
  form.files.splice(index, 1);
};

const addFiles = (files) => {
  form.files = files;
};

const getTalkedToPeople = (id) => {
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "customer",
    company_id: id,
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

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
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

  listEmployeesRequest({
    limit_start: 0,
    limit_count: 100,
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

  let contractReportsSourcesListing = await showGenericListing(
    routes.CONTACT_REPORT_SOURCE
  );
  if (!!contractReportsSourcesListing?.data?.data) {
    contractReportsSources.value = contractReportsSourcesListing.data.data.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }

  let reportCategoryListing = await showGenericListing(routes.REPORT_CATEGORY);
  if (!!reportCategoryListing?.data?.data) {
    requestReportCategories.value = reportCategoryListing.data.data.map(
      (ts: any) => {
        return { value: ts.id, text: ts.name };
      }
    );
  }

  getContactReport();
}

const getContactReport = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(false);
  contactReportShowRequest(contactReportId).then((response) => {
    state.subject = response?.data?.subject;
    state.resubmitOn = response?.data?.resubmitOn;
    state.text = response?.data?.text;
    state.type = response?.data?.type;
    if (response?.data?.type == "lead") customers.value = leads.value;
    else customers.value = companies.value;
    state.customer = response?.data?.customer?.id;
    getTalkedToPeople(state.customer);
    state.employees = response?.data?.employees;
    for (const item of response?.data?.contactReportSources) {
      state.contractReportsSource.push(item?.id);
    }
    state.assignee = response?.data?.assignee;
    state.createdBy = response?.data?.createdBy;
    state.priority = response?.data?.priority;
    state.requestReportCategory = response?.data?.reportCategory?.id;
    state.contactType = response?.data?.contactType;
    state.initiatedBy = response?.data?.initiatedBy;
    state.customerEmployees = response?.data?.customerEmployees;
    if(response?.data?.files.length > 0){
      form.files = response?.data?.files
    }
  });
  isUpdate.value = true;
};

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    updateContactReport();
  }
};
const updateContactReport = () => {
  try {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    state.isLoading = true;
    contactReportUpdateRequest(
      {
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
      },
      contactReportId
    )
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
        });
        if (form.files.length > 0) uploadFiles(response?.data?.id);
        state.isLoading = false;
        state.submitted = false;
        navigateTo("/contact-reports");
      })
      .catch((error) => {
        layout.changeLoaderValue(false);
        state.isLoading = false;
        state.submitted = false;
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    state.isLoading = false;
    state.submitted = false;
  }
};

const uploadFiles = (id) => {
  const formData = new FormData(); // pass data as a form
  form.files.forEach((file, index) => {
    // skip the files that are already uploaded
      formData.append("files[]", file);
    
  })
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
      <div class="card-header">
        <h3 class="card-title">{{ $t("Fill Contact Report Details") }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.subject"
                :label="$t('Subject')"
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
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.resubmitOn"
                :label="$t('Resubmit On')"
                id="group-name"
                :disabled="state.submitted"
                type="date"
              />
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group">
              <label>Text <span style="color: red">*</span></label>
              <MdEditor
                :preview="false"
                :style="'height:300px;'"
                :language="'en-US'"
                v-model="state.text"
                :class="{ 'is-invalid': v$.text.$error }"
              />
              <div v-if="v$.text.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.text.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.type"
                :options="typeOptions"
                label="name"
                track-by="value"
                :key="state.type"
                :textLabel="$t('Type')"
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
                :textLabel="$t('Customer')"
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
              <elements-multiselect
                v-model="state.customerEmployees"
                :options="talkedToPeople"
                label="text"
                track-by="value"
                :key="talkedToPeople.length"
                :textLabel="$t('Talked To People')"
                :required="true"
                :multiple="true"
                :class="{ 'is-invalid': v$.customerEmployees.$error }"
              />
            </div>
            <div v-if="v$.customerEmployees.$error" class="invalid-feedback">
              <span class="text-danger">{{ $t("This value is required") }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.assignee"
                v-model="state.assignee"
                :options="employees"
                label="text"
                track-by="value"
                :textLabel="$t('Assignee')"
                :required="true"
                :class="{ 'is-invalid': v$.assignee.$error }"
              />
            </div>
            <div v-if="v$.assignee.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.assignee.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>

          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.employees"
                :options="employees"
                :key="state.employees"
                label="text"
                track-by="value"
                :textLabel="$t('Employee')"
                :required="true"
                :multiple="true"
                :class="{ 'is-invalid': v$.employees.$error }"
              />
            </div>
            <div v-if="v$.employees.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.employees.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.contractReportsSource"
                v-model="state.contractReportsSource"
                :options="contractReportsSources"
                label="text"
                track-by="value"
                :multiple="true"
                :textLabel="$t('Contact Report Source')"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.createdBy"
                :options="employees"
                :key="state.createdBy"
                label="text"
                track-by="value"
                :textLabel="$t('Created By')"
                :required="true"
                :class="{ 'is-invalid': v$.createdBy.$error }"
              />
            </div>
            <div v-if="v$.createdBy.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.createdBy.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.priority"
                v-model="state.priority"
                :options="priorityOptions"
                label="name"
                track-by="value"
                :textLabel="$t('Priority')"
                :required="true"
                :class="{ 'is-invalid': v$.priority.$error }"
              />
            </div>
            <div v-if="v$.priority.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.priority.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.requestReportCategory"
                v-model="state.requestReportCategory"
                :options="requestReportCategories"
                label="text"
                track-by="value"
                :textLabel="$t('Category')"
                :required="true"
                :class="{ 'is-invalid': v$.requestReportCategory.$error }"
              />
            </div>
            <div
              v-if="v$.requestReportCategory.$error"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v$.requestReportCategory.required"
                >{{ $t("This value is required") }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.contactType"
                v-model="state.contactType"
                :options="contactTypeOptions"
                label="name"
                track-by="value"
                :textLabel="$t('Contact Type')"
                :required="true"
                :class="{ 'is-invalid': v$.contactType.$error }"
              />
            </div>
            <div v-if="v$.contactType.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.contactType.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                :key="state.initiatedBy"
                v-model="state.initiatedBy"
                :options="initiatedByOptions"
                label="name"
                track-by="value"
                :textLabel="$t('Initiated by')"
                :required="true"
                :class="{ 'is-invalid': v$.initiatedBy.$error }"
              />
            </div>
            <div v-if="v$.initiatedBy.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.initiatedBy.required">{{
                $t("This value is required")
              }}</span
              ><br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Fill Contact Report Files") }}</h3>
      </div>
      <div class="card-body">
        <drop-zone
        @removeFile="removeFile"
        @file-changed="addFiles"
        :productFiles="form"
        :removeInParent="true"
      />
        <!-- <div class="drop_box">
          <div v-if="files.dropzoneFiles.length > 0" class="files">
            <div
              class="file-item"
              v-for="(file, index) in files.dropzoneFiles"
              :key="index"
            >
              <span>{{ file.name }} </span>
              <span
                class="delete-file"
                style="color: red"
                @click="handleClickDeleteFile(index)"
              >
                Delete</span
              >
            </div>
          </div>
          <div v-else class="dropzone" v-bind="getRootProps()">
            <div
              class="border"
              :class="{
                isDragActive,
              }"
            >
              <input v-bind="getInputProps()" />
              <p v-if="isDragActive">Drop the files here ...</p>
              <p v-else>Drag and drop files here, or Click to select files</p>
            </div>
          </div> 
        </div> -->
      </div>
    </div>
    <div class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button
        @click="store()"
        :isLoading="state.isLoading"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>

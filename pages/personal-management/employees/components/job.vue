<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import {
  listEmployeesRequest,
  jobDataCreateRequest,
  jobDataShowRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import genericFunctionality from "~/composables/genericFunctionality";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  state = reactive({
    userId: "",
    isLoading: false,
    submitted: false,
    jobTitle: "",
    jobDescription: "",
    personalNumber: "",
    job: "",
    teams: [],
    departments: [],
    contractType: "",
    mentor: "",
    joinDate: "",
    probationPeriod: "",
    probationEndDate: "",
    exitDate: "",
    isMainJob: "",
    startAccountingDate: "",
    costCenter: "",
    isEmployeeLeasing: "",
    location: "",
    totalAnnualLeaves: "",
    additionalLeaves: "",
    targetValueYear: 0.0,
    targetValueMonth: 0.0,
    targetValueYearHours: 0.0,
    targetValueMonthHours: 0.0,
  }),
  contractTypes = [
    {
      value: "full",
      text: "Full Time",
    },
    {
      value: "part",
      text: "Part Time",
    },
  ],
  days = [
    {
      value: "monday",
      text: "Monday",
    },
    {
      value: "tuesday",
      text: "Tuesday",
    },
    {
      value: "wednesday",
      text: "Wednesday",
    },
    {
      value: "thursday",
      text: "Thursday",
    },
    {
      value: "friday",
      text: "Friday",
    },
    {
      value: "saturday",
      text: "Saturday",
    },
    {
      value: "sunday",
      text: "Sunday",
    },
  ],
  yesOrNoTypes = [
    {
      value: true,
      text: "Yes",
    },
    {
      value: false,
      text: "No",
    },
  ],
  trueOrFalseTypes = [
    {
      value: true,
      text: "True",
    },
    {
      value: false,
      text: "False",
    },
  ],
  store = () => {
    submitted.value = true;
    state.isLoading = true;
    //stop here if form is invalid
    v$.value.$touch();
    if (v$.value.$invalid) {
      state.isLoading = false;
      submitted.value = false;
      return false;
    } else {
      if (rows.value.length == 0) {
        state.isLoading = false;
        submitted.value = false;
        Toast.fire({
          icon: "error",
          title: t("Please add atleast one working hour"),
        });
        return false;
      } else {
        createJob();
      }
    }
  },
  emit = defineEmits(["jobDone", "backToDetails", "jobData"]),
  jobs = ref([]),
  teams = ref([]),
  employees = ref([]),
  departments = ref([]),
  locations = ref([]),
  children = reactive({
    isLoading: false,
    submitted: false,
    day: [],
    hour: "",
  }),
  validationRules = {
    jobTitle: { required },
    personalNumber: { required },
    contractType: { required },
    joinDate: { required },
    isMainJob: { required },
    startAccountingDate: { required },
    isEmployeeLeasing: { required },
    location: { required },
    totalAnnualLeaves: { required },
  },
  childrenRules = {
    day: { required },
    hour: { required },
  },
  v$ = useVuelidate(validationRules, state),
  v2$ = useVuelidate(childrenRules, children);
const rows = ref([]);
const props = defineProps({
  userProfileId: {
    type: String,
    default: "",
  },
});

const popRow = (index) => {
  rows.value.splice(index, 1);
};

watch(
  () => state.targetValueYear,
  (val) => {
    state.targetValueMonth = (val / 12).toFixed(2);
    state.targetValueYearHours = (val * 8).toFixed(2);
    state.targetValueMonthHours = (state.targetValueYearHours / 12).toFixed(2);
  }
);

watch(
  () => state.targetValueMonth,
  (val) => {
    state.targetValueYear = (val * 12).toFixed(2);
    state.targetValueYearHours = (state.targetValueYear * 8).toFixed(2);
    state.targetValueMonthHours = (state.targetValueYearHours / 12).toFixed(2);
  }
);

watch(
  () => state.targetValueYearHours,
  (val) => {
    state.targetValueMonthHours = (val / 12).toFixed(2);
    state.targetValueYear = (val / 8).toFixed(2);
    state.targetValueMonth = (state.targetValueYear / 12).toFixed(2);
  }
);

watch(
  () => state.targetValueMonthHours,
  (val) => {
    state.targetValueYearHours = (val * 12).toFixed(2);
  }
);

const createJob = () => {
  jobDataCreateRequest({
    employeeId: props.userProfileId,
    title: state.jobTitle,
    description: state.jobDescription,
    personalNumber: state.personalNumber,
    jobId: state.job,
    teams: state.teams,
    departments: state.departments,
    contractType: state.contractType,
    mentorId: state.mentor,
    joinDate: state.joinDate,
    probationPeriod: state.probationPeriod,
    probationEndDate: state.probationEndDate,
    exitDate: state.exitDate,
    isMainJob: state.isMainJob,
    isEmployeeLeasing: state.isEmployeeLeasing,
    startAccountingDate: state.startAccountingDate,
    costCenter: state.costCenter,
    workspaceLocationId: state.location,
    totalAnnualLeave: state.totalAnnualLeaves,
    additionalLeave: state.additionalLeaves,
    workingHours: rows.value,
    performanceTarget: {
      yearPt: state.targetValueYear,
      monthPt: state.targetValueMonth,
      yearHours: state.targetValueYearHours,
      monthHours: state.targetValueMonthHours,
    },
  })
    .then((response) => {
      state.isLoading = false;
      submitted.value = false;
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      emit("jobDone");
      var depttNames = [];
      var teamNames = [];
      for (const item of response?.data?.teams) {
        teamNames.push(item?.name);
      }
      for (const item of response?.data?.departments) {
        depttNames.push(item?.name);
      }
      emit("jobData", {
        jobTitle: state.jobTitle,
        personalNumber: state.personalNumber,
        depttNames: depttNames,
        teamNames: teamNames,
        locationId: response?.data?.workspaceLocation?.uuid,
      });
    })
    .catch((response) => {
      state.isLoading = false;
      submitted.value = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const jobList = () => {
  showGenericListing(routes.JOB).then((response: any) => {
    jobs.value = response?.data?.jobs.map((job: any) => {
      return {
        text: job.title,
        value: job.id,
      };
    });
  });
};

const locationList = () => {
  showGenericListing(routes.LOCATION).then((response: any) => {
    locations.value = response?.data?.locations.map((location: any) => {
      return {
        text: location.name,
        value: location.id,
      };
    });
  });
};

const teamList = () => {
  showGenericListing(routes.TEAM).then((response: any) => {
    teams.value = response?.data?.teams.map((team: any) => {
      return {
        text: team.name,
        value: team.id,
      };
    });
  });
};

const employeesList = () => {
  listEmployeesRequest({
    limit_start: 0,
    limit_count: 225,
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
};

const departmentList = () => {
  showGenericListing(routes.DEPARTMENT).then((response: any) => {
    departments.value = response?.data?.departments.map((department: any) => {
      return {
        text: department.name,
        value: department.id,
      };
    });
  });
};

const showCustomer = () => {
  jobDataShowRequest(props.userProfileId).then((response) => {
    if (response?.data.length !== 0) {
      const {
        title,
        description,
        personalNumber,
        contractType,
        mentor,
        joinDate,
        probationPeriod,
        probationEndDate,
        exitDate,
        isMainJob,
        startAccountingDate,
        costCenter,
        isEmployeeLeasing,
        totalAnnualLeaves,
        additionalLeave,
      } = response?.data;
      state.jobTitle = title;
      state.jobDescription = description;
      state.personalNumber = personalNumber;
      state.contractType = contractType;
      state.mentor = mentor;
      state.joinDate = joinDate;
      state.probationPeriod = probationPeriod;
      state.probationEndDate = probationEndDate;
      state.exitDate = exitDate;
      state.isMainJob = isMainJob;
      state.costCenter = costCenter;
      state.isEmployeeLeasing = isEmployeeLeasing;
      state.totalAnnualLeaves = totalAnnualLeaves;
      state.additionalLeaves = additionalLeave;
      state.startAccountingDate = startAccountingDate;
      rows.value = response?.data?.workingHours;
      state.location = response?.data?.workspaceLocation?.id;
      state.job = response?.data?.job?.id;
      state.targetValueYear = response?.data?.performanceTarget?.yearPt;
      state.targetValueMonth = response?.data?.performanceTarget?.monthPt;
      state.targetValueYearHours = response?.data?.performanceTarget?.yearHours;
      state.targetValueMonthHours =
        response?.data?.performanceTarget?.monthHours;

      var depttNames = [];
      var teamNames = [];
      for (const item of response?.data?.teams) {
        state.teams.push(item?.id);
        teamNames.push(item?.name);
      }
      for (const item of response?.data?.departments) {
        state.departments.push(item?.id);
        depttNames.push(item?.name);
      }
      emit("jobData", {
        jobTitle: state.jobTitle,
        personalNumber: state.personalNumber,
        depttNames: depttNames,
        teamNames: teamNames,
        locationId: response?.data?.workspaceLocation?.uuid,
      });
    }
  });
};

const refresh = () => {
  jobList();
  teamList();
  departmentList();
  employeesList();
  locationList();
  if (router.params.id) {
    showCustomer();
  }
};
const prev = () => {
  emit("backToDetails");
};

refresh();

const addChildren = () => {
  children.submitted = true;
  v2$.value.$touch();
  if (v2$.value.$invalid) {
    return false;
  } else {
    children.submitted = false;
    const obj = {
      day: children.day,
      hour: children.hour,
    };
    rows.value.push(obj);
    children.day = [];
    children.hour = "";
  }
};
</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Fill Job Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.jobTitle" :label="$t('Job Title')" :required="true" id="jobTitle"
                :disabled="state.submitted" :class="{ 'is-invalid': v$.jobTitle.$error }" />

            </div>
            <div v-if="v$.jobTitle.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.jobTitle.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.jobDescription" :label="$t('Job Description')" id="jobDescription"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.personalNumber" :label="$t('Personal Number')" id="personalNumber"
                :required="true" :disabled="state.submitted" :class="{ 'is-invalid': v$.personalNumber.$error }" />

            </div>
            <div v-if="v$.personalNumber.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.personalNumber.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.job" :options="jobs" label="text" :key="state.job" track-by="value"
                :textLabel="$t('Jobs')" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.teams" :options="teams" label="text" :multiple="true"
                :key="state.teams" track-by="value" :textLabel="$t('Teams')" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.departments" :options="departments" label="text" :multiple="true"
                :key="state.departments" track-by="value" :textLabel="$t('Departments')" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.contractType" :options="contractTypes" label="text"
                :key="state.contractType" track-by="value" :required="true" :textLabel="$t('Contract Type')" />

              <div v-if="v$.contractType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.contractType.required">{{
                  $t("This value is required")
                }}</span><br />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.mentor" :options="employees" label="text" :key="state.mentor"
                track-by="value" :textLabel="$t('Mentor')" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.joinDate" :label="$t('Join Date')" id="joinDate" type="date"
                  :required="true" :disabled="state.submitted" :class="{ 'is-invalid': v$.joinDate.$error }" />
              </div>
            </div>
            <div v-if="v$.joinDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.joinDate.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.probationPeriod" :label="$t('Probation Period Months')" id="joinDate"
                type="number" :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.probationEndDate" :label="$t('Probation End Date')" id="probationEndDate"
                  type="date" :disabled="state.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.exitDate" :label="$t('Exit Date')" id="exitDate" type="date"
                  :disabled="state.submitted" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.isMainJob" :options="yesOrNoTypes" label="text" :key="state.isMainJob"
                track-by="value" :required="true" :textLabel="$t('Is Main Job')"
                :class="{ 'is-invalid': v$.isMainJob.$error }" />


            </div>
            <div v-if="v$.isMainJob.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.isMainJob.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></span>
                </div>
                <elements-input v-model="state.startAccountingDate" :label="$t('Start Accounting Date')"
                  id="startAccountingDate" type="date" :required="true" :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.startAccountingDate.$error }" />
              </div>
            </div>
            <div v-if="v$.startAccountingDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.startAccountingDate.required">{{ $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.costCenter" :label="$t('Cost Center')" id="costCenter" type="number"
                :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.isEmployeeLeasing" :options="trueOrFalseTypes" label="text"
                :class="{ 'is-invalid': v$.isEmployeeLeasing.$error }" :key="state.isEmployeeLeasing" track-by="value"
                :required="true" :textLabel="$t('Is Employee Leasing')" />
              <div v-if="v$.isEmployeeLeasing.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.isEmployeeLeasing.required">{{ $t("This value is required")
                }}</span><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Assigned Location") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-multiselect v-model="state.location" :options="locations" label="text" :key="state.location"
                track-by="value" :required="true" :textLabel="$t('Location')"
                :class="{ 'is-invalid': v$.location.$error }" />

            </div>
            <div v-if="v$.location.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.location.required">{{
                $t("This value is required")
              }}</span><br />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Holidays") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.totalAnnualLeaves" :label="$t('Total Annual Leaves')" id="costCenter"
                type="number" :required="true" :disabled="state.submitted" />

            </div>
            <div v-if="v$.totalAnnualLeaves.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.totalAnnualLeaves.required">{{ $t("This value is required")
              }}</span><br />
            </div>
          </div>
          <div class="col-lg-4 col-md-4">
            <div class="form-group">
              <elements-input v-model="state.additionalLeaves" :label="$t('Additional Leaves for Year ') + new Date().getFullYear()
                " id="additionalLeaves" type="number" :disabled="state.submitted" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Working Hours") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect v-model="children.day" :options="days" label="text" :key="children.day"
                track-by="value" :multiple="true" :required="true" :textLabel="$t('Working Days')" :class="{
                  'is-invalid': v2$.day.$error && children.submitted,
                }" />
            </div>
            <div v-if="v2$.day.$error && children.submitted" class="invalid-feedback">
              <span class="text-danger" v-if="v2$.day.required && children.submitted">{{ $t("This value is required")
              }}</span><br />
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-group">
              <elements-input v-model="children.hour" :label="$t('Daily Hours')" :required="true" type="number" min="1"
                :class="{
                  'is-invalid': v2$.hour.$error && children.submitted,
                }" />

            </div>
            <div v-if="v2$.hour.$error && children.submitted" class="invalid-feedback">
              <span class="text-danger" v-if="v2$.hour.required && children.submitted">{{ $t("This value is required")
              }}</span><br />
            </div>
          </div>

        </div>

      </div>
    </div>
    <div v-if="rows.length > 0" class="row mt-3">
      <div class="col-md-12 d-flex align-items-center justify-content-end">
        <button @click.prevent="addChildren()" class="secondary-btn">
          <ElementsIcon v-bind:icon="'addIcon'" />
          {{ $t("Add Hours") }}
        </button>
      </div>
      <div class="col-12 mt-3">
        <div class="table-responsive">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("Working Days") }}</th>
                <th>{{ $t("Hours") }}</th>
                <th style="width:130px;">{{ $t("Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rows" :key="index">
                <td>
                  {{ item?.day }}
                </td>
                <td>{{ item?.hour }}</td>
                <td>
                  <div class="cursor-pointer">
                    <ElementsIcon v-bind:icon="'deleteIcon'" @click.prevent="popRow(index)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Performance Target") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="state.targetValueYear" :label="$t('Target value | year (PT)')" id="targetValueYear"
                type="number" :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="state.targetValueMonth" :label="$t('Target value | month (PT)')" id="costCenter"
                type="number" :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="state.targetValueYearHours" :label="$t('Target value | Year (hours)')"
                id="costCenter" type="number" :disabled="state.submitted" />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input v-model="state.targetValueMonthHours" :label="$t('Target value | month (hours)')"
                id="costCenter" type="number" :disabled="state.submitted" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3 d-flex align-items-center justify-content-end">
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button @click.prevent="store()" :isLoading="state.isLoading" :buttonName="$t('Save and Proceed')"
        :iconName="'saveIcon'" />
    </div>
  </div>
</template>

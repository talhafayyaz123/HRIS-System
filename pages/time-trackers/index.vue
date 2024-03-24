<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import addCompany from "./company/addCompany.vue";
import addGoverment from "./goverment/addGoverment.vue";
import Customer from "./company/index.vue";
import Goverment from "./goverment/index.vue";
import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import { useTimeTrackerStore } from "~/store/timeTracker";
import { listEmployeesRequest } from "~/utils/apiRequests";
import { numberFormatter, reportDateFormatter } from "~/utils/helperFunctions";
import { diff } from "~/utils/helperFunctions";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const { t } = useI18n();

type FilterType = {
  date?: Date;
  customerId?: string;
  userId?: string;
};

const timeTackerStrore = useTimeTrackerStore();
const filters: FilterType = timeTackerStrore.$state.filters;
const startTime: any = timeTackerStrore.$state.startTime;

const { showGenericListing } = genericFeatures();

const state = reactive({
  isLoading: false,
  submitted: false,
  groupName: "",
  name: "",
  startTime: "08:00:00",
});

const options = [
  { value: "batman", name: "Batman" },
  { value: "robin", name: "Robin" },
  { value: "joker", name: "Joker" },
];
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Time Trackers",
    active: true,
  },
],
{ items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ title } = useTitle("Time Trackers");

useHead({
  title: title,
});
const isModalOpen = ref(false);
const isGovermentModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function openGovermentModal() {
  isGovermentModalOpen.value = true;
}
const customers = ref([]);
const goverments = ref([]);
const employees = ref([]);

const totalVacationWorkingHours = ref(0);
const hoursSpecifiedOnTheDay = ref("");

async function companyList() {
  showGenericListing(routes.COMPANY).then((response: any) => {
    customers.value = response?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id,
        ams: customer.ams,
      };
    });
  });
}


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

const timeTrackerRecord: any = ref({});
const finalWorkingHours: any = ref(0);
watch(
  () => timeTackerStrore.$state.timeTrackerRecord,
  () => {
    timeTrackerRecord.value = timeTackerStrore.$state.timeTrackerRecord;
    hoursSpecifiedOnTheDay.value =
      timeTrackerRecord.value?.hoursSpecifiedOnTheDay;
    finalWorkingHours.value = totalWorkingHours();
  },
  { deep: true }
);

function hideModal() {
  isModalOpen.value = false;
}

function hideGovermentModal() {
  isGovermentModalOpen.value = false;
}

const totalWorkingHours = () => {
  let WorkingHours = 0;
  totalVacationWorkingHours.value = 0; // Reset the value before calculating

  if (timeTackerStrore.$state.timeTrackerRecord) {

    timeTackerStrore.$state.timeTrackerRecord?.timeTrackerGovernment?.forEach((timeTracker: any) => {
      if (timeTracker.type !== "break" && timeTracker.type !== "illness") {
        WorkingHours += +diff(timeTracker.startTime, timeTracker.endTime);
        if (timeTracker.type === "vacation") {
          totalVacationWorkingHours.value += +diff(
            timeTracker.startTime,
            timeTracker.endTime
          );
        }

      }
    });
  }

  return WorkingHours;
};

const calculateOvertime = () => {
  const totalDeductionHours: any =
    totalVacationWorkingHours.value + hoursSpecifiedOnTheDay.value;
  if (totalWorkingHours() > totalDeductionHours) {
    return totalWorkingHours() - totalDeductionHours;
  }
  return 0;
};

companyList();
employeesList();
</script>
    

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="time-traker">
      <div class="row">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header d-flex">
              <h3 class="card-title me-2">Time Account</h3>
              <ElementsTooltip />
            </div>
            <div class="card-body time-account mt-3">
              <ul>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Old") }}</span><br>
                      {{ reportDateFormatter(filters?.date, "en") }}
                    </h4>
                    <h3>{{
                      numberFormatter(
                        "en",
                        timeTrackerRecord?.oldWorkedHours || 0,
                        2,
                        2
                      )
                    }} H</h3>
                  </div>
                </li>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Constantly") }}</span><br>
                      {{ reportDateFormatter(filters?.date, "en") }}
                    </h4>
                    <h3>{{
                      numberFormatter(
                        "en",
                        timeTrackerRecord?.tillNowWorkedHours || 0,
                        2,
                        2
                      )
                    }} H</h3>
                  </div>
                </li>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Total") }}</span><br>
                      {{ reportDateFormatter(filters?.date, "en") }}
                    </h4>
                    <h3>{{
                      numberFormatter(
                        "en",
                        parseFloat(timeTrackerRecord?.oldWorkedHours) +
                        parseFloat(timeTrackerRecord?.tillNowWorkedHours) || 0,
                        2,
                        2
                      )
                    }} H</h3>
                  </div>
                </li>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Overtime this month") }}</span><br>
                      {{ reportDateFormatter(filters?.date, "en") }}
                    </h4>
                    <h3>{{
                      numberFormatter(
                        "en",
                        timeTrackerRecord?.currentMonthOvertime || 0,
                        2,
                        2
                      )
                    }} H</h3>
                  </div>
                </li>

              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header d-flex">
              <h3 class="card-title me-2">Holidays</h3>
              <ElementsTooltip />
            </div>
            <div class="card-body holidays mt-3">
              <!-- <h2>5 Days</h2>
              <p>Remaining</p> -->
              <ul>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Consumed") }}</span><br>
                    </h4>
                    <h3>{{ timeTrackerRecord?.totalAnnualLeavesAvailed || 0 }} D</h3>
                  </div>
                </li>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Planned") }}</span><br>
                    </h4>
                    <h3>{{ timeTrackerRecord?.totalMonthlyAnnualLeavesPlanned || 0 }} D</h3>
                  </div>
                </li>
                <li>
                  <div class="d-flex justify-content-between">
                    <h4>
                      <span>{{ t("Remaining") }}</span><br>
                    </h4>
                    <h3>{{
                      timeTrackerRecord?.totalAnnualLeavesAvailed +
                      timeTrackerRecord?.totalMonthlyAnnualLeavesPlanned -
                      timeTrackerRecord?.totalAnnualLeaves
                    }} D</h3>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card h-auto">
            <div class="card-header d-flex">
              <h3 class="card-title me-2">Working Hours</h3>
              <ElementsTooltip />
            </div>
            <div class="card-body working-hours">
            </div>
          </div>
          <div class="card mt-3 h-auto">
            <div class="card-header d-flex">
              <h3 class="card-title me-2">Invoice</h3>
              <ElementsTooltip />
            </div>
            <div class="card-body Invoice">
            </div>
          </div>
        </div>
      </div>
      <div class="px-5 py-4">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <ElementsIcon v-bind:icon="'dateIcon'" />
                  </span>
                </div>
                <elements-input v-model="filters.date" :label="$t('Date')" :required="true" id="group-name"
                  :disabled="state.submitted" type="date" />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <ElementsIcon v-bind:icon="'buildingIcon'" />
                  </span>
                </div>
                <elements-multiselect v-model="filters.customerId" :options="customers" label="text" track-by="value"
                  :textLabel="$t('Company')" :required="true" />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <ElementsIcon v-bind:icon="'userIcon'" />
                  </span>
                </div>
                <elements-multiselect v-model="filters.userId" :options="employees" label="text" track-by="value"
                  :textLabel="$t('User')" :required="true" />
              </div>
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
                <elements-input v-model="startTime" :label="$t('Start Time')" :required="true" id="group-name"
                  :disabled="state.submitted" type="time" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-12">
          <div class="card-header px-4 py-2 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <h3 class="card-title me-2">Legal time reporting</h3>
              <ElementsTooltip />
            </div>
            <button class="secondary-btn" @click="openGovermentModal">
              <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Log new time for legal time reporting") }}
            </button>
          </div>
          <div class="">
            <Goverment :isModalOpen="isGovermentModalOpen" :goverments="timeTackerStrore.$state.timeTrackerRecord" />
          </div>
          <div class="d-flex align-items-center justify-content-between legal-time-report">
            <p>
              <span>Final end time:</span>

              {{ numberFormatter("en", finalWorkingHours || 0, 2, 2) }}
              {{ $t("hr(s)") }}
            </p>
            <p>
              <span>Overtime:</span>
                {{ numberFormatter("en", calculateOvertime() || 0, 2, 2) }}
                {{ $t("hr(s)") }}
            </p>
          </div>
        </div>
        <div class="col-lg-12 mt-3">
          <div class="card-header px-4 py-2 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <h3 class="card-title me-2">{{$t("Customer")}}</h3>
              <ElementsTooltip />
            </div>
            <button class="secondary-btn" @click="openModal">
              <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Log new time for customer") }}
            </button>
          </div>
          <div class="">
            <Customer :isModalOpen="isModalOpen" :customers="customers" />
          </div>
        </div>
      </div>
    </div>
    <addCompany :showModal="isModalOpen" :hideModal="hideModal" :customers="customers" />
    <addGoverment :showModal="isGovermentModalOpen" :hideModal="hideGovermentModal" />
  </div>
</template>

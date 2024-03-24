<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import {
  updateRuleRequest,
  eventNameListRequest,
  rolesRequest,
  ruleByIdRequest,
} from "~/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "@/store/layout";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { showGenericListing } = genericFeatures();
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Licensing",
      to: "/",
    },
    {
      text: "Rules",
      to: "/settings/licensing/rules",
    },
    {
      text: "Edit",
      active: true,
    },
  ],

  { title } = useTitle("Edit Rules"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),

  resetTypes = [
    {
      value: "add",
      text: "add",
    },
    {
      value: "dec",
      text: "dec",
    },
    {
      value: "max",
      text: "max",
    },
    {
      value: "min",
      text: "min",
    },
    {
      value: "set",
      text: "set",
    },
  ],
  denyIfOps = [
    {
      value: ">",
      text: ">",
    },
    {
      value: "<",
      text: "<",
    },
  ],
  statusOptions = [
    {
      value: 1,
      text: "Active",
    },
    {
      value: 0,
      text: "Inactive",
    },
  ],
  days = ref([...Array.from({ length: 31 }, (_, i) => i + 1)]),
  secondsData = ref([...Array(61).keys()]),
  minutesData = ref([...Array(61).keys()]),
  hoursData = ref([...Array(24).keys()]),
  months = ref([
    {
      name: "January",
      value: "01",
    },
    {
      name: "February",
      value: "02",
    },
    {
      name: "March",
      value: "03",
    },
    {
      name: "April",
      value: "04",
    },
    {
      name: "May",
      value: "05",
    },
    {
      name: "June",
      value: "06",
    },
    {
      name: "July",
      value: "07",
    },
    {
      name: "August",
      value: "08",
    },
    {
      name: "September",
      value: "09",
    },
    {
      name: "October",
      value: 10,
    },
    {
      name: "November",
      value: 11,
    },
    {
      name: "December",
      value: 12,
    },
  ]),
  products = ref([]),
  eventNames = ref([]),
  roles = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    ruleName: "",
    eventId: "",
    productId: "",
    roleId: "",
    minValue: 0,
    maxValue: 0,
    value: 0,
    denyIfValue: 0,
    config: "",
    resetType: "",
    resetValue: 0,
    resetFrequencyHours: 0,
    denyIfOp: "",
    day: "",
    month: [],
    hour: "",
    minute: "",
    second: "",
    resetPattern: "* * * * * *",
    status: "",
  }),
  validationRules = {
    ruleName: { required },
    minValue: { required },
    maxValue: { required },
    value: { required },
    denyIfValue: { required },
    config: { required },
    resetType: { required },
    resetValue: { required },
    resetFrequencyHours: { required },
    denyIfOp: { required },
    status: { required },
  },
  v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      updateRule();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

watch(
  [
    () => state.day,
    () => state.month,
    () => state.hour,
    () => state.minute,
    () => state.second,
  ],
  () => {
    calculateResetPattern();
  }
);

const nextSchedulesDates = computed(function () {
  let schedulesDates = [];
  for (let i = 0; i < 5; i++) {
    let date = "";
    for (let j = 0; j < state.month.length; j++) {
      date =
        date +
        `${new Date().getFullYear() + i}-${state.month[j]}-${state.day} ${
          state.hour
        }:${state.minute}:${state.second}${state.month[j + 1] ? ", " : ""}`;
    }
    schedulesDates.push(date);
  }
  return schedulesDates;
});

// creates a crontab expression based on the second, minute, dayOfMonth, month and dayOfWeek
const calculateResetPattern = () => {
  // since we are using double digit number strings we must convert them to integer and also check for NaN
  let expression = `${isNaN(+state.second) ? state.second : +state.second} ${
    isNaN(+state.minute) ? state.minute : +state.minute
  } ${isNaN(+state.hour) ? state.hour : +state.hour} ${
    isNaN(+state.day) ? state.day : +state.day
  } `;
  // month will be an array og objects so we fetch the value from it and join it with "," if values are mutliple
  let months = state.month.map((month) => (isNaN(+month) ? month : +month));
  expression += months.join(",");

  expression += " " + "*";
  state.resetPattern = expression;
};

// creates a crontab expression based on the second, minute, dayOfMonth, month and dayOfWeek
const syncResetPattern = () => {
  const tokens = state.resetPattern.split(" ");
  state.second = tokens[0] ?? state.second;
  state.second = state.second < 10 ? state.second : state.second;
  state.minute = tokens[1] ?? state.minute;
  state.minute = state.minute < 10 ? state.minute : state.minute;
  state.hour = tokens[2] ?? state.hour;
  state.hour = state.hour < 10 ? state.hour : state.hour;
  state.day = tokens[3] ?? state.day;

  if (/^[\d,]+$/.test(tokens[4])) {
    state.month = tokens[4].split(",").map((month) => {
      return months.value.find((mon) => +mon.value === parseInt(month)).value;
    });
  } else {
    if (
      !months.value.includes((month) => state.month == tokens[4]) &&
      tokens[4]
    ) {
      months.value = [...months.value, { name: tokens[4], value: tokens[4] }];
    }
    state.month = [{ name: tokens[4], value: tokens[4] }];
  }
};

const updateRule = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  updateRuleRequest({
    id: router.params.id,
    company_id: "",
    config: state.config,
    deny_if_op: state.denyIfOp,
    deny_if_value: parseInt(state.denyIfValue),
    event_name: state.eventId,
    max_value: parseInt(state.maxValue),
    min_value: parseInt(state.minValue),
    name: state.name,
    product_id: state.productId.toString(),
    reset_frequency_hours: parseInt(state.resetFrequencyHours),
    reset_pattern: state.resetPattern,
    reset_type: state.resetType,
    reset_value: parseInt(state.resetValue),
    role_id: state.roleId,
    rule_name: state.ruleName,
    tenant_id: "",
    status: parseInt(state.status),
    value: parseInt(state.value),
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      navigateTo("/settings/licensing/rules");
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  showGenericListing(routes.PRODUCT).then((response: any) => {
    products.value = response?.data?.products.map((product: any) => {
      return {
        text: product.name,
        value: product.id,
      };
    });
  }).catch((error) => {
      layout.changeLoaderValue(false);
    });
  eventNameListRequest().then((response) => {
    eventNames.value = response?.map((product: any) => {
      return {
        text: product.name,
        value: product.id,
      };
    });
  }).catch((error) => {
    layout.changeLoaderValue(false);

    });

  rolesRequest().then((response) => {
    roles.value = response?.data?.map((role: any) => {
      return {
        text: role.title,
        value: role.id,
      };
    });
  }).catch((error) => {
    layout.changeLoaderValue(false);

    });

  ruleByIdRequest({
    id: router.params.id,
  })
    .then((response) => {
      layout.changeLoaderValue(false);
      state.ruleName = response[0]?.rule_name;
      state.denyIfOp = response[0]?.deny_if_op;
      state.denyIfValue = response[0]?.deny_if_value;
      state.maxValue = response[0]?.max_value;
      state.minValue = response[0]?.min_value;
      state.config = response[0]?.config;
      state.productId = response[0]?.product_id;
      state.eventId = response[0]?.event_name;
      state.resetPattern = response[0]?.reset_pattern;
      state.resetType = response[0]?.reset_type;
      state.roleId = response[0]?.role_id;
      state.resetValue = response[0]?.reset_value;
      state.status = response[0]?.status;
      syncResetPattern();
    })
    .catch((error) => {
      layout.changeLoaderValue(false);
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
}

refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div>
      <div id="supplier">
        <div class="card">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Fill Rules Details") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.ruleName"
                    :label="$t('Rule Name')"
                    :required="true"
                    id="ruleName"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.ruleName.$error }"
                  />
                </div>
                <div v-if="v$.ruleName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.ruleName.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.eventId"
                    :options="eventNames"
                    disabled
                    :key="state.eventId"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Event Name')"
                  />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.productId"
                    :options="products"
                    :key="state.productId"
                    label="text"
                    disabled
                    track-by="value"
                    :textLabel="$t('Product')"
                  />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.roleId"
                    :options="roles"
                    :key="state.roleId"
                    label="text"
                    disabled
                    track-by="value"
                    :textLabel="$t('Role')"
                  />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.minValue"
                    :label="$t('Min value')"
                    :required="true"
                    id="minValue"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.minValue.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.minValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.minValue.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.maxValue"
                    :label="$t('Max value')"
                    :required="true"
                    id="maxValue"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.maxValue.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.maxValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.maxValue.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.value"
                    :label="$t('Value')"
                    :required="true"
                    id="value"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.value.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.value.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.value.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.denyIfValue"
                    :label="$t('Deny if value')"
                    :required="true"
                    id="denyIfValue"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.denyIfValue.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.denyIfValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.denyIfValue.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.config"
                    :label="$t('Config')"
                    :required="true"
                    id="config"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.config.$error }"
                  />
                </div>
                <div v-if="v$.config.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.config.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.resetType"
                    :options="resetTypes"
                    :key="state.resetType"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Reset Type')"
                    :required="true"
                    :class="{ 'is-invalid': v$.resetType.$error }"
                  />
                </div>
                <div v-if="v$.resetType.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.resetType.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.resetValue"
                    :label="$t('Reset value')"
                    :required="true"
                    id="resetValue"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.resetValue.$error }"
                    type="number"
                  />
                </div>
                <div v-if="v$.resetValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.resetValue.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input
                    v-model="state.resetFrequencyHours"
                    :label="$t('Recent Frequency Hours')"
                    :required="true"
                    id="resetFrequencyHours"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.resetFrequencyHours.$error }"
                    type="number"
                  />
                </div>
                <div
                  v-if="v$.resetFrequencyHours.$error"
                  class="invalid-feedback"
                >
                  <span
                    class="text-danger"
                    v-if="v$.resetFrequencyHours.required"
                    >{{ $t("This value is required") }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.denyIfOp"
                    :key="state.denyIfOp"
                    :options="denyIfOps"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Deny if Op')"
                    :required="true"
                    :class="{ 'is-invalid': v$.denyIfOp.$error }"
                  />
                </div>
                <div v-if="v$.denyIfOp.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.denyIfOp.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.status"
                    :key="state.status"
                    :options="statusOptions"
                    label="text"
                    track-by="value"
                    :textLabel="$t('Status')"
                    :required="true"
                    :class="{ 'is-invalid': v$.status.$error }"
                  />
                </div>
                <div v-if="v$.status.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.status.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Reset Pattern") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body mt-4">
            <div class="row">
              <div class="col-lg-6">
                <div class="row align-items-center">
                  <div class="col-2">
                    <label for=""> {{
                    $t("Day")
                  }}</label>
                  </div>
                  <div class="col-3">
                    <div class="form-group m-0">
                      <select class="form-control" v-model="state.day">
                        <option
                          v-for="option in days"
                          :value="option"
                          :key="option"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-1">
                    <label for="">of</label>
                  </div>
                  <div class="col-5">
                    <div class="form-group m-0">
                      <elements-multiselect
                        v-model="state.month"
                        :options="months"
                        :key="state.month"
                        :multiple="true"
                        label="name"
                        track-by="value"
                        :textLabel="$t('')"
                      />
                    </div>
                  </div>
                </div>
                <div class="row align-items-center mt-2">
                  <div class="col-2">
                    <label for="">At</label>
                  </div>
                  <div class="col-3">
                    <div class="form-group m-0">
                      <select class="form-control" v-model="state.hour">
                        <option
                          v-for="option in hoursData"
                          :value="option"
                          :key="option"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>
                  :

                  <div class="col-3">
                    <select class="form-control" v-model="state.minute">
                      <option
                        v-for="option in minutesData"
                        :value="option"
                        :key="option"
                      >
                        {{ option }}
                      </option>
                    </select>
                  </div>
                  :
                  <div class="col-3">
                    <div class="form-group m-0">
                      <select class="form-control" v-model="state.second">
                        <option
                          v-for="option in secondsData"
                          :value="option"
                          :key="option"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div class="form-group">
                      <elements-input
                        v-model="state.resetPattern"
                        :label="$t('Reset Pattern')"
                        id="name"
                        :disabled="state.submitted"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <h4>{{
                    $t("Next 5 scheduled dates")
                  }}:</h4>
                <ul class="m-0 mt-3 p-0">
                  <li
                    class="mb-1"
                    v-for="(date, index) in nextSchedulesDates"
                    :key="'schedules-date-' + date"
                  >
                    <span class="font-bold">{{ index + 1 + "." }}</span>
                    {{ date }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button
            class="primary-btn me-3"
            @click="navigateTo('/settings/licensing/rules')"
          >
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button
            @click="store()"
            :isLoading="state.isLoading"
            :iconName="'updateIcon'"
            :buttonName="$t('Update')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

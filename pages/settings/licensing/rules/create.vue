<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import {
  ruleCreateRequest,
  eventNameListRequest,
  rolesRequest,
} from "~/utils/apiRequests";
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
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
      text: "Create",
      active: true,
    },
  ],

  { title } = useTitle("Create Rules"),
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
    name: "",
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
  }),
  validationRules = {
    name: { required },
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
      createRule();
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
        `${new Date().getFullYear() + i}-${state.month[j]}-${state.day} ${state.hour
        }:${state.minute}:${state.second}${state.month[j + 1] ? ", " : ""}`;
    }
    schedulesDates.push(date);
  }
  return schedulesDates;
});

// creates a crontab expression based on the second, minute, dayOfMonth, month and dayOfWeek
const calculateResetPattern = () => {
  // since we are using double digit number strings we must convert them to integer and also check for NaN
  let expression = `${isNaN(+state.second) ? state.second : +state.second} ${isNaN(+state.minute) ? state.minute : +state.minute
    } ${isNaN(+state.hour) ? state.hour : +state.hour} ${isNaN(+state.day) ? state.day : +state.day
    } `;
  // month will be an array og objects so we fetch the value from it and join it with "," if values are mutliple
  let months = state.month.map((month) => (isNaN(+month) ? month : +month));
  expression += months.join(",");

  expression += " " + "*";
  state.resetPattern = expression;
};

const createRule = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  ruleCreateRequest({
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
    value: parseInt(state.value),
  })
    .then((response) => {
      layout.changeLoaderValue(false);

      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
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
  showGenericListing(routes.PRODUCT).then((response: any) => {
    products.value = response?.data?.products.map((product: any) => {
      return {
        text: product.name,
        value: product.id,
      };
    });
  });
  eventNameListRequest().then((response) => {
    eventNames.value = response?.map((product: any) => {
      return {
        text: product.name,
        value: product.id,
      };
    });
  });

  rolesRequest().then((response) => {
    roles.value = response?.data?.map((role: any) => {
      return {
        text: role.title,
        value: role.id,
      };
    });
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
                  <elements-input v-model="state.name" :label="$t('Name')" :required="true" id="name"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.name.$error }" />
                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.ruleName" :label="$t('Rule Name')" :required="true" id="ruleName"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.ruleName.$error }" />
                </div>
                <div v-if="v$.ruleName.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.ruleName.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect v-model="state.eventId" :options="eventNames" label="text" track-by="value"
                    :textLabel="$t('Event Name')" />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect v-model="state.productId" :options="products" label="text" track-by="value"
                    :textLabel="$t('Product')" />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect v-model="state.roleId" :options="roles" label="text" track-by="value"
                    :textLabel="$t('Role')" />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.minValue" :label="$t('Min value')" :required="true" id="minValue"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.minValue.$error }" type="number" />
                </div>
                <div v-if="v$.minValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.minValue.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.maxValue" :label="$t('Max value')" :required="true" id="maxValue"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.maxValue.$error }" type="number" />
                </div>
                <div v-if="v$.maxValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.maxValue.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.value" :label="$t('Value')" :required="true" id="value"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.value.$error }" type="number" />
                </div>
                <div v-if="v$.value.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.value.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.denyIfValue" :label="$t('Deny if value')" :required="true"
                    id="denyIfValue" :disabled="state.submitted" :class="{ 'is-invalid': v$.denyIfValue.$error }"
                    type="number" />
                </div>
                <div v-if="v$.denyIfValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.denyIfValue.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.config" :label="$t('Config')" :required="true" id="config"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.config.$error }" />
                </div>
                <div v-if="v$.config.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.config.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect v-model="state.resetType" :options="resetTypes" label="text" track-by="value"
                    :textLabel="$t('Reset Type')" :required="true" :class="{ 'is-invalid': v$.resetType.$error }" />
                </div>
                <div v-if="v$.resetType.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.resetType.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.resetValue" :label="$t('Reset value')" :required="true" id="resetValue"
                    :disabled="state.submitted" :class="{ 'is-invalid': v$.resetValue.$error }" type="number" />
                </div>
                <div v-if="v$.resetValue.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.resetValue.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <elements-input v-model="state.resetFrequencyHours" :label="$t('Recent Frequency Hours')"
                    :required="true" id="resetFrequencyHours" :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.resetFrequencyHours.$error }" type="number" />
                </div>
                <div v-if="v$.resetFrequencyHours.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.resetFrequencyHours.required">{{ $t("This value is required")
                  }}</span><br />
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <elements-multiselect v-model="state.denyIfOp" :options="denyIfOps" label="text" track-by="value"
                    :textLabel="$t('Deny if Op')" :required="true" :class="{ 'is-invalid': v$.denyIfOp.$error }" />
                </div>
                <div v-if="v$.denyIfOp.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.denyIfOp.required">{{
                    $t("This value is required")
                  }}</span><br />
                </div>
              </div>
            </div>
          </div>
          <div class="card-header pt-0 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Reset Pattern") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body mt-3">
            <div class="row">
              <div class="col-lg-12">
                <div class="d-flex align-items-center justify-content-between">
                  <span class="w-auto me-3">
                    <strong>Day</strong>
                  </span>
                  <div class="" style="width: 100px;">
                    <div class="form-group m-0">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <select class="form-control" v-model="state.day">
                          <option v-for="option in days" :value="option" :key="option">
                            {{ option }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <span class="w-auto">
                    <strong>of</strong>
                  </span>
                  <div class="col-3">
                    <div class="form-group m-0">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <elements-multiselect v-model="state.month" :options="months" :multiple="true" label="name"
                          track-by="value" :textLabel="$t('')" />
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="form-group m-0">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'clockIcon'" />
                          </span>
                        </div>
                        <select class="form-control" v-model="state.hour">
                          <option v-for="option in hoursData" :value="option" :key="option">
                            {{ option }}
                          </option>
                        </select>
                        <label for="" class="input-label"> {{ $t("Hour") }} </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <ElementsIcon v-bind:icon="'clockIcon'" />
                        </span>
                      </div>
                      <select class="form-control" v-model="state.minute">
                        <option v-for="option in minutesData" :value="option" :key="option">
                          {{ option }}
                        </option>
                      </select>
                      <label for="" class="input-label"> {{ $t("Minutes") }}</label>
                    </div>
                  </div>
                  <div class="col-2">
                    <div class="form-group m-0">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'clockIcon'" />
                          </span>
                        </div>
                        <select class="form-control" v-model="state.second">
                          <option v-for="option in secondsData" :value="option" :key="option">
                            {{ option }}
                          </option>
                        </select>
                        <label for="" class="input-label"> {{ $t("Seconds") }} </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col-12 mt-3">
                <div class="form-group">
                  <elements-input v-model="state.resetPattern" :label="$t('Reset Pattern')" id="name"
                    :disabled="state.submitted" />
                </div>
              </div>
            </div>
          </div>
          <div class="card-header pt-0 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Next 5 Scheduled Dates") }}</h3>
            <elements-tooltip />
          </div>
          <div class="card-body mt-3">
            <div class="row rules-list">
              <div class="col-lg-4 mb-3 d-flex align-items-center" v-for="(date, index) in nextSchedulesDates"
                :key="'schedules-date-' + date">
                <span class="font-bold me-3">{{ index + 1 + "." }}</span>
                <div class="form-group m-0 w-100">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text"><elements-icon v-bind:icon="'dateIcon'" /></div>
                    </div>
                    <div class="form-control">

                      {{ date }}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 d-flex align-items-center justify-content-end">
          <button class="primary-btn me-3" @click="navigateTo('/settings/licensing/rules')">
            <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
            <span>{{ $t("Cancel") }}</span>
          </button>
          <submittal-button @click="store()" :isLoading="state.isLoading" :iconName="'saveIcon'"
            :buttonName="$t('Save and Proceed')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  FleetListRequest,
  listEmployeesRequest,
  fleetDriverCreateRequest,
  getFleetDriverRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const {
  apiRoute,
  data,
  showFunc,
  storeFunc,
  updateFunc,
  submitted,
  isLoading,
} = genericFunctionality();


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Fleet Drivers",
      to: "/fleet-management/fleet-list",
    },
    {
      text: "Edit",
      active: true,
    },
  ],
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  usersList = ref([]),
  fleetCarsList = ref([]),
  state = reactive({
    isLoading: false,
    submitted: false,
    carType: "",
    fleetCarId: "",
    userId: "",
  }),
  validationRules = {
    carType: { required },
    userId: { required },
  },
  carTypeOptions = [
    { value: "rent_car", text: "Rent Car" },
    { value: "pool_car", text: "Pool Car" },
    { value: "leasing_car", text: "Leasing Car" },
  ],
  v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();

  if (
    state.carType == "leasing_car" &&
    (state.fleetCarId == "" || state.fleetCarId == null)
  ) {
    Toast.fire({
      title: t("Error!"),
      text: t(" Please select a fleet car"),
      icon: "error",
    });
    state.submitted = false;
    return false;
  }

  if (
    state.carType != "leasing_car" &&
    (state.fleetCarId != "" || state.fleetCarId != null)
  ) {
    state.fleetCarId = "";
  }

  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createFuelReceipt();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createFuelReceipt = () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  fleetDriverCreateRequest({
    carType: state.carType,
    fleetCarId: state.fleetCarId,
    userId: state.userId,
  })
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      state.isLoading = false;
      state.submitted = false;
      navigateTo("/fleet-management/driver-licence-check");
    })
    .catch((error) => {
      state.isLoading = false;
      state.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
};

const getFleetDriver = (id: any) => {
  getFleetDriverRequest(id)
    .then((response) => {
      Object.assign(state, response.data);
      console.log("CHecking thie response: ", state);
    })
    .catch((response) => {
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};
async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  FleetListRequest({
    page: currentPage.value,
    perPage: 100,
    sortBy: column.value,
    order: order.value,
    search: "",
  })
    .then((response) => {
      fleetCarsList.value = response?.data?.data.map((fleetCar: any) => {
        return {
          text: fleetCar.licenceNumber,
          value: fleetCar.id,
        };
      });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });

  listEmployeesRequest({
    limit_start: 0,
    limit_count: 25,
    type: "employee",
    company_id: "",
  }).then((response) => {
    usersList.value = response?.data.map((employee: any) => {
      return {
        text: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
  });
  console.log("Checking the userId: ", usersList);
  console.log("Checking the Cars: ", fleetCarsList);
  getFleetDriver(router.params.id);
}
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Fleet Driver Edit");

useHead({
    title: title,
    });
refresh();
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div>
      <div id="supplier">
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="card-title">{{ $t('Enter Fleet Drivers Details') }}</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.carType"
                    :options="carTypeOptions"
                    label="text"
                    track-by="value"
                    :key="state.carType"
                    :textLabel="$t('Select a car type')"
                    :required="true"
                    :class="{ 'is-invalid': v$.carType.$error }"
                  />
                  <div v-if="v$.carType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.carType.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                class="col-lg-6 col-md-6"
                v-if="state.carType == 'leasing_car'"
              >
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.fleetCarId"
                    :options="fleetCarsList"
                    label="text"
                    track-by="value"
                    :key="state.fleetCarId"
                    :textLabel="$t('Select a fleet car')"
                    :required="state.carType == 'leasing_car'"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <elements-multiselect
                    v-model="state.userId"
                    :options="usersList"
                    label="text"
                    track-by="value"
                    :key="state.userId"
                    :textLabel="$t('Select a driver')"
                    :required="true"
                    :class="{ 'is-invalid': v$.userId.$error }"
                  />
                  <div v-if="v$.userId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.userId.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group text-right mt-3">
          <submittal-button
            @click="store()"
            :isLoading="state.isLoading"
            :buttonName="$t('Update Fleet Driver')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

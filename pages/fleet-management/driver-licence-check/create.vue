<script setup lang="ts">

import {ref, reactive, onMounted} from "vue";
import {driverLicenseCheckCreateRequest, getFleetDriversRequest} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";

const {apiRoute, data, showFunc, storeFunc, updateFunc, submitted, isLoading} = genericFunctionality();
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const {router, Toast} = commonCode(),
    {t} = useI18n(),
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "Driver License Check",
        to: "/fleet-management/driver-licence-check",
      },
      {
        text: "Create",
        active: true,
      },
    ],
    currentPage = ref(1),
    order = ref("asc"),
    column = ref("id"),
    driversList = ref([]),
    vehicleClassesList = ref([
      {value: 1, text: "A1"},
      {value: 2, text: "A2"},
      {value: 3, text: "A3"}
    ]),
    state = reactive({
      isLoading: false,
      submitted: false,
      checkType: '',
      fleetDriverId: '',
      licenceValidUntil: '',
      managerId: '',
      vehicleClasses: [],
    }),
    validationRules = {
      checkType: {required},
      fleetDriverId: {required},
      licenceValidUntil: {required},
      managerId: {required},
      vehicleClasses: {required},
    },
    checkTypes = [
      {value: 'online', text: 'Online Meeting'},
      {value: 'personal', text: 'Personal Meeting'},
    ],
    v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createDriverLicenseCheck();
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const createDriverLicenseCheck = () => {

  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  driverLicenseCheckCreateRequest({
    checkType: state.checkType,
    fleetDriverId: state.fleetDriverId,
    licenceValidUntil: state.licenceValidUntil,
    managerId: state.managerId,
    vehicleClasses: state.vehicleClasses.map(vehicleClassId => {
      const vehicleClass = vehicleClassesList.value.find((vehicleClassObject) => vehicleClassObject.value == vehicleClassId);
      return {
        id: vehicleClass.value,
        name: vehicleClass.text
      }
    }),
  }).then((response) => {
    layout.changeLoaderValue(false);
    Toast.fire({      
      icon: "success",
      title: t("Record created successfully!"),
    });
    state.isLoading = false;
    state.submitted = false;
    navigateTo("/fleet-management/driver-licence-check");
  }).catch((error) => {
    state.isLoading = false;
    state.submitted = false;
    Toast.fire({icon: "error", title: t("something went wrong!")});
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
};

async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  getFleetDriversRequest().then((response) => {
    driversList.value = response?.data.map((fleetDriver: any) => {
      return {
        text: fleetDriver.name,
        value: fleetDriver.id,
      };
    });
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
}

onMounted(function () {
  state.managerId = localStorage.getItem('user_id')
});
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Fleet Driver License Check Create");

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
                <div class="row">
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.fleetDriverId"
                        :options="driversList"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Select a driver')"
                        :required="true"
                        :class="{ 'is-invalid': v$.fleetDriverId.$error }"
                      />
                      <div
                        v-if="v$.fleetDriverId.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.fleetDriverId.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.vehicleClasses"
                        :options="vehicleClassesList"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Select vehicle(s)')"
                        :required="true"
                        :multiple="true"
                        :class="{ 'is-invalid': v$.vehicleClasses.$error }"
                      />
                      <div
                        v-if="v$.vehicleClasses.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.vehicleClasses.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="state.checkType"
                        :options="checkTypes"
                        label="text"
                        track-by="value"
                        :textLabel="$t('Select a check type')"
                        :required="true"
                        :class="{ 'is-invalid': v$.checkType.$error }"
                      />
                      <div v-if="v$.checkType.$error" class="invalid-feedback">
                        <span
                          class="text-danger"
                          v-if="v$.checkType.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6">
                    <div class="form-group">
                      <elements-input
                        type="date"
                        v-model="state.licenceValidUntil"
                        :label="$t('License valid date')"
                        :required="true"
                        :disabled="state.submitted"
                        :class="{ 'is-invalid': v$.licenceValidUntil.$error }"
                      />
                      <div
                        v-if="v$.licenceValidUntil.$error"
                        class="invalid-feedback"
                      >
                        <span
                          class="text-danger"
                          v-if="v$.licenceValidUntil.required"
                          >{{ $t("This value is required") }}</span
                        ><br />
                      </div>
                    </div>
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
            :buttonName="$t('Create Driver License Check')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  customerLocationCreateRequest,
  customerShowRequest,
  customerLocationDeleteRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  location = reactive({
    isLoading: false,
    submitted: false,
    addressFirst: "",
    addressLine2: "",
    zip: "",
    city: "",
    countryId: "",
    state: "",
  }),
  locations = ref([]),
  emit = defineEmits(["tab3Done", "backToTab2", "getLocations"]),
  validationRules = {
    addressFirst: { required },
    zip: { required },
    countryId: { required },
    city: { required },
    state: { required },
  },
  v$ = useVuelidate(validationRules, location);
const props = defineProps({
  customerId: {
    type: String,
    default: false,
  },
  countries: {
    type: Array,
    default: false,
  },
});

const next = () => {
  customerShowRequest(props.customerId).then((response) => {
    emit("getLocations", { locations: response?.data?.customerLocations });
  });
  emit("tab3Done");
};

const prev = () => {
  emit("backToTab2");
};

const addLocation = () => {
  location.submitted = true;
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    location.submitted = false;

    createLocation();
  }
};

const createLocation = () => {
  customerLocationCreateRequest({
    customerId: props.customerId,
    addressFirst: location.addressFirst,
    addressSecond: location.addressLine2,
    city: location.city,
    zip: location.zip,
    state: location.state,
    countryId: location.countryId,
  })
    .then((response) => {
      const obj = {
        addressFirst: response?.data?.addressFirst,
        id: response?.data?.id,
        zip: response?.data?.zip,
        city: response?.data?.city,
        state: response?.data?.state,
        isHeadQuarter: response?.data?.isHeadQuarter,
      };
      locations.value.push(obj);
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      location.addressFirst = "";
      location.addressLine2 = "";
      location.zip = "";
      location.city = "";
      location.state = "";
      location.countryId = "";
      location.isLoading = false;
    })
    .catch((error) => {
      location.isLoading = false;
      location.submitted = false;
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
};

const showCustomer = () => {
  customerShowRequest(props.customerId).then((response) => {
    locations.value = response?.data?.customerLocations;
  });
};

const refresh = () => {
  if (router.params.id) {
    showCustomer();
  }
};

refresh();

const popLocation = (index, id) => {
  locations.value.splice(index, 1);
  customerLocationDeleteRequest(id)
    .then((response) => {
      Toast.fire({
        icon: "success",
        title: t("Record deleted successfully!"),
      });
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};
</script>
<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-3">{{$t("Add Location Details")}}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><elements-icon v-bind:icon="`locationIcon`" /></span>
                    </div>
              <elements-input
                v-model="location.addressFirst"
                :label="$t('Address Line 1')"
                :required="true"
                id="addressFirst"
                :class="{
                  'is-invalid': v$.addressFirst.$error && location.submitted,
                }"
              />
              </div>
              
            </div>
            <div
                v-if="v$.addressFirst.$error && location.submitted"
                class="invalid-feedback"
              >
                <span
                  class="text-danger"
                  v-if="v$.addressFirst.required && location.submitted"
                  >{{ $t("This value is required") }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><elements-icon v-bind:icon="`locationIcon`" /></span>
                    </div>
              <elements-input
                v-model="location.addressLine2"
                :label="$t('Address Line 2')"
                id="addressLine2"
              />
              </div>
              
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.zip"
                :label="$t('Zip')"
                :required="true"
                id="zip"
                :class="{
                  'is-invalid': v$.zip.$error && location.submitted,
                }"
              />
             
            </div>
            <div
                v-if="v$.zip.$error && location.submitted"
                class="invalid-feedback"
              >
                <span
                  class="text-danger"
                  v-if="v$.zip.required && location.submitted"
                  >{{ $t("This value is required") }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.city"
                :label="$t('City')"
                :required="true"
                id="city"
                :class="{
                  'is-invalid': v$.city.$error && location.submitted,
                }"
              />
              
            </div>
            <div
                v-if="v$.city.$error && location.submitted"
                class="invalid-feedback"
              >
                <span
                  class="text-danger"
                  v-if="v$.city.required && location.submitted"
                  >{{ $t("This value is required") }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="location.countryId"
                :key="location.countryId"
                :options="countries"
                label="text"
                track-by="value"
                :textLabel="$t('Country')"
                :required="true"
                :class="{
                  'is-invalid': v$.countryId.$error && location.submitted,
                }"
              />
              
            </div>
            <div
                v-if="v$.countryId.$error && location.submitted"
                class="invalid-feedback"
              >
                <span
                  class="text-danger"
                  v-if="v$.countryId.required && location.submitted"
                  >{{ $t("This value is required") }}</span
                ><br />
              </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.state"
                :label="$t('State')"
                :required="true"
                id="state"
                :class="{
                  'is-invalid': v$.state.$error && location.submitted,
                }"
              />
              
            </div>
            <div
                v-if="v$.state.$error && location.submitted"
                class="invalid-feedback"
              >
                <span
                  class="text-danger"
                  v-if="v$.state.required && location.submitted"
                  >{{ $t("This value is required") }}</span
                ><br />
              </div>
          </div>
        </div>
      </div>
      
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
        <button @click.prevent="addLocation()" class="secondary-btn">
          <elements-icon v-bind:icon="'addIcon'" class="me-2"/>
          {{ $t("Add Location") }}
        </button>
      </div>
    <div class="table-responsive mt-4">
      <table class="doc-table table">
        <thead>
          <tr>
            <th>{{$t("Address Line 1")}}</th>
            <th>{{$t("ZIP")}}</th>
            <th>{{$t("State")}}</th>
            <th>{{$t("City")}}</th>
            <th>{{$t("Actions")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in locations" :key="index">
            <td>{{ item?.addressFirst }}</td>
            <td>{{ item?.zip }}</td>
            <td>{{ item?.state }}</td>
            <td>{{ item?.city }}</td>
            <td>
              <i
                v-if="item?.isHeadQuarter == false"
                class="mdi mdi-delete edit-icon"
                @click.prevent="popLocation(index, item?.id)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="mt-3 d-flex align-items-center justify-content-end"
    >
    <button class="primary-btn me-3" @click="next()">
        <span>{{ $t("Skip") }}</span>
      </button>
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <ElementsIcon v-bind:icon="'backIcon'" class="me-2" />
        {{$t("Previous")}}
      </button>
      <submittal-button
        @click.prevent="next()"
        :isLoading="location.isLoading"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>

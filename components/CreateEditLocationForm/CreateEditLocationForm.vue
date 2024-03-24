<script setup lang="ts">
import genericFunctionality from "~/composables/genericFunctionality";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "~/store/layout";
import genericFeatures from "~/composables/generic";

const {
    apiRoute,
    data,
    showFunc,
    storeFunc,
    updateFunc,
    isLoading,
    submitted
  } = genericFunctionality();

import { ref, reactive } from "vue";

import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode();
const {showGenericListing } = genericFeatures(),

  { t } = useI18n(),
  location = reactive({
    name: "",
    street: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    countryId: "",
  }),
  currentPage = ref(1),
  order = ref("asc"),
  column = ref("id"),
  countries = ref([]),
  validationRules = {
    name: { required },
    street: { required },
  },
  v$ = useVuelidate(validationRules, location);

const props = defineProps({
  locationId: {
    type: String,
    default: "",
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});



async function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.LOCATION;
  if (router.params.id) {
    let response = await showFunc(props.locationId)
    if(response?.success){
      const {name,street,zipCode,address,city,state,countryId}= response?.data;
      location.name= name;
      location.name= name;
      location.street= street;
      location.zipCode= zipCode;
      location.address= address;
      location.city= city;
      location.state= state;
      location.countryId=countryId;
    }
  }
  

  showGenericListing(routes.COUNTRY,  {all: true, sortBy: 'name', order: 'asc'}).then((response:any) => {
    countries.value = response?.data?.map((country: any) => {
      return {
        text: country.name,
        value: country.id,
      };
    });
  }).finally(() => {
      layout.changeLoaderValue(false);
    });
};

refresh();

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    submitted.value = false;
    return false;
  } else {
    try {
      isLoading.value = true;
      if (props.isUpdate == true) {
        updateFunc(location, props.locationId,'/personal-management/locations');
      } else {
        storeFunc(location,'/personal-management/locations');
      }
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
      submitted.value = false;
    }
  }
};

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{$t("Fill Location Details")}}</h3>
        <elements-tooltip/>
      </div>      
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'userIcon'"/></span>
                </div>
              <elements-input
                v-model="location.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :disabled="submitted"
                :class="{ 'is-invalid': v$.name.$error }"
              />
              </div>
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>
            
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.street"
                :label="$t('Street')"
                :required="true"
                id="street"
                :disabled="submitted"
                :class="{ 'is-invalid': v$.street.$error }"
              />
              
            </div>
            <div v-if="v$.street.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.street.required">{{
                  $t("This value is required")
                }}</span
                ><br />
              </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text"><elements-icon v-bind:icon="'locationIcon'"/></span>
                </div>
              <elements-input
                v-model="location.address"
                :label="$t('Address')"
                :required="false"
                id="address"
                :disabled="submitted"
              />
              </div>
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.state"
                :label="$t('State')"
                :required="false"
                id="state"
                :disabled="submitted"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.city"
                :label="$t('City')"
                :required="false"
                id="city"
                :disabled="submitted"
              />
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                v-model="location.zipCode"
                :label="$t('Zip Code')"
                :required="false"
                id="address"
                :disabled="submitted"
              />
            </div>
          </div>

          <div class="col-lg-12 col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="location.countryId"
                :options="countries"
                label="text"
                :key="location.countryId"
                track-by="value"
                :textLabel="$t('Country')"
                :required="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end mt-3">
      <button class="primary-btn me-3">
        <ElementsIcon v-bind:icon="'cancelIcon'" />
        {{ $t("Cancel") }}
      </button>
       <submittal-button
        @click="store()"
        :isLoading="isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      /> 
    </div>
  </div>
</template>
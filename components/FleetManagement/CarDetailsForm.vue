<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {MdEditor} from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {fleetListShowRequest} from "~/utils/apiRequests";
import moment from "moment";

let {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
      isApiCalled: true,
      licenceNumber: "",
      driverId: "",
      vim: "",
      fuelType: "",
      carType: "",
      assetNumber: "",
      color: "",
      kilowatt: "",
      brand: "",
      model: "",
      modelKey: "",
      modelDetail: "",
      extraEquipment: "",
      totalMileage: "",
      updatedAt: "",
      status: ""
    }),
    emit = defineEmits(["nextStep"]),
    customerId = ref(""),
    driverOptions = [
      {value: "186fc40b-55dc-feae-025a-f000fca5d884", name: "Marcel"},
      {value: "186fc40b-55dc-feae-025a-f000fca5d885", name: "Test 1"},
      {value: "186fc40b-55dc-feae-025a-f000fca5d886", name: "Test 2"},
      {value: "186fc40b-55dc-feae-025a-f000fca5d887", name: "Test 3"},
      {value: "186fc40b-55dc-feae-025a-f000fca5d888", name: "Test 4"},
    ],
    fuelTypeOptions = [
      {value: "diesel", name: "diesel"},
      {value: "electronic", name: "electronic"},
      {value: "gasoline", name: "gasoline"}
    ],
    carTypeOptions = [
      {value: "rent_car", name: "Rent Car"},
      {value: "leasing_car", name: "Leasing Car"},
      {value: "pool_car", name: "Pool Car"}
    ],
    statusOptions = [
      {value: 'ready', name: "Ready"},
      {value: 'out_of_service', name: "Out Of Service"}
    ],
    validationRules = {
      licenceNumber: {required},
      vim: {required},
      fuelType: {required},
      carType: {required},
      assetNumber: {required},
      color: {required},
      kilowatt: {required},
      brand: {required},
      model: {required},
      modelKey: {required},
      modelDetail: {required},
      extraEquipment: {required},
      totalMileage: {required},
      status: {required},
    },
    v$ = useVuelidate(validationRules, state)
const rows = ref([]);
const props = defineProps({
  fleetCar: {
    type: Object,
    default: [],
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
});

watch(props.fleetCar, (value, oldValue, onCleanup) => {
  Object.assign(state, value)
  state.updatedAt = moment(state.updatedAt).format('YYYY-MM-DD')
});

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      // state.isLoading = true;
      emit("nextStep", {step: 1, fields: state});
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">Car Details</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.licenceNumber"
                  :label="$t('Licence Number')"
                  :required="true"
                  id="licenceNumber"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.licenceNumber.$error }"
              />
              <div v-if="v$.licenceNumber.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.licenceNumber.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                  v-model="state.driverId"
                  :options="driverOptions"
                  label="name"
                  :key="state.driverId"
                  track-by="value"
                  :textLabel="$t('Driver')"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.vim"
                  :label="$t('VIM')"
                  :required="true"
                  id="vim"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.vim.$error }"
              />
              <div v-if="v$.vim.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.vim.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                  v-model="state.fuelType"
                  :options="fuelTypeOptions"
                  label="name"
                  :key="state.fuelType"
                  track-by="value"
                  :textLabel="$t('Fuel Type')"
                  :class="{ 'is-invalid': v$.fuelType.$error }"
              />
            </div>
            <div v-if="v$.fuelType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fuelType.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect
                  v-model="state.carType"
                  :options="carTypeOptions"
                  label="name"
                  :key="state.carType"
                  track-by="value"
                  :textLabel="$t('Car Type')"
                  :class="{ 'is-invalid': v$.carType.$error }"
              />
            </div>
            <div v-if="v$.carType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.carType.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.assetNumber"
                  :label="$t('Asset Number')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.assetNumber.$error }"
              />
              <div v-if="v$.assetNumber.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.assetNumber.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.color"
                  :label="$t('Color')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.color.$error }"
              />
              <div v-if="v$.color.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.color.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.kilowatt"
                  :label="$t('KW/PS')"
                  :required="true"
                  id="name"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.kilowatt.$error }"
              />
              <div v-if="v$.kilowatt.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.kilowatt.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.brand"
                  :label="$t('Brand')"
                  :required="true"
                  id="brand"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.brand.$error }"
              />
              <div v-if="v$.brand.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.brand.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.modelKey"
                  :label="$t('Model Key')"
                  :required="true"
                  id="modelKey"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.modelKey.$error }"
              />
              <div v-if="v$.modelKey.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.modelKey.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.model"
                  :label="$t('Model')"
                  :required="true"
                  id="model"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.model.$error }"
              />
              <div v-if="v$.model.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.model.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.modelDetail"
                  :label="$t('Model Detail')"
                  :required="true"
                  id="modelDetail"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.modelDetail.$error }"
              />
              <div v-if="v$.modelDetail.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.modelDetail.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group">
              <label :class="{ 'text-danger': v$.extraEquipment.$error, 'black': !v$.extraEquipment.$error }">Extra Equipment</label>
              <MdEditor
                  :preview="false"
                  :style="'height:300px;'"
                  :language="'en-US'"
                  v-model="state.extraEquipment"
                  :class="{ 'is-invalid': v$.extraEquipment.$error }"
                  required="true"
              />
              <div v-if="v$.extraEquipment.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.extraEquipment.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header">
        <h3 class="card-title">Service Information</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.totalMileage"
                  :label="$t('Total Mileage')"
                  :required="true"
                  id="totalMileage"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.totalMileage.$error }"
              />
              <div v-if="v$.totalMileage.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.totalMileage.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.updatedAt"
                  :label="$t('Updated At')"
                  :required="true"
                  id="updatedAt"
                  :disabled="state.submitted"
                  type="date"
              />
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="form-group">
              <elements-multiselect v-model="state.status" :options="statusOptions" :key="state.status"
                                    label="name" track-by="value" :textLabel="$t('Status')" :required="true"/>
            </div>
            <div v-if="v$.status.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.status.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3">
      <submittal-button
          @click="store()"
          :isLoading="state.isLoading"
          :buttonName="$t('Next')"
      />
    </div>
  </div>
</template>

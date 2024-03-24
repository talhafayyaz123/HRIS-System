<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import "md-editor-v3/lib/style.css";
import {routes} from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import {travelExpenseCreateRequest} from "~/utils/apiRequests";

useHead({
  title: `Travel Expense Request`,
});

let {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
      departureCity: '',
      departureCountryId: '',
      arrivalCity: '',
      arrivalCountryId: '',
      requestTypeId: '',
      fromDate: '',
      fromDepartureTime: '',
      fromArrivalTime: '',
      fromDiscrepancy: '',
      toDate: '',
      toDepartureTime: '',
      toArrivalTime: '',
      toDiscrepancy: '',
      projectId: '',
      customerId: '',
      description: 'description',
    }),
    countries = ref([]),
    requestTypes = ref([]),
    validationRules = {
      departureCity: {required},
      departureCountryId: {required},
      arrivalCity: {required},
      arrivalCountryId: {required},
      requestTypeId: {required},
      fromDate: {required},
      fromDepartureTime: {required},
      fromArrivalTime: {required},
      fromDiscrepancy: {required},
      toDate: {required},
      toDepartureTime: {required},
      toArrivalTime: {required},
      toDiscrepancy: {required},
    },
    v$ = useVuelidate(validationRules, state)

const companies=ref([]);
const rows = ref([]);
const {fetchListing,showGenericListing} = genericFeatures();
const emit = defineEmits(["changeStep"]);

const createAndApprove = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      createTravelExpense();
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const checkType=(val:number)=>{

  interface requestType {
   text:string,
   val:number,
   customerSpecific:boolean
  }

  let request:requestType=requestTypes.value.filter((item:any)=>item.value==val)[0];
  if(request.customerSpecific){
  
    fetchListing(routes.COMPANY).then((response: any) => {
     
    companies.value = response.value?.data?.customers.map((ts: any) => {
      
      return {
        value: ts.id,
        name: ts.name,
  
      };
    });
  });
  }
}

const createTravelExpense = () => {
  travelExpenseCreateRequest({
    departureCity: state.departureCity,
    departureCountryId: state.departureCountryId,
    arrivalCity: state.arrivalCity,
    arrivalCountryId: state.arrivalCountryId,
    requestTypeId: state.requestTypeId,
    projectId: state.projectId,
    customerId: state.customerId,
    fromDate: state.fromDate,
    fromDepartureTime: state.fromDepartureTime,
    fromArrivalTime: state.fromArrivalTime,
    fromDiscrepancy: state.fromDiscrepancy,
    toDate: state.toDate,
    toDepartureTime: state.toDepartureTime,
    toArrivalTime: state.toArrivalTime,
    toDiscrepancy: state.toDiscrepancy,
    description: state.description,
  })
      .then((response) => {
        Toast.fire({
          icon: "success",
          title: t("Record created successfully!"),
        });
        state.isLoading = false;
        state.submitted = false;
        emit('changeStep', 1)
      })
      .catch((error) => {
        state.isLoading = false;
        state.submitted = false;
        Toast.fire({icon: "error", title: t("something went wrong!")});
      });
};

async function refresh() {
  showGenericListing(routes.REQUEST_TYPE, {
    perPage: 1000,
    sortBy: 'created_at',
    order: 'desc',
    page: 1
  }).then((response: any) => {
    requestTypes.value = response?.data?.data.map((requestType: any) => {
     
      return {
        text: requestType.name,
        value: requestType.id,
        customerSpecific: requestType.customerSpecific,
      };
    });
  });

  showGenericListing(routes.COUNTRY, {all: true, sortBy: 'name', order: 'asc'}).then((response: any) => {
    countries.value = response?.data.map((country: any) => {
      return {
        text: country.name,
        value: country.id,
      };
    });
  });
}

onMounted(function () {
  refresh();
});

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header">
        <h3 class="card-title">User Details</h3>
      </div>
      <div class="card-body">
        <div class="row pt-3">
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Personal Number:</b> 00002</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-3">
            <p><b>Name:</b> Marcel Rupprecht</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Email:</b> m.rupprecht@docshero.de</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Travel No.:</b> N/A</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Company:</b> N/A</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Team:</b> Produkt Entwicklung, Cloud & Infrastruktur</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Department:</b> Business Unit - Business Integration, Business Unit - Cloud & Infrastuktur</p>
          </div>
          <div class="col-lg-6 col-md-6 pt-4">
            <p><b>Location:</b> Lorenzstraße 29, Karlsruhe, Baden-Württemberg, Deutschland</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card product-type mt-3">
      <div class="card-header">
        <h3 class="card-title">Fill Travel Expense Details</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.departureCity"
                  :label="$t('Departure City')"
                  :required="true"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.departureCity.$error }"
              />
              <div v-if="v$.departureCity.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.departureCity.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                  v-model="state.departureCountryId"
                  :options="countries"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Departure Country')"
                  :required="true"
                  :class="{ 'is-invalid': v$.departureCountryId.$error }"
              />
              <div v-if="v$.departureCountryId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.departureCountryId.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-input
                  v-model="state.arrivalCity"
                  :label="$t('Arrival City')"
                  :required="true"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.arrivalCity.$error }"
              />
              <div v-if="v$.arrivalCity.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.arrivalCity.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <elements-multiselect
                  v-model="state.arrivalCountryId"
                  :options="countries"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Arrival Country')"
                  :required="true"
                  :class="{ 'is-invalid': v$.arrivalCountryId.$error }"
              />
              <div v-if="v$.arrivalCountryId.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.arrivalCountryId.required">{{
                        $t("This value is required")
                      }}</span
                    ><br/>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              
              <elements-multiselect
                  v-model="state.requestTypeId"
                  :options="requestTypes"
                  label="text"
                  :key="state.requestTypeId"
                  track-by="value"
                  :textLabel="$t('Request Type')"
                  @select="checkType"
                  :class="{ 'is-invalid': v$.requestTypeId.$error }"
              />
            </div>
            <div v-if="v$.requestTypeId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.requestTypeId.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
            </div>
          </div>

          <div class="col-lg-6 col-md-6" v-if="companies.length>0">
            <div class="form-group">
              
              <elements-multiselect
                  v-model="state.customerId"
                  :options="companies"
                  label="name"
                  :key="state.customerId"
                  track-by="value"
                  :textLabel="$t('Customer')"
              />
            </div>
            
          </div>


        </div>
      </div>
    </div>
    <div class="row mx-1">
      <div class="card mt-3 col-6">
        <div class="card-header">
          <h3 class="card-title">From Date and Time information</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.fromDate"
                    type="date"
                    :label="$t('Date')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.fromDate.$error }"
                />
                <div v-if="v$.fromDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fromDate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.fromDepartureTime"
                    type="time"
                    :label="$t('Departure Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.fromDepartureTime.$error }"
                />
                <div v-if="v$.fromDepartureTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fromDepartureTime.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.fromArrivalTime"
                    type="time"
                    :label="$t('Arrival Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.fromArrivalTime.$error }"
                />
                <div v-if="v$.fromArrivalTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fromArrivalTime.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10 col-md-6">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.fromDiscrepancy"
                    :label="$t('Travelling Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.fromDiscrepancy.$error }"
                />
                <div v-if="v$.fromDiscrepancy.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fromDiscrepancy.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt-3 col-6">
        <div class="card-header">
          <h3 class="card-title">To Date and Time information</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.toDate"
                    type="date"
                    :label="$t('Date')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.toDate.$error }"
                />
                <div v-if="v$.toDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.toDate.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.toDepartureTime"
                    type="time"
                    :label="$t('Departure Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.toDepartureTime.$error }"
                />
                <div v-if="v$.toDepartureTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.toDepartureTime.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10">
              <div class="form-group">
                <elements-input
                    v-model="state.toArrivalTime"
                    type="time"
                    :label="$t('Arrival Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.toArrivalTime.$error }"
                />
                <div v-if="v$.toArrivalTime.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.toArrivalTime.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
            <div class="col-lg-10 col-md-6">
              <div class="form-group">
                <elements-input
                    type="number"
                    v-model="state.toDiscrepancy"
                    :label="$t('Travelling Time')"
                    :required="true"
                    :disabled="state.submitted"
                    :class="{ 'is-invalid': v$.toDiscrepancy.$error }"
                />
                <div v-if="v$.toDiscrepancy.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.toDiscrepancy.required">{{
                    $t("This value is required")
                  }}</span
                ><br/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3 d-flex">
      <submittal-button
          class="mx-1"
          @click="createAndApprove()"
          :isLoading="state.isLoading"
          :buttonName="$t('Create & Approve')"
      />
      <submittal-button
          class="mx-1"
          @click="createAndApprove()"
          :isLoading="state.isLoading"
          :buttonName="$t('Create Travel Expense')"
      />
    </div>
  </div>
</template>

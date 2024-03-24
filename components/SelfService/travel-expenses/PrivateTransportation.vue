<script setup lang="ts">

import {reactive} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {travelExpensePrivateTransportationCreateRequest} from "~/utils/apiRequests";
import commonCode from "~/composables/common";

const {Toast} = commonCode(),
    {t} = useI18n();

const props = defineProps({
  travelExpenseId: {
    type: Number,
    default: 0,
  },
});

const state = reactive({
  isLoading: false,
  submitted: false,
  drivenKilometer: '',
  licenseNumber: '',
});

const validationRules = {
  drivenKilometer: {required},
  licenseNumber: {required},
};

const v$ = useVuelidate(validationRules, state);

const store = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    state.submitted = false;
    return false;
  } else {
    try {
      state.isLoading = true;
      addPrivateTransportation();
    } catch (e) {
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const addPrivateTransportation = () => {
  travelExpensePrivateTransportationCreateRequest({
    travelExpenseId: props.travelExpenseId,
    data: [
      {
        drivenKilometer: state.drivenKilometer,
        licenseNumber: state.licenseNumber,
      }
    ]
  }).then((response) => {
    Toast.fire({
      icon: "success",
      title: t("Record created successfully!"),
    });
    state.isLoading = false;
    state.submitted = false;
    navigateTo("/self-service/travel-expenses");
  }).catch((error) => {
    state.isLoading = false;
    state.submitted = false;
    Toast.fire({icon: "error", title: t("something went wrong!")});
  });
};

</script>

<template>
  <div>
    <div class="card">
      <div class="row p-4">
        <div class="col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.drivenKilometer"
                :label="$t('Driven Kilometers')"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.drivenKilometer.$error }"
            />
            <div v-if="v$.drivenKilometer.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.drivenKilometer.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.licenseNumber"
                :label="$t('License Number')"
                :required="true"
                :disabled="state.submitted"
                :class="{ 'is-invalid': v$.licenseNumber.$error }"
            />
            <div v-if="v$.licenseNumber.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.licenseNumber.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3">
      <submittal-button
          @click="store()"
          :isLoading="state.isLoading"
          :buttonName="$t('Add Transportation')"
      />
    </div>
  </div>
</template>

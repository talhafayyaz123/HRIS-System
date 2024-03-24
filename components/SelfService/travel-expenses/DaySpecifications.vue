<script setup lang="ts">

import {ref, reactive} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import moment from "moment";
import {travelExpenseDaySpecificationsCreateRequest} from "~/utils/apiRequests";
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
  date: moment().format("YYYY-MM-DD"),
  mealOvernight: '',
  from: '',
  until: '',
});

const isActive = ref(false);
const isBreakfast = ref(false);
const isLunch = ref(false);
const isDinner = ref(false);

const validationRules = {
  date: {required},
  mealOvernight: {required},
  from: {required},
  until: {required},
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
      console.log('e')
      console.log(e)
      Toast.fire({title: t("Error!"), text: t("Error"), icon: "error"});
      state.isLoading = false;
      state.submitted = false;
    }
  }
};

const getFromAnUntilForEachTime = () => {
  let foodTimeArray = [];

  if (isBreakfast.value) {
    foodTimeArray.push({
      for: "breakfast",
      from: state.from,
      to: state.until
    })
  }

  if (isLunch.value) {
    foodTimeArray.push({
      for: "lunch",
      from: state.from,
      to: state.until
    })
  }

  if (isDinner.value) {
    foodTimeArray.push({
      for: "dinner",
      from: state.from,
      to: state.until
    })
  }

  return foodTimeArray
};

const addPrivateTransportation = () => {
  travelExpenseDaySpecificationsCreateRequest({
    isActive: isActive.value,
    isBreakfast: isBreakfast.value,
    isLunch: isLunch.value,
    isDinner: isDinner.value,
    mealOvernight: state.mealOvernight,
    fromAndUntil: getFromAnUntilForEachTime(),
    travelExpenseId: props.travelExpenseId
  }, props.travelExpenseId).then((response) => {
    Toast.fire({
      icon: "success",
      title: t("Day specifications for travel expense created successfully!"),
    });
    state.isLoading = false;
    state.submitted = false;
    navigateTo("/self-service/travel-expenses");
  }).catch((error) => {
    console.log('error')
    console.log(error)
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
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.date"
                :label="$t('Date')"
                :disabled="true"
                :class="{ 'is-invalid': v$.date.$error }"
            />
            <div v-if="v$.date.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.date.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.mealOvernight"
                :label="$t('Meals Overnight')"
                :required="true"
                :disabled="state.isLoading"
                :class="{ 'is-invalid': v$.mealOvernight.$error }"
            />
            <div v-if="v$.mealOvernight.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.mealOvernight.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.from"
                :label="$t('From')"
                :required="true"
                :disabled="state.isLoading"
                :class="{ 'is-invalid': v$.from.$error }"
                type="time"/>
            <div v-if="v$.from.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.from.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group">
            <elements-input
                v-model="state.until"
                :label="$t('Until')"
                :required="true"
                :disabled="state.isLoading"
                :class="{ 'is-invalid': v$.until.$error }"
                type="time"/>
            <div v-if="v$.until.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.until.required">{{ $t("This value is required") }}</span><br/>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="row px-4 pb-4">
        <div class="col-xl-3 col-md-6">
          <div class="form-group d-flex align-items-center">
            <input type="checkbox" v-model="isActive"/>
            <label for="" class="px-2">Active</label>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group d-flex align-items-center">
            <input type="checkbox" v-model="isBreakfast"/>
            <label for="" class="px-2">Breakfast</label>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group d-flex align-items-center">
            <input type="checkbox" v-model="isLunch"/>
            <label for="" class="px-2">Lunch</label>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="form-group d-flex align-items-center">
            <input type="checkbox" v-model="isDinner"/>
            <label for="" class="px-2">Dinner</label>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group text-right mt-3">
      <submittal-button
          @click="store()"
          :isLoading="state.isLoading"
          :buttonName="$t('Save Day Specifications')"
      />
    </div>
  </div>
</template>

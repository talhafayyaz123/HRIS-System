<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  getSingleSlaServiceTimesRequest,
  updateSlaServiceTimesRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

const props = defineProps(["showModal", "hideModal", "recordId"]);
const emits = defineEmits(["refresh"]);
// form states
const state = reactive({
  isLoading: false,
  name: "",
  from: "",
  days: [],
  to: "",
  factor: null,
});
const daysOption = [
  { value: "monday", text: "Monday" },
  { value: "tuesday", text: "Tuesday" },
  { value: "wednesday", text: "Wednesday" },
  { value: "thursday", text: "Thursday" },
  { value: "friday", text: "Friday" },
  { value: "saturday", text: "Saturday" },
  { value: "sunday", text: "Sunday" },
];

// form validation
const validationRules = {
  name: { required },
  days: { required, minLength: minLength(1) },
  from: { required },
  to: { required },
  factor: { required },
};
const v$ = useVuelidate(validationRules, state);

onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    const res = await getSingleSlaServiceTimesRequest(props.recordId);
    const { name, from, days, to, factor } = res.data;

    state.name = name;
    state.from = from;
    state.days = days;
    state.to = to;
    state.factor = factor;
  } catch (e) {
    console.log(e);
  }
});

async function editSlaInfrastructureHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        name: state.name,
        days: state.days,
        from: state.from,
        to: state.to,
        factor: state.factor,
      };
      // if we have id then edit otherwise add
      await updateSlaServiceTimesRequest(formData, props.recordId);

      Toast.fire({
        title: "Record updated successfully!",
        icon: "success",
      });
      state.isLoading = false;
      emits("refresh");
      props.hideModal();
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
    // TODO
    // resetState();
  }
}
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Edit SLA Service Times`"
  >
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="state.name"
            :label="$t('Name')"
            :required="true"
            id="name"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.name.$error }"
          />
          <div v-if="v$.name.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.name.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <elements-multiselect
            v-model="state.days"
            :options="daysOption"
            :key="state.days"
            label="text"
            track-by="value"
            :textLabel="$t('Days')"
            :required="true"
            :multiple="true"
            :class="{ 'is-invalid': v$.days.$error }"
          />
          <div v-if="v$.days.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.days.minLength">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="state.from"
            :label="$t('From')"
            :required="true"
            id="from"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.from.$error }"
            type="time"
          />
          <div v-if="v$.from.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.from.required">{{
              $t("This value is required")
            }}</span
            ><br />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="state.to"
            :label="$t('To')"
            :required="true"
            id="to"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.to.$error }"
            type="time"
          />
          <div v-if="v$.to.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.to.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <elements-input
            v-model="state.factor"
            :label="$t('Factor')"
            :required="true"
            id="name"
            type="number"
            :disabled="state.isLoading"
            :class="{ 'is-invalid': v$.factor.$error }"
          />
          <div v-if="v$.factor.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.factor.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button
        :buttonName="$t('Save')"
        @click="editSlaInfrastructureHandler"
      />
    </div>
  </Modal>
</template>

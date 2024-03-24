<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  getSingleSlaLevelRequest,
  updateSlaLevelRequest,
} from "~/utils/apiRequests";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();

const props = defineProps(["showModal", "hideModal", "recordId"]);
const emits = defineEmits(["refresh"]);
// form states
const stateIncident = reactive({
  isLoading: false,
  name: "",
  factor: null,
  urgentReactionTime: null,
  highReactionTime: null,
  lowReactionTime: null,
});

const validationRules = {
  name: { required },
  factor: { required },
  urgentReactionTime: { required },
  highReactionTime: { required },
  lowReactionTime: { required },
};
const v$ = useVuelidate(validationRules, stateIncident);

onMounted(async function () {
  try {
    if (!props.recordId) {
      // incase of add don't call api
      return;
    }
    const res = await getSingleSlaLevelRequest(props.recordId);
    const {
      name,
      factor,
      urgentReactionTime,
      highReactionTime,
      lowReactionTime,
    } = res.data;
    stateIncident.name = name;
    stateIncident.factor = factor;
    stateIncident.urgentReactionTime = urgentReactionTime;
    stateIncident.highReactionTime = highReactionTime;
    stateIncident.lowReactionTime = lowReactionTime;
  } catch (e) {
    console.log(e);
  }
});

async function editSlaLevelHandler() {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      stateIncident.isLoading = true;
      const formData = {
        name: stateIncident.name,
        factor: stateIncident.factor,
        urgentReactionTime: stateIncident.urgentReactionTime,
        highReactionTime: stateIncident.highReactionTime,
        lowReactionTime: stateIncident.lowReactionTime,
      };
      await updateSlaLevelRequest(formData, props.recordId);

      Toast.fire({
        title: "Record updated successfully!",
        icon: "success",
      });
      stateIncident.isLoading = false;
      emits("refresh");
      props.hideModal();
    } catch (e) {
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      stateIncident.isLoading = false;
    }
  }
}
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Edit Incidents`"
  >
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="stateIncident.name"
            :label="$t('Name')"
            :required="true"
            id="name"
            :disabled="stateIncident.isLoading"
            :class="{ 'is-invalid': v$.name.$error }"
          />
          <div v-if="v$.name.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.name.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-12">
        <div class="form-group">
          <elements-input
            v-model="stateIncident.factor"
            :label="$t('Factor')"
            :required="true"
            id="factor"
            :disabled="stateIncident.isLoading"
            :class="{ 'is-invalid': v$.factor.$error }"
            type="number"
          />
          <div v-if="v$.factor.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.factor.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <span>{{ $t("Priority: Urgent") }}</span>
      <div class="col-lg-4">
        <div class="form-group">
          <elements-input
            v-model="stateIncident.urgentReactionTime"
            :label="$t('Urgent Reaction Time')"
            :required="true"
            id="urgentReactionTime"
            :disabled="stateIncident.isLoading"
            :class="{ 'is-invalid': v$.urgentReactionTime.$error }"
            type="number"
          />
          <div v-if="v$.urgentReactionTime.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.urgentReactionTime.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <p>{{ $t("Priority: High") }}</p>
      <div class="col-lg-4">
        <div class="form-group">
          <elements-input
            v-model="stateIncident.highReactionTime"
            :label="$t('High Reaction Time')"
            :required="true"
            id="highReactionTime"
            :disabled="stateIncident.isLoading"
            :class="{ 'is-invalid': v$.highReactionTime.$error }"
            type="number"
          />
          <div v-if="v$.highReactionTime.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.highReactionTime.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <p>{{ $t("Priority: Low") }}</p>
      <div class="col-lg-4">
        <div class="form-group">
          <elements-input
            v-model="stateIncident.lowReactionTime"
            :label="$t('Low Reaction Time')"
            :required="true"
            id="lowReactionTime"
            :disabled="stateIncident.isLoading"
            :class="{ 'is-invalid': v$.lowReactionTime.$error }"
            type="number"
          />
          <div v-if="v$.lowReactionTime.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.lowReactionTime.required">{{
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
      <submittal-button :buttonName="$t('Save')" @click="editSlaLevelHandler" />
    </div>
  </Modal>
</template>

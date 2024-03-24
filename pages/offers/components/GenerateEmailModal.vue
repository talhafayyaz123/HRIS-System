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

const props = defineProps(["showModal", "hideModal"]);
// form states
const state = reactive({
  isLoading: false,
  to: "",
  data: "",
});
const toOption = [
  { value: "marcel", text: "Marcel" },
  { value: "tobais", text: "Tobais" },
];

// form validation
const validationRules = {
  to: { required },
};
const v$ = useVuelidate(validationRules, state);

// TODO: implement later

// onMounted(async function () {
//   try {
//     if (!props.recordId) {
//       return;
//     }
//     const res = await getSingleSlaServiceTimesRequest(props.recordId);
//     const { name, from, days, to, factor } = res.data;

//     state.name = name;
//     state.from = from;
//     state.days = days;
//     state.to = to;
//     state.factor = factor;
//   } catch (e) {
//     console.log(e);
//   }
// });

// async function editSlaInfrastructureHandler() {
//   v$.value.$touch();
//   if (v$.value.$invalid) {
//     return;
//   } else {
//     try {
//       state.isLoading = true;
//       const formData = {
//         name: state.name,
//         days: state.days,
//         from: state.from,
//         to: state.to,
//         factor: state.factor,
//       };
//       // if we have id then edit otherwise add
//       await updateSlaServiceTimesRequest(formData, props.recordId);

//       Toast.fire({
//         title: "Record updated successfully!",
//         icon: "success",
//       });
//       state.isLoading = false;
//       props.hideModal();
//     } catch (e) {
//       console.log(e);
//       Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
//       state.isLoading = false;
//     }
//   }
// }
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Send Mail`"
  >
    <div class="row mt-4">
      <div class="col-lg-12">
        <div class="form-group">
          <elements-multiselect
            v-model="state.to"
            :options="toOption"
            :key="state.to"
            label="text"
            track-by="value"
            :textLabel="$t('To')"
            :required="true"
            :class="{ 'is-invalid': v$.to.$error }"
          />
          <div v-if="v$.to.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.to.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <p class="form-label">{{ $t("Data") }}:</p>
        <MonacoEditor
          @contentChange="state.data = $event"
          :codeString="companyJson"
          :language="'json'"
          class="mt-2"
          height="300px"
        />
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
      <submittal-button :buttonName="$t('Save')" />
    </div>
  </Modal>
</template>

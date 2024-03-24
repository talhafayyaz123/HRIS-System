<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  createInvoiceRequest,
  getInvoiceByIdRequest,
  editInvoiceRequest,
} from "@/utils/apiRequests";
import commonCode from "~/composables/common";
import { reactive, onMounted } from "vue";

const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps(["id"]);

const state = reactive({
  isLoading: false,
  name: "",
});
const invoiceId = props.id;

const validationRules = {
  name: { required },
};
const v$ = useVuelidate(validationRules, state);

// In case of edit, populate invoices
onMounted(async function () {
  try {
    if (!invoiceId) {
      // incase of add don't call api
      return;
    }
    state.isLoading = true;
    const res = await getInvoiceByIdRequest(invoiceId);
    const { name } = res.data;

    state.name = name;
    state.isLoading = false;
  } catch (e) {
    console.log(e);
    state.isLoading = false;
  }
});

async function invoiceHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      state.isLoading = true;
      const formData = {
        name: state.name,
      };
      // if we have id then edit otherwise add
      const res = (await invoiceId)
        ? editInvoiceRequest(invoiceId, formData)
        : createInvoiceRequest(formData);
      Toast.fire({
        title: invoiceId ? "Record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/travel-expense/invoice-type");
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="invoiceHandler">
    <Loader :isLoading="state.isLoading" />
    <div class="row">
      <div class="col-lg-6">
        <div class="card h-auto">
          <div class="card-header d-flex align-items-center">
            <h3 class="card-title me-2">
              {{ $t("Fill Invoice Types Details") }}
            </h3>
            <elements-tooltip :label="'Enter Invoice Types Details'"/>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-lg-12">
                <div class="form-group">
                  <elements-input
                    v-model="state.name"
                    :label="$t('Name')"
                    :required="true"
                    :disabled="state.isLoading"
                    id="name"
                    :class="{ 'is-invalid': v$.name.$error }"
                  />
                </div>
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3"  @click='navigateTo("/settings/travel-expense/invoice-type")'>
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/>
          <span>{{ $t("Cancel") }}</span>
      </button>
      <button class="secondary-btn float-right" type="submit"><ElementsIcon v-bind:icon="'saveIcon'" class="me-2"/>
            {{$t("Save and Proceed")}}</button>
    </div>
      </div>
    </div>
  </form>
</template>

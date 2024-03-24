<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import commonCode from "~/composables/common";

import {
  createTermsOfPaymentRequest,
  getTermsOfPaymentByIdRequest,
  editTermsOfPaymentRequest,
} from "@/utils/apiRequests";

import { reactive, onMounted } from "vue";
import { useLayoutStore } from "~/store/layout";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
  isLoading: false,
  name: "",
  textOnOffer: "",
  textOnOrderConfirmation: "",
  textOnInvoice: "",
  percentages: {
    one: {
      percentage: "",
      noOfDays: "",
    },
    two: {
      percentage: "",
      noOfDays: "",
    },
    three: {
      percentage: "",
      noOfDays: "",
    },
  },
});
const props = defineProps(["id"]);

const termOfPaymentId = props.id;

const validationRules = {
  name: { required },
  percentages: {
    one: { percentage: { required }, noOfDays: { required } },
  },
};
const v$ = useVuelidate(validationRules, state);

// In case of edit, populate terms of payment
onMounted(async function () {
  try {
    if (!termOfPaymentId) {
      // incase of add don't call api
      return;
    }
    state.isLoading = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const res = await getTermsOfPaymentByIdRequest(termOfPaymentId);
    const {
      name,
      textOnOffer,
      textOnOrderConfirmation,
      textOnInvoice,
      percentages,
    } = res.data;
    state.name = name;
    state.textOnOffer = textOnOffer;
    state.textOnOrderConfirmation = textOnOrderConfirmation;
    state.textOnInvoice = textOnInvoice;
    state.percentages.one = percentages[0];
    state.percentages.two =
      percentages[1]?.percentage && percentages[1]?.noOfDays
        ? percentages[1]
        : percentages[1]?.percentage && !percentages[1]?.noOfDays
        ? {
            percentage: percentages[1]?.percentage,
            noOfDays: "",
          }
        : !percentages[1]?.percentage && percentages[1]?.noOfDays
        ? {
            percentage: "",
            noOfDays: percentages[1]?.noOfDays,
          }
        : { percentage: "", noOfDays: "" };

    state.percentages.three =
      percentages[2]?.percentage && percentages[2]?.noOfDays
        ? percentages[2]
        : percentages[2]?.percentage && !percentages[2]?.noOfDays
        ? {
            percentage: percentages[2]?.percentage,
            noOfDays: "",
          }
        : !percentages[2]?.percentage && percentages[2]?.noOfDays
        ? {
            percentage: "",
            noOfDays: percentages[2]?.noOfDays,
          }
        : { percentage: "", noOfDays: "" };

    state.isLoading = false;
    layout.changeLoaderValue(false);
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
    state.isLoading = false;
  }
});

async function termsOfPaymentHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      state.isLoading = true;
      const percentages = [
        state.percentages.one,
        (state.percentages.two.percentage.length > 0 ||
          state.percentages.two.noOfDays.length > 0) && {
          ...(state.percentages.two.percentage && {
            percentage: state.percentages.two.percentage,
          }),
          ...(state.percentages.two.noOfDays && {
            noOfDays: state.percentages.two.noOfDays,
          }),
        },
        (state.percentages.three.percentage ||
          state.percentages.three.noOfDays) && {
          ...(state.percentages.three.percentage && {
            percentage: state.percentages.three.percentage,
          }),
          ...(state.percentages.three.noOfDays && {
            noOfDays: state.percentages.three.noOfDays,
          }),
        },
      ];
      const formData = {
        name: state.name,
        percentages: percentages.filter(Boolean),
        ...(state.textOnOffer && { textOnOffer: state.textOnOffer }),
        ...(state.textOnOrderConfirmation && {
          textOnOrderConfirmation: state.textOnOrderConfirmation,
        }),
        ...(state.textOnInvoice && { textOnInvoice: state.textOnInvoice }),
      };
      // if we have id then edit otherwise add
      const res = (await termOfPaymentId)
        ? editTermsOfPaymentRequest(termOfPaymentId, formData)
        : createTermsOfPaymentRequest(formData);
        layout.changeLoaderValue(false);

      Toast.fire({
        title: termOfPaymentId
          ? "Record updated successfully!"
          : "Record created successfully!",
        icon: "success",
      });
      state.isLoading = false;
      navigateTo("/settings/global-settings/terms-of-payment");
    } catch (e) {
      const layout = useLayoutStore();
      layout.changeLoaderValue(false);
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      state.isLoading = false;
    }
  }
}
</script>

<template>
  <form @submit.prevent="termsOfPaymentHandler">
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">
          {{ $t("Fill Terms of payment Details") }}
        </h3>
        <ElementsTooltip />
      </div>
      <div class="card-body pb-0">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                :disabled="state.isLoading"
                id="name"
                :class="{ 'is-invalid': v$.name.$error }"
              />
              <div v-if="v$.name.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.name.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'percentageIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.one.percentage"
                  :label="$t('Percentage')"
                  :required="true"
                  :disabled="state.isLoading"
                  id="percentage1"
                  type="number"
                  :class="{
                    'is-invalid': v$.percentages.one.percentage.$error,
                  }"
                />
              </div>
            </div>
            <div
              v-if="v$.percentages.one.percentage.$error"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v$.percentages.one.percentage.required"
                >{{ $t("This value is required") }}</span
              >
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'urlIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.one.noOfDays"
                  :label="$t('No Of Days')"
                  :required="true"
                  :disabled="state.isLoading"
                  id="noOfDays1"
                  type="number"
                  :class="{ 'is-invalid': v$.percentages.one.noOfDays.$error }"
                />
              </div>
            </div>
            <div
              v-if="v$.percentages.one.noOfDays.$error"
              class="invalid-feedback"
            >
              <span
                class="text-danger"
                v-if="v$.percentages.one.noOfDays.required"
                >{{ $t("This value is required") }}</span
              >
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'percentageIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.two.percentage"
                  :label="$t('Percentage')"
                  :disabled="state.isLoading"
                  id="percentage2"
                  type="number"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'urlIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.two.noOfDays"
                  :label="$t('No Of Days')"
                  :disabled="state.isLoading"
                  id="noOfDays2"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'percentageIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.three.percentage"
                  :label="$t('Percentage')"
                  :disabled="state.isLoading"
                  id="percentage3"
                  type="number"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="'urlIcon'"
                  /></span>
                </div>
                <elements-input
                  v-model="state.percentages.three.noOfDays"
                  :label="$t('No Of Days')"
                  :disabled="state.isLoading"
                  id="noOfDays3"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">
          {{ $t("Text On Offer Confirmation") }}
        </h3>
        <ElementsTooltip />
      </div>
      <div class="card-body pt-0 pb-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group textarea">
              <textarea
                class="form-control"
                placeholder="."
                v-model="state.textOnOffer"
              ></textarea>
              <label class="input-label" for="">Typing</label>
            </div>
          </div>
        </div>
      </div>
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">
          {{ $t("Text On Order Confirmation") }}
        </h3>
        <ElementsTooltip />
      </div>
      <div class="card-body pt-0 pb-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group textarea">
              <textarea
                class="form-control"
                placeholder="."
                v-model="state.textOnOrderConfirmation"
              ></textarea>
              <label class="input-label" for="">Typing</label>
            </div>
          </div>
        </div>
      </div>
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">
          {{ $t("Text on Invoices") }}
        </h3>
        <ElementsTooltip />
      </div>
      <div class="card-body pt-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group textarea">
              <textarea
                class="form-control"
                placeholder="."
                v-model="state.textOnInvoice"
              ></textarea>
              <label class="input-label" for="">Typing</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button
        class="primary-btn me-3"
        @click="navigateTo('/settings/global-settings/terms-of-payment')"
      >
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        :isLoading="state.isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { priceListCreateRequest } from "~/utils/apiRequests";
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import genericFeatures from "~/composables/generic";
import { required } from "@vuelidate/validators";

import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n();
const { showGenericListing } = genericFeatures();
const state = reactive({
  isLoading: false,
  name: "",
  productSoftwareId: "",
  status: "",
  isDefault: false,
});
const productSoftwareOptions = ref([]);
const statusOptions = [
  { value: "active", text: "Active" },
  { value: "inactive", text: "Inactive" },
];
const breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Price List",
      to: "/settings/products/price-list",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Create Price List"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const validationRules = {
    name: { required },
    status: { required },
    productSoftwareId: { required },
  },
  v$ = useVuelidate(validationRules, state);

function refresh() {
  showGenericListing(routes.PRODUCT_SOFTWARE).then((response: any) => {
    productSoftwareOptions.value = response?.data?.productSoftware.map(
      (payment: any) => {
        return {
          text: payment.name,
          value: payment.id,
        };
      }
    );
  });
}
const addCategoryHandler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    state.isLoading = true;
    priceListCreateRequest({
      name: state.name,
      status: state.status,
      productSoftwareId: state.productSoftwareId,
      isDefault: state.isDefault,
    })
      .then((response) => {
        layout.changeLoaderValue(false);

        Toast.fire({
          icon: "success",
          title: "Record created successfully!",
        });
        state.isLoading = false;
        navigateTo("/settings/products/price-list");
      })
      .catch((error) => {
        layout.changeLoaderValue(false);

        Toast.fire({ icon: "error", title: t("something went wrong!") });
        state.isLoading = false;
      });
  }
};
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="addCategoryHandler">
      <div class="card">
        <div class="card-header d-flex align-items-center">
          <h3 class="card-title me-2">
            {{ $t("Fill Price List Details") }}
          </h3>
          <elements-tooltip />
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-6">
              <div class="form-group">
                <elements-input
                  v-model="state.name"
                  :label="$t('Name')"
                  :required="true"
                  :disabled="state.isLoading"
                  id="category-name"
                  :class="{ 'is-invalid': v$.name.$error }"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.name.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>

            <div class="col-lg-6">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.status"
                  :options="statusOptions"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Status')"
                  :required="true"
                  :class="{ 'is-invalid': v$.status.$error }"
                />

                <div v-if="v$.status.$error" class="invalid-feedback">
                  <span class="text-danger" v-if="v$.status.required">{{
                    $t("This value is required")
                  }}</span
                  ><br />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.productSoftwareId"
                  :options="productSoftwareOptions"
                  label="text"
                  track-by="value"
                  :textLabel="$t('Software')"
                  :required="true"
                  :class="{ 'is-invalid': v$.productSoftwareId.$error }"
                />

                <div
                  v-if="v$.productSoftwareId.$error"
                  class="invalid-feedback"
                >
                  <span
                    class="text-danger"
                    v-if="v$.productSoftwareId.required"
                    >{{ $t("This value is required") }}</span
                  ><br />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="state.isDefault"
                    id="flexCheckDefault"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ $t("Is Default") }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 d-flex align-items-center justify-content-end">
        <button
          class="primary-btn me-3"
          @click="navigateTo('/settings/products/price-list')"
        >
          <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
          <span>{{ $t("Cancel") }}</span>
        </button>
        <submittal-button
          :isLoading="state.isLoading"
          :iconName="'saveIcon'"
          :buttonName="$t('Save and Proceed')"
        />
      </div>
    </form>
  </div>
</template>

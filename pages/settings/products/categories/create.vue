<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  productUnitRequest,
  productCategoryCreateRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode();
const { t } = useI18n();

const state = reactive({
  defaultUnitId: "",
  defaultOnOffer: false,
  isLoading: false,
  categoryName: "",
  productType: "all",
  serviceContingent: false,
});
const breadCrumbsConfig = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Products",
      to: "/",
    },
    {
      text: "Categories",
      to: "/settings/products/Categories",
    },
    {
      text: "Create",
      active: true,
    },
  ],
  { title } = useTitle("Categories create"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const validationRules = {
    categoryName: { required },
    defaultUnitId: { required },
    productType: { required },
  },
  v$ = useVuelidate(validationRules, state);

const currentPage = ref(1);
const order = ref("asc");
const column = ref("id");
const defaultUnits = ref([]);

const productTypeOptions = [
  { value: "all", text: "All" },
  { value: "software", text: "Software" },
  { value: "service", text: "service" },
  { value: "paushal", text: "Paushal" },
  { value: "ams", text: "AMS" },
  { value: "hosting", text: "Hosting" },
  { value: "cloud", text: "Cloud Software" },
  { value: "traveling", text: "Traveling" },
];

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  productUnitRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  })
    .then((response) => {
      defaultUnits.value = response?.data?.productUnits.map((pUnit: any) => {
        return {
          text: pUnit.name,
          value: pUnit.id,
        };
      });
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
}
const addCategoryHandler = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    state.isLoading;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    productCategoryCreateRequest({
      name: state.categoryName,
      isDefaultOnOffer: state.defaultOnOffer,
      defaultUnitId: state.defaultUnitId,
      productType: state.productType,
      serviceContingent: state.serviceContingent,
    })
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: "Record created successfully!",
        });
        state.isLoading = false;
        navigateTo("/settings/products/categories");
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
      <div class="row">
        <div class="col-lg-8">
          <div class="card h-auto">
            <div class="card-header d-flex align-items-center">
              <h3 class="card-title me-2">
                {{ $t("Fill Product Category Details") }}
              </h3>
              <elements-tooltip />
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-input
                      v-model="state.categoryName"
                      :label="$t('Name')"
                      :required="true"
                      :disabled="state.isLoading"
                      id="category-name"
                      :class="{ 'is-invalid': v$.categoryName.$error }"
                    />
                  </div>
                  <div v-if="v$.categoryName.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.categoryName.required">{{
                      $t("This value is required")
                    }}</span
                    ><br />
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                      v-model="state.defaultUnitId"
                      :options="defaultUnits"
                      :key="state.defaultUnitId"
                      label="text"
                      track-by="value"
                      :textLabel="$t('Default Unit')"
                      :required="true"
                      :class="{ 'is-invalid': v$.defaultUnitId.$error }"
                    />
                  </div>
                  <div v-if="v$.defaultUnitId.$error" class="invalid-feedback">
                    <span
                      class="text-danger"
                      v-if="v$.defaultUnitId.required"
                      >{{ $t("This value is required") }}</span
                    >
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                      v-model="state.productType"
                      :options="productTypeOptions"
                      :key="state.productType"
                      label="text"
                      track-by="value"
                      :textLabel="$t('Product Type')"
                      :required="true"
                      :class="{ 'is-invalid': v$.productType.$error }"
                    />
                  </div>
                  <div v-if="v$.productType.$error" class="invalid-feedback">
                    <span class="text-danger" v-if="v$.productType.required">{{
                      $t("This value is required")
                    }}</span>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div
                    class="form-group checkbox-group d-flex align-items-start"
                  >
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      v-model="state.defaultOnOffer"
                      id="flexCheckDefault"
                    />
                    <label class="checkbox-label m-0" for="flexCheckDefault">
                      {{ $t("Is Default On Offers") }}
                    </label>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div
                    class="form-group checkbox-group d-flex align-items-start"
                  >
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      v-model="state.serviceContingent"
                      id="serviceContingent"
                    />
                    <label class="checkbox-label m-0" for="serviceContingent">
                      {{ $t("Service Contingent") }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3 d-flex align-items-center justify-content-end">
            <button
              class="primary-btn me-3"
              @click="navigateTo('/settings/products/Categories')"
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
        </div>
      </div>
    </form>
  </div>
</template>

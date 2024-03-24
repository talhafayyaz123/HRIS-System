<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  productCategoryUpdateRequest,
  productCategoryShowRequest,
  productUnitRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  categoryId = router.params.id,
  breadCrumbsConfig = [
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
      text: "Edit",
      active: true,
    },
  ],
  { title } = useTitle("Edit Categories"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig);

const state = reactive({
  defaultUnitId: "",
  defaultOnOffer: true,
  isLoading: false,
  categoryName: "",
  productType: "all",
  serviceContingent: false,
});

const currentPage = ref(1);
const order = ref("asc");
const column = ref("id");
const defaultUnits = ref([]);

const validationRules = {
    categoryName: { required },
    defaultUnitId: { required },
    productType: { required },
  },
  v$ = useVuelidate(validationRules, state);

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

const update = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return false;
  } else {
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    productCategoryUpdateRequest(
      {
        name: state.categoryName,
        isDefaultOnOffer: state.defaultOnOffer,
        defaultUnitId: state.defaultUnitId,
        productType: state.productType,
        serviceContingent: state.serviceContingent,
      },
      categoryId
    )
      .then((response) => {
        layout.changeLoaderValue(false);
        Toast.fire({
          icon: "success",
          title: t("Record updated successfully!"),
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

function refresh() {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  productUnitRequest({
    page: currentPage.value,
    perPage: 10,
    sortBy: column.value,
    order: order.value,
    search: "",
  }).then((response) => {
    defaultUnits.value = response?.data?.productUnits.map((pUnit: any) => {
      return {
        text: pUnit.name,
        value: pUnit.id,
      };
    });
  });
  productCategoryShowRequest(categoryId)
    .then((response) => {
      state.categoryName = response.data?.name;
      state.defaultUnitId = response.data?.defaultUnit?.id;
      state.productType = response.data?.productType ?? "all";
      state.defaultOnOffer = response.data?.isDefaultOnOffer;
      state.serviceContingent = response.data?.serviceContingent;
    })
    .finally(() => {
      layout.changeLoaderValue(false);
    });
}
refresh();

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="update">
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
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
                      :label="$t('Category Name')"
                      :required="true"
                      :disabled="state.isLoading"
                      id="category-name"
                      :class="{ 'is-invalid': v$.categoryName.$error }"
                    />
                    <div v-if="v$.categoryName.$error" class="invalid-feedback">
                      <span
                        class="text-danger"
                        v-if="v$.categoryName.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="form-group">
                    <elements-multiselect
                      v-model="state.defaultUnitId"
                      :key="state.defaultUnitId"
                      :options="defaultUnits"
                      label="text"
                      track-by="value"
                      :textLabel="$t('Default Unit')"
                      :required="true"
                    />

                    <div
                      v-if="v$.defaultUnitId.$error"
                      class="invalid-feedback"
                    >
                      <span
                        class="text-danger"
                        v-if="v$.defaultUnitId.required"
                        >{{ $t("This value is required") }}</span
                      ><br />
                    </div>
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
                  <div class="form-group checkbox-group">
                    <input
                      class="checkbox-input"
                      type="checkbox"
                      v-model="state.defaultOnOffer"
                      id="flexCheckDefault"
                    />
                    <label class="checkbox-label" for="flexCheckDefault">
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
              :iconName="'updateIcon'"
              :buttonName="$t('Update')"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

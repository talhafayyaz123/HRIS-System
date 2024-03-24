<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted, watch } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, requiredIf } from "@vuelidate/validators";
import { useProductStore } from "~/store/product";
import { useLayoutStore } from "~/store/layout";

import {
  getProductSoftwareChildrenRequest,
  getProductServiceChildrenRequest,
  addProductChildrensRequest,
} from "~/utils/apiRequests";
import { ProductTypeEnum } from "~/utils/enums";
import Treeselect from "@tkmam1x/vue3-treeselect";
import "@tkmam1x/vue3-treeselect/dist/vue3-treeselect.css";

const layout = useLayoutStore();
const product = useProductStore();
const { router, Toast } = commonCode();
const productId = router.params.id;
const { t } = useI18n();
const state = reactive({
  productVersionId: null,
  productId: null, // produt id in case if productType is service or pauschal
  productVersions: [], // software dropdown
  products: [], // // service dropdown
  showField: true,
});
const version = ref([]);
const isLoading = ref(false);
const productVersionsOptions = ref([]);
const productSoftwareOptions = ref([]);
const productServiceOptions = ref([]);

const validationRules = {
  productVersionId: {
    required: requiredIf(function () {
      return (
        product.productType === "software" ||
        product.productType == "cloud" ||
        product.productType == "hosting"
      );
    }),
  },
  productVersions: { required, minLength: minLength(1) },
  products: { required, minLength: minLength(1) },
};
const v$ = useVuelidate(validationRules, state);
const { nextStep, prevStep }: any = inject("nextPrevSteps");

// populating product versions droupdown, when product created
watch(
  () => product.productVersion,
  (prodVersion) => {
    productVersionsOptions.value = prodVersion;
    state.productVersionId = productVersionsOptions.value[0]?.value
  }
);
// in case of productType: service and pauschal, we don't have product version dropdown
// so adding on basic of product id from store
watch(
  () => product.productId,
  (prodId) => {
    state.productId = prodId;
  }
);

const softwareOptions = computed(function () {
  return softwareDependencyTree(productSoftwareOptions.value);
});
const serviceOptions = computed(function () {
  return serviceDependencyTree(productServiceOptions.value);
});
function softwareDependencyTree(dependencies) {
  const dependencyTree = [];
  if (dependencies instanceof Array) {
    dependencies.forEach((dependency) => {
      if (dependency.selected) {
        state.productVersions.push(dependency.versionId);
      }
      dependencyTree.push({
        id: dependency.versionId,
        label: dependency.value,
      });
    });
  } else {
    for (let key in dependencies) {
      dependencyTree.push({
        id: Math.random(),
        label: key,
        children: softwareDependencyTree(dependencies[key]),
      });
    }
  }
  return dependencyTree;
}

function serviceDependencyTree(dependencies) {
  const dependencyTree = [];
  if (dependencies instanceof Array) {
    dependencies.forEach((dependency) => {
      if (dependency.selected) {
        state.products.push(dependency.productId);
      }
      dependencyTree.push({
        id: dependency.productId,
        label: dependency.productName,
      });
    });
  } else {
    for (let key in dependencies) {
      dependencyTree.push({
        id: Math.random(),
        label: key,
        children: serviceDependencyTree(dependencies[key]),
      });
    }
  }
  return dependencyTree;
}

// In update case, populate the selected fields from the tree on basic of selected versionId
if (
  productId &&
  product.productType !== ProductTypeEnum.SERVICE &&
  product.productType !== ProductTypeEnum.PAUSCHAL &&
  product.productType !== ProductTypeEnum.TRAVELING
) {
  watch(
    () => state.productVersionId,
    async (selectedVersion) => {
      try {
        layout.changeLoaderValue(true);
        state.showField = false;
        const softwareRes = await getProductSoftwareChildrenRequest({
          productVersionId: selectedVersion,
        });
        const serviceRes = await getProductServiceChildrenRequest({
          productVersionId: selectedVersion,
        });

        state.productVersions.length = 0; // software dropdown
        state.products.length = 0; // service dropdown

        softwareDependencyTree(softwareRes?.data);
        serviceDependencyTree(serviceRes?.data);
        layout.changeLoaderValue(false);
        state.showField = true;
      } catch (e) {
        console.log(e);
        layout.changeLoaderValue(false);
      }
    }
  );
}

onMounted(async function () {
  try {
    const softwareRes = await getProductSoftwareChildrenRequest();
    const serviceRes = await getProductServiceChildrenRequest();
    productSoftwareOptions.value = softwareRes?.data;
    productServiceOptions.value = serviceRes?.data;
  } catch (e) {
    console.log(e);
  }
});
function skipStep(){
  nextStep(); 
}
// In update case, when productType is service or pauschal, populate the selected fields from the tree on basic of productId
async function fetchValues(prodId) {
  if (
    prodId &&
    (product.productType === ProductTypeEnum.SERVICE ||
      product.productType === ProductTypeEnum.PAUSCHAL ||
      product.productType === ProductTypeEnum.TRAVELING)
  ) {
    try {
      layout.changeLoaderValue(true);
      state.productId = prodId;
      state.showField = false;
      const softwareRes = await getProductSoftwareChildrenRequest({
        productId: prodId,
      });
      const serviceRes = await getProductServiceChildrenRequest({
        productId: prodId,
      });
      softwareDependencyTree(softwareRes?.data);
      serviceDependencyTree(serviceRes?.data);
      layout.changeLoaderValue(false);
      state.showField = true;
    } catch (e) {
      layout.changeLoaderValue(false);
      console.log(e);
    }
  }else {
    return
  }
}
fetchValues(productId);

async function saveProductChildrensHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;
      const formData = {
        ...(state.productVersionId && {
          productVersionId: state.productVersionId,
        }),
        ...(state.productVersions && {
          productVersions: state.productVersions,
        }),
        ...(state.products && { products: state.products }),
        ...((product.productType === ProductTypeEnum.SERVICE ||
          product.productType === ProductTypeEnum.PAUSCHAL ||
          product.productType === ProductTypeEnum.TRAVELING) && {
          productId: state.productId,
        }),
      };
      await addProductChildrensRequest(formData);
      Toast.fire({
        title: productId ? "Record updated successfully!" : "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      if (
        product.productType === ProductTypeEnum.SERVICE ||
        product.productType === ProductTypeEnum.PAUSCHAL ||
        product.productType === ProductTypeEnum.TRAVELING
      ) {
        navigateTo("/products");
      } else {
        nextStep();
      }
    } catch (error) {
      if (error && error?.response && error?.response?.data) {
        Toast.fire({
          icon: "error",
          title: error?.response?.data?.message,
        });
      }
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
      <div class="d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('Add Products Childrens') }}</h3>
        <elements-tooltip />
        </div>
        
        <div
          class="form-group mb-0 w-25"
          v-if="
            product.productType === ProductTypeEnum.SOFTWARE ||
            product.productType === ProductTypeEnum.HOSTING ||
            product.productType === ProductTypeEnum.CLOUD
          "
        >
          <elements-multiselect
            v-model="state.productVersionId"
            :options="productVersionsOptions"
            :key="state.productVersionId"
            label="name"
            track-by="value"
            :textLabel="$t('Version')"
            :required="true"
            :class="{ 'is-invalid': v$.productVersionId.$error }"
          />
          <div v-if="v$.productVersionId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$.productVersionId.required">{{
              $t("This value is required")
            }}</span>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <p>Software:</p>
            <treeselect
              v-if="state.showField"
              v-model="state.productVersions"
              :multiple="true"
              :valueConsistsOf="'LEAF_PRIORITY'"
              :options="softwareOptions"
              :class="{ 'is-invalid': v$.productVersions.$error }"
            >
            </treeselect>
            <div v-if="v$.productVersions.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.productVersions.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-6">
            <p>Service:</p>
            <treeselect
              v-if="state.showField"
              v-model="state.products"
              :multiple="true"
              :valueConsistsOf="'LEAF_PRIORITY'"
              :options="serviceOptions"
              :class="{ 'is-invalid': v$.products.$error }"
            >
            </treeselect>
            <div v-if="v$.products.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.products.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="form-group text-right mt-3 d-flex align-items-center justify-content-end"
    >
    <button class="primary-btn me-3" @click="skipStep()">
          <!-- <elements-icon v-bind:icon="'cancelIcon'" class="me-2"/> -->
          <span>{{ $t("Skip") }}</span>
      </button>
      <button class="link_text primary-btn me-3" @click.prevent="prevStep()">
        <elements-icon v-bind:icon="'backIcon'" class="me-2" />
        {{$t("Previous")}}
      </button>
      <submittal-button
        @click="saveProductChildrensHandler"
        :isLoading="isLoading"
        :iconName="('saveIcon')"
        :buttonName="
          productType === ProductTypeEnum.SERVICE ||
          productType === ProductTypeEnum.PAUSCHAL
            ? $t('Save and Proceed')
            : $t('Save and Proceed')
        "
      />
    </div>
  </div>
</template>

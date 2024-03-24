<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFeatures from "~/composables/generic";
import { employeeAssetRequest } from "~/utils/apiRequests";
import genericFunctionality from "~/composables/genericFunctionality";

const { router, Toast, deleteAlert } = commonCode();
const { showGenericListing } = genericFeatures(),
  { submitted, isLoading, apiRoute, storeFunc } = genericFunctionality(),
  { t } = useI18n(),
  props = defineProps({
    userProfileId: {
      type: String,
      default: "",
    },
  }),
  oldVehicles = ref([]),
  newVechicles = ref([]),
  emit = defineEmits(["assetDone", "backTocompensation"]),
  store = () => {
    emit("assetDone");
  };

const showCustomer = () => {
  employeeAssetRequest({
    userId: props.userProfileId,
  })
    .then((response) => {
      oldVehicles.value = response?.data?.previouslyOwnedCars;
      newVechicles.value = response?.data?.ownedCars;
    })
    .catch((error) => {
      // Toast.fire({icon: "error", title: t("Something went wrong")});
    });
};

watch(
  () => props.userProfileId,
  (value) => {
    showCustomer();
  }
);
const prev = () => {
  emit("backTocompensation");
};

</script>
<template>
  <div>
    <div class="card product-type">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('Old Vehicle') }}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body"></div>
    </div>
    <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr class="">
            <th class="">{{ $t("Licence Number") }}</th>
            <th class="">{{ $t("Model") }}</th>
            <th class="">{{ $t("Brand") }}</th>
            <th class="">{{ $t("Color") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="oldVehicles.length === 0">
            <td colspan="4">No Illness Leaves Found</td>
          </tr>
          <tr v-else v-for="(product, index) in oldVehicles" :key="index">
            <td>{{ product?.licenceNumber }}</td>
            <td>{{ product?.model }}</td>
            <td>{{ product?.brand }}</td>
            <td>{{ product?.color }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t('New Vehicle') }}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">

      </div>
    </div>
    <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr class="">
            <th class="">{{ $t("Licence Number") }}</th>
            <th class="">{{ $t("Model") }}</th>
            <th class="">{{ $t("Brand") }}</th>
            <th class="">{{ $t("Color") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="newVechicles.length === 0">
            <td colspan="4">No Illness Leaves Found</td>
          </tr>
          <tr v-else v-for="(product, index) in newVechicles" :key="index">
            <td>{{ product?.licenceNumber }}</td>
            <td>{{ product?.model }}</td>
            <td>{{ product?.brand }}</td>
            <td>{{ product?.color }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="form-group text-right mt-3 d-flex align-items-center justify-content-end">
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <elements-icon v-bind:icon="`backIcon`" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button @click.prevent="store()" :buttonName="$t('Save and Proceed')" :iconName="'saveIcon'" />
    </div>
  </div>
</template>

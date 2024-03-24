<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import { useLayoutStore } from "~/store/layout";
import Table from "~/components/Table/Table.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
const { router, Toast } = commonCode();

const { apiRoute, showFunc } = genericFunctionality();

const { t } = useI18n();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Fuel Monitoring",
    to: "/fleet-management/fuel-monitoring",
  },
  {
    text: "Show",
    active: true,
  },
];
const { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
{ title } = useTitle("Fuel Receipt Show");
const fuelMonitoringId = router.params.id;
const fuelMonitoringData = ref([]);
const fuelReceiptsData = ref([]);
const licenseNumber = ref("");
const totalQuantity = ref("");
const totalNetto = ref("");
const totalTax = ref("");
const totalBrutto = ref("");
const vim = ref("");
const model = ref("");
const refresh = async () => {
  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  apiRoute.value = routes.FUEL_MONITORING;
  if (fuelMonitoringId) {
    const response = await showFunc(fuelMonitoringId);
    if (response?.success) {
      fuelMonitoringData.value = response.data;
      await preview();
    }
  }
  layout.changeLoaderValue(false);
};

const preview = async () => {
  fuelReceiptsData.value = [];

  populateFuelMonitoringData();
  populateFuelReceipts();
  calculateTotalValues();
};

const populateFuelMonitoringData = () => {
  licenseNumber.value = fuelMonitoringData.value.licenceNumber;
  vim.value = fuelMonitoringData.value.vim;
  model.value = fuelMonitoringData.value.model;
};

const populateFuelReceipts = () => {
  fuelReceiptsData.value = fuelMonitoringData.value.fuelReceipts;
};

const calculateTotalValues = () => {
  totalQuantity.value = fuelMonitoringData.value.fuelReceipts.reduce(
    (total, fuelReceipt) => total + parseFloat(fuelReceipt.quantity),
    0
  );
  totalNetto.value = fuelMonitoringData.value.fuelReceipts.reduce(
    (total, fuelReceipt) => total + parseFloat(fuelReceipt.totalNetto),
    0
  );
  totalTax.value = fuelMonitoringData.value.fuelReceipts.reduce(
    (total, fuelReceipt) => total + parseFloat(fuelReceipt.tax),
    0
  );
  totalBrutto.value = fuelMonitoringData.value.fuelReceipts.reduce(
    (total, fuelReceipt) => total + parseFloat(fuelReceipt.totalBrutto),
    0
  );
};

refresh();
</script>
<template>
  <div>
    <page-header :title="title" :items="items" />
    <div>
      <div class="card mt-3">
        <div class="card-header">
          <h3 class="card-title">{{ $t('Fuel Receipt Details') }}</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4 col-md-4">
              <div class="form-group">
                <elements-input
                  v-model="licenseNumber"
                  :label="$t('License Number')"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-4">
              <div class="form-group">
                <elements-input
                  v-model="vim"
                  :label="$t('Vim')"
                  :disabled="true"
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-4">
              <div class="form-group">
                <elements-input
                  v-model="model"
                  :label="$t('Model')"
                  :disabled="true"
                />
              </div>
            </div>
          </div>
          <div class="mt-3 overflow-auto" v-if="fuelReceiptsData?.length">
            <table class="fuel-monitoring-list-table">
              <tr class="text-left font-bold heading-row">
                <th>{{ $t('Date') }}</th>
                <th>{{ $t('Mileage') }}</th>
                <th>{{ $t('Product') }}</th>
                <th>{{ $t('Quantity') }}</th>
                <th>{{ $t('Unit') }}</th>
                <th>{{ $t('Price / Unit') }}</th>
                <th>{{ $t('Consume / 100KM') }}</th>
                <th>{{ $t('Euro / 100KM') }}</th>
                <th>{{ $t('Total Netto') }}</th>
                <th>{{ $t('Tax') }}</th>
                <th>{{ $t('Total Brutto') }}</th>
              </tr>
              <tr v-for="fuelReceipt in fuelReceiptsData">
                <td>{{ fuelReceipt.deliveryDate }}</td>
                <td>{{ fuelReceipt.actualMileage }}</td>
                <td>{{ fuelReceipt.product }}</td>
                <td>{{ fuelReceipt.quantity }}</td>
                <td>{{ fuelReceipt.unit }}</td>
                <td>€{{ fuelReceipt.pricePerUnit }}</td>
                <td>{{ fuelReceipt.consumePerHundredKilometer }} LTR</td>
                <td>€{{ fuelReceipt.euroPerHundredKilometer }}</td>
                <td>€{{ fuelReceipt.totalNetto }}</td>
                <td>€{{ fuelReceipt.tax }}</td>
                <td>€{{ fuelReceipt.totalBrutto }}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="data-background-color">{{ totalQuantity }}</td>
                <td class="data-background-color">{{$t('LTR')}}</td>
                <td class="data-background-color"></td>
                <td class="data-background-color"></td>
                <td class="data-background-color"></td>

                <td class="data-background-color">€{{ totalBrutto }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.fuel-monitoring-list-table > tr > th {
  width: 500px !important;
}

.fuel-monitoring-list-table td {
  padding-left: 0 !important;
  padding-top: 10px !important;
}

.data-background-color {
  background-color: #d1d5db;
}
</style>

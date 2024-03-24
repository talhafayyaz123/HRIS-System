<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import {
  uploadCsvCountryRequest,
  saveCountryCsvDataRequest,
  saveProductCsvDataRequest,
} from "@/utils/apiRequests";
import commonCode from "~/composables/common";
import ImportProductCsvModal from "./components/ImportProductCsvModal.vue";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { router, Toast } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Products",
      to: "/products",
    },
    {
      text: "Import Products",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  },
  columnConfig = [
    {
      label: "Article Number",
      field: "manufacturerArticleNumber",
      sortable: false,
    },
    {
      label: "Name",
      field: "name",
      sortable: false,
    },
    {
      label: "Elo Version",
      field: "softwareVersion",
      sortable: false,
    },
    {
      label: "Description",
      field: "description",
      sortable: false,
    },
    {
      label: "Product Group",
      field: "productGroup",
      sortable: false,
    },
    {
      label: "Listing Price",
      field: "listingPrice",
      sortable: false,
    },
    {
      label: "Manufacturer Price",
      field: "maintenancePrice",
      sortable: false,
    },
    {
      label: "Maintenance Rate",
      field: "maintenanceRate",
      sortable: false,
    },
    {
      label: "Manufacturer Discount",
      field: "manufacturerDiscount",
      sortable: false,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Elo Configuration");
const isModalOpen = ref(false);
const isLoading = ref(false);
const csvProductsData = ref([]);
const csvProductsForm = ref({});

async function csvProductModalData(productData: any, formData: any) {
  csvProductsData.value = productData;
  csvProductsForm.value = formData;
}

async function saveCsvDataHandler() {
  try {
    isLoading.value = true;
    const csvData = {
      products: csvProductsData.value,
      type: csvProductsForm.value.type,
      priceListId: csvProductsForm.value.priceListId,
      paymentPeriodId: csvProductsForm.value.paymentPeriodId,
      unitId: csvProductsForm.value.unitId,
      softwareId: csvProductsForm.value.softwareId,
      versions: csvProductsForm.value.versions,
    };
    await saveProductCsvDataRequest(csvData);
    Toast.fire({
      title: "Success",
      text: "Record created successfully!",
      icon: "success",
    });
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
  }
}

function hideModal() {
  isModalOpen.value = false;
}
function showModal() {
  isModalOpen.value = true;
}

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />

    <submittal-button
      :buttonName="$t('Import Product Csv')"
      @click="showModal"
    />

    <div class="table-responsive mt-4">
      <Table
        class="doc-table"
        :key="csvProductsData?.length"
        :columns="columns"
        :isCustomBody="true"
      >
        <tr
          v-if="csvProductsData?.length > 0"
          v-for="(row, index) in csvProductsData"
          :key="row.id"
        >
          <td
            v-for="col in columns"
            :key="col.field"
            v-show="col.field !== 'action'"
          >
            {{ row[col.field] }}
          </td>
          <td>
            <ul class="list-inline table-action m-0">
              <li
                class="list-inline-item ml-1"
                @click="
                  () => {
                    csvProductsData.splice(index, 1);
                  }
                "
              >
                <ElementsIcon v-bind:icon="'deleteIcon'" />
              </li>
            </ul>
          </td>
          <td></td>
        </tr>
        <tr v-else>
          <td :colspan="columns?.length" class="text-sm text-center">
            {{ $t("No products imported.") }}
          </td>
        </tr>
      </Table>
    </div>

    <div
      class="mt-3 d-flex align-items-center justify-content-end"
      v-if="csvProductsData && csvProductsData.length > 0"
    >
      <submittal-button
        :isLoading="isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
        @click="saveCsvDataHandler"
      />
    </div>

    <import-product-csv-modal
      v-if="isModalOpen"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @csvProductModalData="csvProductModalData"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import {
  uploadCsvCountryRequest,
  saveCountryCsvDataRequest,
} from "@/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";

useHead({
  title: `Import Countries`,
});

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  items = [
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Global Settings",
      to: "/",
    },
    {
      text: "Countries",
      to: "/settings/global-settings/countries",
    },
    {
      text: "Import Countries",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: false,
    isBtnShow: false,
    btnText: "",
    path: "",
  };

const file = ref(null as any);
const isLoading = ref(false);
const countriesData = ref([]);

async function saveCsvDataHandler() {
  try {
    isLoading.value = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    await saveCountryCsvDataRequest({
      countries: countriesData.value,
    });
    layout.changeLoaderValue(false);
    Toast.fire({
      title: "Success",
      text: "Records created successfully",
      icon: "success",
    });
    isLoading.value = false;
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
    Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
    isLoading.value = false;
  }
}

// upload csv file
async function fileUploadHandler(e: any) {
  file.value = e.target.files[0];
  try {
    isLoading.value = true;
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);
    const formData = new FormData();
    formData.append("file", file.value);
    const res = await uploadCsvCountryRequest(formData);
    layout.changeLoaderValue(false);

    countriesData.value = res?.data;
    isLoading.value = false;
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />

    <input
      class="form-control"
      @change="fileUploadHandler"
      type="file"
      accept=".csv"
      style="width: 300px"
    />

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Iso Code</th>
            <th>Region</th>
            <th>Sub-Region</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="countriesData && countriesData.length > 0">
          <tr v-for="(row, index) in countriesData">
            <td>
              {{ row.name }}
            </td>
            <td>
              {{ row.iso_code }}
            </td>
            <td>
              {{ row.region }}
            </td>
            <td>
              {{ row.sub_region }}
            </td>
            <td>
              <li class="list-inline-item ml-1">
                <ElementsIcon
                  v-bind:icon="'deleteIcon'"
                  @click="
                    () => {
                      countriesData.splice(index, 1);
                    }
                  "
                />
              </li>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td>No countries imported.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-3 d-flex align-items-center justify-content-end"
      v-if="countriesData && countriesData.length > 0"
    >
      <submittal-button
        :isLoading="isLoading"
        :icon-name="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
        @click="saveCsvDataHandler"
      />
    </div>
  </div>
</template>

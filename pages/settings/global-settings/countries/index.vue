<script setup lang="ts">
import {
  uploadCsvCountryRequest,
  downloadCsvCountryRequest,
} from "@/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
import { ref } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  file = ref(null as any),
  isLoading = ref(false),
  { t } = useI18n(),
  breadCrumbsConfig = [
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
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: "Create Country",
    path: "/settings/global-settings/countries/create",
    csvBtn:true,
    csvBtnPath: "/settings/global-settings/countries/import-csv",
    csvBtnText:"Import CSV",
  };
const columnConfig = [
    {
      label: "Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Iso Code",
      field: "isoCode",
      sortable: true,
    },
    {
      label: "Region",
      field: "region",
      sortable: true,
    },
    {
      label: "Sub-Region",
      field: "subRegion",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],

  { title } = useTitle("Countries"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = ""
  ) => {
    orderColumn.value = "name";
    orderDirection.value = "asc";
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
    });
  };
apiRoute.value = routes.COUNTRY;
refresh();

// upload csv file
async function fileUploadHandler(e: any) {
  file.value = e.target.files[0];
  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("file", file.value);
    const res = await uploadCsvCountryRequest(formData);
    refresh();
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
}
// download csv template file
async function downloadCsvHandler() {
  try {
    isLoading.value = true;
    const res = await downloadCsvCountryRequest();
    const url = window.URL.createObjectURL(new Blob([res as any]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template.csv");
    document.body.appendChild(link);
    link.click();
    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
};

useHead({
  title: title,
});

</script>

<template>
  <div>
    <div>
      <page-header
        :title="title"
        :items="items"
        :optionalItems="optionalItems"
        @watchEvent="handleSearch"
      />
      <div class="table-responsive ">
        <!-- <div class="countries-csv">
          <div class="dropdown">
            <a
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              class="dropdownicon"
            >
              <i class="fe-settings"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <nuxt-link class="dropdown-item"
                  ><i
                    class="fas fa-file-import me-2"
                    :style="{ position: 'relative' }"
                  ></i>
                  Import CSV
                  <input
                    class="form-control"
                    @change="fileUploadHandler"
                    type="file"
                    accept=".csv"
                    :style="{ opacity: 0, position: 'absolute', top: 0 }"
                  />
                </nuxt-link>
                 <nuxt-link class="dropdown-item"
                 to="/settings/global-settings/countries/import-csv"
                  ><i
                    class="fas fa-file-import me-2"
                    :style="{ position: 'relative' }"
                  ></i>
                  Import CSV
                </nuxt-link>
                <nuxt-link class="dropdown-item" @click="downloadCsvHandler"
                  ><i class="fas fa-file-import me-2"></i> Download
                  CSV</nuxt-link
                >
              </li>
            </ul>
          </div>
        </div> -->
        <Table
          class="doc-table"
          :key="data?.countries?.length"
          :columns="columns"
          :rows="data?.countries"
          editPath="countries/edit-"
          :orderColumn="orderColumn"
          :orderDirection="orderDirection"
          @onSortChange="onSortChange"
          @destroy="destroy"
        />
      </div>
      <div class="mt-3">
        <Pagination :data="data" @change="refresh" />
      </div>
    </div>
  </div>
</template>

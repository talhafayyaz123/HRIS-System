<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericListingRequest } from "@/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";
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
    isLoading,
    priceListId,
    type,
    status,
    categoryId,
    softwareId,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Products",
      active: true,
    },
  ],
  optionalItems = {
    searchBar: true,
    isBtnShow: true,
    btnText: t("Create Product"),
    path: "/products/create",
    csvBtn: true,
    csvBtnText: t("Import CSV"),
    csvBtnPath: "/products/import-csv",
    downloadCsvBtn: true,
    downloadCsvBtnText: t("Export CSV"),
    downloadCsvBtnIcon: "",
  };
const priceListOptions = ref([]);
const productTypeOptions = ref([
  { value: "all", name: "All" },
  { value: "software", name: "Software" },
  { value: "service", name: "Service" },
  { value: "pauschal", name: "Pauschal" },
  { value: "hosting", name: "Hosting" },
  { value: "ams", name: "Application" },
  { value: "cloud", name: "Cloud" },
  { value: "traveling", name: "Traveling" },
]);
const statusOptions = ref([
  { value: "1", name: "active" },
  { value: "0", name: "inactive" },
]);

const productCategoriesOptions = ref([]);
const softwareOptions = ref([]);

// populate dropdowns for filters
onMounted(async function () {
  if(!type.value){ // by default set the type to all
    type.value = "all"
  }
  try {
    const priceListReq = await genericListingRequest(routes.PRICE_LIST, {
      all: true,
    });
    const categoryRes = await genericListingRequest(routes.PRODUCT_CATEGORY, {
      all: true,
    });
    const softwareRes = await genericListingRequest(routes.PRODUCT_SOFTWARE, {
      all: true,
    });

    priceListOptions.value = priceListReq?.data?.map((psv: any) => {
      return {
        value: psv.id,
        name: psv.name,
      };
    });
    productCategoriesOptions.value = categoryRes?.data?.map((pc: any) => {
      return {
        value: pc.id,
        name: pc.name,
      };
    });
    softwareOptions.value = softwareRes?.data?.map((ps: any) => {
      return {
        value: ps.id,
        name: ps.name,
      };
    });
  } catch (e) {
    console.log(e);
  }
});

const columnConfig = [
    {
      label: "Product Name",
      field: "name",
      sortable: true,
    },
    {
      label: "Article Number",
      field: "articleNumber",
      sortable: true,
    },
    {
      label: "Product Category",
      field: "ProductCategory.productCategory.name",
      sortable: true,
    },
    {
      label: "Product Type",
      field: "type",
      sortable: true,
    },
    {
      label: "Sale Price",
      field: "ProductPaymentDetail.paymentDetail.salePrice",
      sortable: true,
    },
    {
      label: "Profit",
      field: "profit",
      sortable: true,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Products"),
  refresh = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = "",
    productPriceListId = priceListId.value,
    productType = type.value,
    productStatus = status.value,
    productCategoryId = categoryId.value,
    productSoftwareId = softwareId.value
  ) => {
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
      priceListId: productPriceListId,
      type: productType,
      status: productStatus,
      categoryId: productCategoryId,
      softwareId: productSoftwareId,
    });
  };
// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.PRODUCT;
// after page load call this function
refresh();

watch(
  [
    () => priceListId.value,
    () => type.value,
    () => status.value,
    () => categoryId.value,
    () => softwareId.value,
  ],
  (
    [priceListId, prodType, status, categoryId, softwareId],
    [] // array containing previous values
  ) => {
    if (priceListId || prodType || status || categoryId || softwareId) {
      refresh();
    } else {
      type.value = "all";
      refresh();
    }
  }
);

const rowData = computed(() => {
  return data.value?.products?.map((prod) => {
    return {
      ...prod,
      productCategory: prod.productCategory?.name,
      productSoftware: prod.productSoftware?.name,
      productGroup: prod.productGroup?.name,
    };
  });
});

// TODO : download csv template file, need to implement download
function downloadCsvHandler() {
  // try {
  //   isLoading.value = true;
  //   // const res = downloadCsvProductRequest();
  //   let res;
  //   const url = window.URL.createObjectURL(new Blob([res as any]));
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", "template.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   isLoading.value = false;
  // } catch (e) {
  //   console.log(e);
  //   isLoading.value = false;
  // }
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
      @downloadCsvEvent="downloadCsvHandler"
    />

    <div class="row mb-3">
      <div class="col-lg-2">
        <div class="form-group">
          <elements-multiselect
            v-model="priceListId"
            :options="priceListOptions"
            :key="priceListId"
            label="name"
            track-by="value"
            :textLabel="$t('Price List')"
          />
        </div>
      </div>

      <div class="col-lg-2">
        <div class="form-group">
          <elements-multiselect
            v-model="type"
            :options="productTypeOptions"
            :key="type"
            label="name"
            track-by="value"
            :textLabel="$t('Type')"
          />
        </div>
      </div>

      <div class="col-lg-2">
        <div class="form-group">
          <elements-multiselect
            v-model="status"
            :options="statusOptions"
            :key="status"
            label="name"
            track-by="value"
            :textLabel="$t('Status')"
          />
        </div>
      </div>

      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect
            v-model="categoryId"
            :options="productCategoriesOptions"
            :key="categoryId"
            label="name"
            track-by="value"
            :textLabel="$t('Product Category')"
          />
        </div>
      </div>

      <div class="col-lg-3">
        <div class="form-group">
          <elements-multiselect
            v-model="softwareId"
            :options="softwareOptions"
            :key="softwareId"
            label="name"
            track-by="value"
            :textLabel="$t('Software')"
          />
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <!-- <div class="countries-csv">
        <div class="dropdown">
          <a href="#" data-bs-toggle="dropdown" aria-expanded="false" class="dropdownicon">
            <i class="fe-settings"></i>
          </a>
          <ul class="dropdown-menu">
            <li>
              <nuxt-link class="dropdown-item" to="/products/import-csv"
                ><i
                  class="fas fa-file-import me-2"
                  :style="{ position: 'relative' }"
                ></i>
                {{ $t('Import CSV') }}
              </nuxt-link>
              <nuxt-link class="dropdown-item" @click="downloadCsvHandler"
                ><i class="fas fa-file-import me-2"></i> {{ $t('Download CSV') }}</nuxt-link
              >
            </li>
          </ul>
        </div>
      </div> -->
      <Table
        class="doc-table"
        :key="data?.products?.length"
        :columns="columns"
        :isCustomBody="true"
        :orderColumn="orderColumn"
        :orderDirection="orderDirection"
        @onSortChange="onSortChange"
      >
        <tr
          v-if="rowData?.length > 0"
          v-for="row in rowData"
          :key="row.id"
          :class="{
            'active-status': row.status === 1,
            'inactive-status': row.status === 0,
          }"
        >
          <td v-if="row.id">{{ row.id }}</td>
          <!-- to show serial no -->
          <td
            v-for="col in columns"
            :key="col.field"
            v-show="col.field !== 'action'"
          >
            <span class="d-flex align-items-center" v-if="col.field === 'name'">
              <ElementsIcon v-bind:icon="'elloIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-else-if="col.field === 'type'">
              <ElementsIcon v-bind:icon="'softwareIcon'" class="me-2" />
              {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-else-if="col.field === 'ProductPaymentDetail.paymentDetail.salePrice'">
              € {{ row[col.field] }}
            </span>
            <span class="d-flex align-items-center" v-else-if="col.field === 'profit'">
              € {{ row[col.field] }}
            </span>
            <span v-else>
              {{ row[col.field] }}
            </span>
          </td>
          <td>
            <ul class="list-inline table-action m-0">
              <li class="list-inline-item ms-1">
                <NuxtLink :title="'Edit'" :to="'products/edit-' + row.id">
                  <ElementsIcon v-bind:icon="'editIcon'" />
                </NuxtLink>
              </li>
              <li class="list-inline-item ml-1 cursor-pointer">
                <NuxtLink
                  :title="'Delete'"
                  @click="
                    destroy(row.id, {
                      priceListId: priceListId,
                      type: type,
                      status: status,
                      categoryId: categoryId,
                      softwareId: softwareId,
                    })
                  "
                >
                  <ElementsIcon v-bind:icon="'deleteIcon'" />
                </NuxtLink>
              </li>
            </ul>
          </td>
          <td></td>
        </tr>
        <tr v-else>
          <td
            :colspan="columns ? columns.length + 2 : 1"
            class="text-sm text-center"
          >
            {{ $t("No Records Added") }}
          </td>
        </tr>
      </Table>
    </div>

    <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div>
  </div>
</template>

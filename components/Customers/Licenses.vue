<script setup lang="ts">
import { routes } from "~/utils/apiRoutes";
import { computed, ref } from "vue";
import {
  customerLicenseByIdRequest,
  customerLicenseDeleteRequest,
  customerLicenseRequest,
  customerLicenseStatisticsRequest,
  customerLicenseUpdateRequest,
  productByCategoryRequest,
} from "~/utils/apiRequests";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";

const {
  apiRoute,
  currentPerPage,
  currentPage,
  orderDirection,
  orderColumn,
  data,
  listingFunc,
  onSortChange,
  handleSearch,
  destroy,
} = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  showModal = ref(false),
  emit = defineEmits(["licensesDone", "backToDetails"]);
const props = defineProps({
  customerId: {
    type: String,
    default: false,
  },
});
const products = ref([]);
const productData = ref([]);
const licenseById = ref([]);
const originalLicenseById = ref([]);
const currentPageProduct = ref(1);
const order = ref("asc");
const column = ref("id");
const customerLicenses = ref([]);
const totalSalePrice = ref(0.0);
const totalMaintenancePrice = ref(0.0);
const softwareStatistics = ref([]);
const monthNumbers = ref({
  1: "jan",
  2: "feb",
  3: "mar",
  4: "apr",
  5: "may",
  6: "jun",
  7: "jul",
  8: "aug",
  9: "sep",
  10: "oct",
  11: "nov",
  12: "dec",
});
const currentMonth = new Date().getMonth() + 1;
const columns = ref([
  {
    label: "Article Number",
    field: "articleNumber",
    sortable: false,
  },
  {
    label: "Product Name",
    field: "name",
    sortable: false,
  },
  {
    label: "Software Type",
    field: "software",
    sortable: false,
  },
  {
    label: "Quantity",
    field: "quantity",
    sortable: false,
  },
  {
    label: "Sale Price Per Unit",
    field: "salePrice",
    sortable: false,
  },
  {
    label: "Sale Price",
    field: "totalSalePrice",
    sortable: false,
  },
  {
    label: "Maintenance Per Unit",
    field: "maintenancePrice",
    sortable: false,
  },
  {
    label: "Maintenance Rate",
    field: "totalMaintenanceRate",
    sortable: false,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  }
]);
const selectedYear = new Date().getFullYear();
const seriesExpansion = ref([76]);
const licenseTimelineStatisticsByYear = ref({});
const chartOptionsExpansion = ref({
  chart: {
    type: "radialBar",
    offsetY: -20,
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "rgba(245, 150, 48, 0.15)",
        strokeWidth: "100%",
        margin: 5, // margin is in pixels
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          color: "#999",
          opacity: 1,
          blur: 2,
        },
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: "22px",
        },
      },
    },
  },
  grid: {
    padding: {
      top: -10,
    },
  },
  fill: {
    colors: ["#F59630", "#B32824"],
  },
  labels: ["Expansion"],
});

const seriesSoftware = computed(() => {
  return softwareStatistics.value.map((stat: any) => stat.count);
});

const chartOptionsSoftware = computed(() => {
  const name = softwareStatistics.value.map((stat: any) => stat.name);
  return {
    chart: {
      width: 300,
      type: "pie",
    },
    labels: name,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
});

const seriesLicenseTimeline = computed(() => {
  let filteredStatisticsByCurrentMonth = [];
  // filter the licenseTimelineStatisticsByYear based on the currentMonth. By filter we mean that the months after the currentMonth must be set to null
  for (let key in licenseTimelineStatisticsByYear?.value?.[selectedYear] ??
    {}) {
    if (
      key <= currentMonth ||
      selectedYear < new Date().getFullYear() // if selectedYear is in the past then the month check should be false
    )
      filteredStatisticsByCurrentMonth.push(
        licenseTimelineStatisticsByYear?.value?.[selectedYear][key]
      );
    else {
      filteredStatisticsByCurrentMonth.push(null);
    }
  }
  return [
    {
      name: "Sale Price",
      data: filteredStatisticsByCurrentMonth.map(
        (item) => item?.salePrice ?? null
      ),
    },
    {
      name: "Maintenance Price",
      data: filteredStatisticsByCurrentMonth.map(
        (item) => item?.maintenancePrice ?? null
      ),
    },
  ];
});

const chartOptionsLicenseTimeline = computed(() => {
  return {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    colors: ["#2957a4", "#f59630"],
    xaxis: {
      labels: {
        rotate: 0,
      },
      categories: Object.keys(
        licenseTimelineStatisticsByYear?.value?.[selectedYear] ?? {}
      ).map((month) => monthNumbers?.value?.[month]), // get month names array from "licenseTimelineStatisticsByYear" and map the month number to month name using monthNumbers object
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value;
        },
      },
    },
  };
});

const refresh = () => {
  if (router.params.id) {
    licenses();
    showLicense();
  }
},
  licenses = (
    page = currentPage.value,
    perPage = currentPerPage.value,
    column = "id",
    order = "desc",
    search = "",
    companyId = props.customerId
  ) => {
    listingFunc({
      page: page,
      perPage: perPage,
      sortBy: column,
      sortOrder: order,
      search: search,
      companyId: companyId,
    });
  };
apiRoute.value = routes.CUSTOMER_LICENSE;

const rowData = computed(() => {
  return data.value
});

function callBackPaginate(page: any) {
  listingFunc({
    page: page,
    perPage: currentPerPage.value,
    sortBy: "id",
    sortOrder: "desc",
    search: "",
    companyId: props.customerId,
  });
}
function showLicense() {
  // customerLicenseRequest({
  //   page: currentPage.value,
  //   sortBy: column.value,
  //   sortOrder: order.value,
  //   search: "",
  //   companyId: props.customerId,
  // }).then((response) => {
  //   customerLicenses.value = response?.data?.data;
  // });

  customerLicenseStatisticsRequest({
    companyId: props.customerId,
  }).then((response) => {
    totalSalePrice.value = response?.data?.total_sale_price;
    totalMaintenancePrice.value = response?.data?.total_maintenance_price;
    softwareStatistics.value = response?.data?.software_types ?? [];
    licenseTimelineStatisticsByYear.value = response?.data?.data_by_year;
  });
}
async function popLicense(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        customerLicenseDeleteRequest(id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            licenses();
            showLicense();
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

const getLicense = (id: any) => {
  licenseById.value = [];
  originalLicenseById.value = [];
  customerLicenseByIdRequest(id)
    .then((response) => {
      const obj = {
        id: response?.data?.id,
        productId: response?.data?.productId,
        articleNumber: response?.data?.articleNumber,
        name: response?.data?.name,
        software: response?.data?.software?.name,
        quantity: response?.data?.quantity,
        salePrice: response?.data?.salePrice,
        maintenancePrice: response?.data?.maintenancePrice,
        isEvaluation: response?.data?.is_evaluation == 0 ? false : true,
        totalSalePrice: response?.data?.quantity * response?.data?.salePrice,
        totalMaintenancePrice:
          response?.data?.quantity * response?.data?.maintenancePrice,
      };
      licenseById.value.push(obj);
      originalLicenseById.value.push(obj);
      showModal.value = true;
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};

const editLicense = (id: any) => {
  customerLicenseUpdateRequest(
    {
      companyId: props.customerId,
      isEvaluation: licenseById.value[0].isEvaluation,
      maintenancePrice: licenseById.value[0].maintenancePrice,
      salePrice: licenseById.value[0].salePrice,
      quantity: licenseById.value[0].quantity,
      productId: licenseById.value[0].productId,
    },
    licenseById.value[0].id
  )
    .then((response) => {
      showModal.value = false;
      Toast.fire({
        icon: "success",
        title: t("Record updated successfully!"),
      });
      licenses();
      showLicense();
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("Something went wrong") });
    });
};

refresh();

const isModalOpen = ref(false);

const licenseAdded = () => {
  licenses();
  showLicense();
};

const changePrice = (index, event) => {
  const changedValue = event.target.value;
  licenseById.value[0].totalSalePrice =
    changedValue * originalLicenseById.value[0].salePrice;
  licenseById.value[0].totalMaintenancePrice =
    changedValue * originalLicenseById.value[0].maintenancePrice;
},
  addLicense = () => {
    if (!!products.value) productsFun();
  },
  pageChange = (value: any) => {
    productData.value = [];
    products.value = [];
    productsFun(value);
  },
  productsFun = (pageNumber = currentPageProduct.value) => {
    productByCategoryRequest({
      page: pageNumber,
      perPage: 10,
      sortBy: column.value,
      order: order.value,
      type: "software",
      search: "",
    }).then((response) => {
      productData.value = response?.data;
      products.value = response?.data?.products;
      openModal();
    });
  };

function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}
const prev = () => {
  emit("backToDetails");
};

const next = () => {
  emit("licensesDone");
};
</script>
<template>
  <div>
    <div class="row">
      <div class="col-lg-3">
        <div class="lisenses-card expansion-card">
          <div class="mb-4">
            <h4 class="card-title">{{ $t("Sales Lifetime") }}</h4>
          </div>
          <div class="">
            <ul class="">
              <li>
                <p>License</p>
                <h4>€{{ totalSalePrice }}</h4>
              </li>
              <li>
                <p>Maintainance</p>
                <h4>€{{ totalMaintenancePrice }}</h4>
              </li>
              <li>
                <p>Lifetime</p>
                <h4>€0.00</h4>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="lisenses-card">
          <div class="">
            <h4 class="card-title">{{ $t("Expansion") }}</h4>
            <apexchart class="mt-5" type="pie" width="300" :key="chartOptionsSoftware" :options="chartOptionsSoftware"
              :series="seriesSoftware"></apexchart>
          </div>
          <div class="">
            <apexchart class="mt-5" type="radialBar" :options="chartOptionsExpansion" :series="seriesExpansion">
            </apexchart>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="lisenses-card">
          <div class="">
            <h4 class="card-title">{{ $t("License Timeline") }}</h4>
            <p v-for="(year, index) in Object.keys(
              licenseTimelineStatisticsByYear
            )" :key="'year-' + index" @click="selectedYear = year" :class="[
  'text-sm',
  'px-2',
  'cursor-pointer',
  'border-r-2 border-gray-500',
  selectedYear == year ? 'font-bold' : 'text-gray-600',
]">
              {{ year }}
            </p>
            <apexchart type="line" :options="chartOptionsLicenseTimeline" :series="seriesLicenseTimeline" width="90%">
            </apexchart>
          </div>
          <div class=""></div>
        </div>
      </div>
    </div>
    <div class="License-overview pt-4 pb-4 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("License Overview") }}</h3>
        <ElementsTooltip />
      </div>
      <button class="secondary-btn" @click="addLicense()">
        <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
        {{ $t("Add License") }}
      </button>
    </div>
    <Table class="doc-table" :key="rowData" :columns="columns" :isCustomBody="true" :orderColumn="orderColumn"
      :orderDirection="orderDirection" @onSortChange="onSortChange">
      <tr v-if="rowData?.data?.length > 0" v-for="row in rowData?.data" :key="row.id">
        <td v-for="col in columns" :key="col.field" v-show="col.field !== 'action'">
          <span v-if="col.field === 'name'">
            <ElementsIcon v-bind:icon="'elloIcon'" class="me-2" />
            {{ row[col.field] }}
          </span>
          <span v-else-if="col.field === 'software'">
            <ElementsIcon v-bind:icon="'softwareIcon'" class="me-2" />
            {{ row[col.field].name }}
          </span>
          <span v-else-if="col.field === 'salePrice'">
            € {{ row[col.field] }}
          </span>
          <span v-else-if="col.field === 'totalSalePrice'">
            {{ row['quantity'] * row['salePrice'] }}
          </span>
          <span v-else-if="col.field === 'maintenancePrice'">
            € {{ row[col.field] }}
          </span>
          <span v-else-if="col.field === 'totalMaintenanceRate'">
            {{ row['quantity'] * row['maintenancePrice'] }}
          </span>
          <span v-else>
            {{ row[col.field] }}
          </span>
        </td>
        <td>
          <ul class="list-inline table-action m-0">
            <li class="list-inline-item ms-1">
              <i class="mdi mdi-pencil edit-icon" @click.prevent="getLicense(row?.id)"></i>
              <i class="mdi mdi-delete edit-icon" @click.prevent="popLicense(row?.id)"></i>
            </li>
          </ul>
        </td>
        <td></td>
      </tr>
      <tr v-else>
        <td :colspan="columns?.length" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><span style="color: #F59630;font-size: 14px; vertical-align: middle;font-weight: 700;">Sum:</span></td>
        <td class=""><span class="tag-table-yellow">€{{ totalSalePrice }}</span></td>
        <td></td>
        <td><span class="tag-table-yellow">€{{ totalMaintenancePrice }}</span></td>
        <td></td>
        <td></td>
      </tr>
      <!-- <span class="tag-table-yellow">€{{ totalSalePrice }}</span>
        <span class="tag-table-yellow">€{{ totalMaintenancePrice }}</span> -->
    </Table>

    <div class="mt-3">
      <Pagination :data="rowData" @change="callBackPaginate" />
    </div>

    <!-- <div class="mt-3">
      <Pagination :data="data" @change="refresh" />
    </div> -->
    <!-- <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr class="">
            <th class="">{{ $t("Article Number") }}</th>
            <th class="">{{ $t("Product Name") }}</th>
            <th class="">{{ $t("Software Type") }}</th>
            <th class="">{{ $t("Quantity") }}</th>
            <th class="">{{ $t("Sale Price Per Unit") }}</th>
            <th class="">{{ $t("Sale Price") }}</th>
            <th class="">{{ $t("Maintenance Per Unit") }}</th>
            <th class="">{{ $t("Maintenance Rate") }}</th>
            <th class="">{{ $t("Actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(license, index) in customerLicenses" :key="index">
            <td>{{ license?.articleNumber }}</td>
            <td>{{ license?.name }}</td>
            <td>{{ license?.software?.name }}</td>
            <td>{{ license?.quantity }}</td>
            <td>{{ license?.salePrice }}</td>
            <td>{{ license?.salePrice * license?.quantity }}</td>
            <td>{{ license?.maintenancePrice }}</td>
            <td>{{ license?.maintenancePrice * license?.quantity }}</td>
            <td>
              <i
                class="mdi mdi-pencil edit-icon"
                @click.prevent="getLicense(license?.id)"
              ></i>
              <i
                class="mdi mdi-delete edit-icon"
                @click.prevent="popLicense(license?.id)"
              ></i>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><span style="color: #F59630;font-size: 14px; vertical-align: middle;font-weight: 700;">Sum:</span></td>
            <td><span class="tag-table-yellow">€{{ totalSalePrice }}</span></td>
            <td></td>
            <td><span class="tag-table-yellow">€{{ totalMaintenancePrice }}</span></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <Modal :showModal="showModal" @hideModal="showModal = false" :title="`Edit Employee`" class="product-modal">
      <div class="row">
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Article Number</label>
            <input v-model="licenseById[0].articleNumber" readonly type="text" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Name</label>
            <input v-model="licenseById[0].name" readonly type="text" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Software</label>
            <input v-model="licenseById[0].software" readonly type="text" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Quantity</label>
            <input min="1" v-model="licenseById[0].quantity" @change="changePrice(index, $event)" type="number"
              class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Sale Price</label>
            <input v-model="licenseById[0].salePrice" readonly type="number" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Total Sale Price</label>
            <input v-model="licenseById[0].totalSalePrice" readonly type="number" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Maintenance Price</label>
            <input v-model="licenseById[0].maintenancePrice" readonly type="number" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Total Maintenance Price</label>
            <input v-model="licenseById[0].totalMaintenancePrice" readonly type="number" class="form-control" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group">
            <label>Evaluation License</label>
            <input v-model="licenseById[0].isEvaluation" type="checkbox" />
          </div>
        </div>
        <div class="col-lg-6 col-md-6">
          <div class="form-group"></div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end mt-3">
        <button type="button" class="primary-btn me-2" data-bs-dismiss="modal" @click="() => (showModal = false)">
          Close
        </button>
        <submittal-button :buttonName="$t('Edit License')" @click="editLicense()" />
      </div>
    </Modal>

    <!--license-modal-->
    <customers-add-license :customerId="customerId" :key="products.length" :products="products" :data="productData"
      :showModal="isModalOpen" :hideModal="hideModal" @licenses-added="licenseAdded" @onSortChange="pageChange" />
    <!--license-modal end-->

    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="next()">
        <span>{{ $t("Skip") }}</span>
      </button>
      <button class="link_text primary-btn me-3" @click.prevent="prev()">
        <ElementsIcon v-bind:icon="'backIcon'" class="me-2" />
        {{ $t("Previous") }}
      </button>
      <submittal-button @click="next()" :iconName="'saveIcon'" :buttonName="$t('Save and Proceed')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted, watch } from "vue";
import { useProductStore } from "~/store/product";
import {
  genericListingRequest,
  addProductDetailRequest,
  getProductDetailByIdRequest,
  editProductDetailRequest,
  ruleListRequest,
} from "~/utils/apiRequests";
import { ProductTypeEnum } from "~/utils/enums";
import { routes } from "~/utils/apiRoutes";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, requiredIf } from "@vuelidate/validators";
import { useLayoutStore } from "~/store/layout";

const layout = useLayoutStore();
const { router, Toast } = commonCode();
const { t } = useI18n();

const productId = router.params.id;

const product = useProductStore();
const { nextStep, prevStep }: any = inject("nextPrevSteps");

const state = reactive({
  type: product.productType,
  name: "",
  status: null,
  productGroupId: null,
  productCategoryId: null,
  versions: [],
  softwareId: null,
  softwareVersionId: null,
  discount: null,
  tax: null,
  description: "",
  ruleIds: [],
  priceListId: null,
  manufacturerNumber: "",
  executionNumber: null,
  unitId: null,
  fixedPrice: 0,
  recurringPayment: null,
  paymentPeriodId: null,
  pricePerPeriod: null,
  listingPrice: null,
  manufacturerDiscount: null,
  salePrice: null,
  profit: null,
  maintenancePrice: null,
  maintenanceRate: null,
  hourlyRate: null,
  quantity: null,
  dailyRate: null,
  // Todo: they are remove, so remove them permanently
  // serviceHours: null,
  // serviceDays: null,
  amsType: "contingent",
});

const isLoading = ref(false);

const productTypeOptions = [
  { value: ProductTypeEnum.SOFTWARE, name: "Software" },
  { value: ProductTypeEnum.SERVICE, name: "Service" },
  { value: ProductTypeEnum.PAUSCHAL, name: "Pauschal" },
  { value: ProductTypeEnum.HOSTING, name: "Hosting" },
  { value: ProductTypeEnum.AMS, name: "Ams" },
  { value: ProductTypeEnum.CLOUD, name: "Cloud" },
  { value: ProductTypeEnum.TRAVELING, name: "Traveling" },
];
const productStatusOptions = [
  { value: 1, name: "Active" },
  { value: 0, name: "Deactive" },
];
const productCategoriesOptions = ref([]);
const productGroupsOptions = ref([]);
const productSoftwareOptions = ref([]);
const productSoftwareVersionsOptions = ref([]);
const recurringPaymentOptions = [
  { value: 1, name: "Yes" },
  { value: 0, name: "No" },
];
const unitsOptions = ref([]);
const paymentPeriodOptions = ref([]);

const rulesOptions = ref([]);
const priceListOptions = ref([]);

const validationRules = {
  name: { required },
  status: { required },
  productGroupId: {
    required: requiredIf(function () {
      return (
        product.productType !== "cloud" && product.productType !== "traveling"
      );
    }),
  },
  productCategoryId: {
    required: requiredIf(function () {
      return (
        product.productType !== "software" &&
        product.productType !== "cloud" &&
        product.productType !== "traveling"
      );
    }),
  },
  versions: {
    required: requiredIf(function () {
      return (
        product.productType === "software" ||
        product.productType == "cloud" ||
        product.productType == "hosting"
      );
    }),
  },
  softwareId: {
    required: requiredIf(function () {
      return (
        product.productType !== "hosting" && product.productType !== "traveling"
      );
    }),
  },

  softwareVersionId: {
    required: requiredIf(function () {
      return product.productType === "software";
    }),
  },
  tax: {
    required: requiredIf(function () {
      return product.productType !== "traveling";
    }),
  },
  priceListId: {
    required: requiredIf(function () {
      return product.productType !== "hosting";
    }),
  },
  // second obj
  manufacturerNumber: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  executionNumber: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  unitId: {
    required: requiredIf(function () {
      return (
        product.productType === "software" ||
        product.productType === "cloud" ||
        product.productType === "service" ||
        product.productType === "pauschal" ||
        product.productType === "ams" 
      );
    }),
  },
  fixedPrice:{ // only in productType: ams
    required: requiredIf(function () {
      return (
        state.amsType === "fix_price"
      );
    }),
  }, 
  recurringPayment: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  paymentPeriodId: {
    required: requiredIf(function () {
      return (
        product.productType === "software" ||
        product.productType === "cloud" ||
        product.productType === "hosting" ||
        (product.productType === "ams"  && state.amsType == "contingent" )
      );
    }),
  },
  listingPrice: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  manufacturerDiscount: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  salePrice: {
    required: requiredIf(function () {
      return (
        product.productType === "software" ||
        product.productType === "cloud" ||
        product.productType === "service" ||
        product.productType === "pauschal" ||
        product.productType === "traveling"
      );
    }),
  },
  profit: {
    required: requiredIf(function () {
      return (
        product.productType === "software" || product.productType === "cloud"
      );
    }),
  },
  maintenancePrice: {
    required: requiredIf(function () {
      return product.productType === "software";
    }),
  },
  maintenanceRate: {
    required: requiredIf(function () {
      return product.productType === "software";
    }),
  },

  hourlyRate: {
    required: requiredIf(function () {
      return product.productType === "service" || (product.productType == "ams"  && state.amsType == "contingent");
    }),
  },
  quantity: {
    required: requiredIf(function () {
      return (
        product.productType === "service" || product.productType === "pauschal"
      );
    }),
  },

  dailyRate: {
    required: requiredIf(function () {
      return product.productType === "service" || (product.productType == "ams" && state.amsType == "contingent") ;
    }),
  },

  // serviceHours: {
  //   required: requiredIf(function () {
  //     return product.productType === "ams";
  //   }),
  // },
  // serviceDays: {
  //   required: requiredIf(function () {
  //     return product.productType === "ams";
  //   }),
  // },
};
const v$ = useVuelidate(validationRules, state);

// populate dropdowns
onMounted(async function () {
  try {
    layout.changeLoaderValue(true);
    const categoryRes = await genericListingRequest(routes.PRODUCT_CATEGORY, {
      productType: product.productType,
    });
    const groupRes = await genericListingRequest(routes.PRODUCT_GROUP, {
      all: true,
    });
    const softwareRes = await genericListingRequest(routes.PRODUCT_SOFTWARE, {
      all: true,
    });
    const unitsRes = await genericListingRequest(routes.PRODUCT_UNIT, {
      all: true,
    });
    const paymentPeriodRes = await genericListingRequest(
      routes.PRODUCT_PAYMENT_PERIOD,
      {
        all: true,
      }
    );
    const rulesListRes = await ruleListRequest();

    if (product.productType === "traveling") {
      const priceListReq = await genericListingRequest(routes.PRICE_LIST, {
        all: true,
      });
      priceListOptions.value = priceListReq?.data?.map((psv: any) => {
        return {
          value: psv.id,
          name: psv.name,
        };
      });
    }
    productCategoriesOptions.value = categoryRes?.data?.productCategories?.map((pc: any) => {
      return {
        value: pc.id,
        name: pc.name,
      };
    });
    productGroupsOptions.value = groupRes?.data?.map((pg: any) => {
      return {
        value: pg.id,
        name: pg.name,
      };
    });
    productSoftwareOptions.value = softwareRes?.data?.map((ps: any) => {
      return {
        value: ps.id,
        name: ps.name,
      };
    });
    unitsOptions.value = unitsRes?.data?.map((uo: any) => {
      return {
        value: uo.id,
        name: uo.name,
      };
    });
    paymentPeriodOptions.value = paymentPeriodRes?.data?.map((pp: any) => {
      return {
        value: pp.id,
        name: pp.name,
      };
    });
    rulesOptions.value = rulesListRes?.map((rl: any) => {
      return {
        value: rl.id,
        name: rl.rule_name,
      };
    });

    layout.changeLoaderValue(false);
  } catch (e) {
    console.log(e);
    layout.changeLoaderValue(false);
  }
});

// software versions will populate on basic of software
watch(
  () => state.softwareId,
  async (softwareId) => {
    try {
      state.softwareVersionId = productId ? state.softwareVersionId : null;
      const softwareVersionReq = await genericListingRequest(
        routes.PRODUCT_VERSION,
        {
          softwareId: softwareId,
        }
      );
      productSoftwareVersionsOptions.value = softwareVersionReq?.data?.map(
        (psv: any) => {
          return {
            value: psv.id,
            name: psv.name,
          };
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
);

// priceListOptions will populate on basic of software expect when productType is traveling
watch(
  () => state.softwareId,
  async (softwareId) => {
    try {
      state.priceListId = productId ? state.priceListId : null;
      const priceListReq = await genericListingRequest(routes.PRICE_LIST, {
        all: true,
        productSoftwareId: softwareId,
      });
      priceListOptions.value = priceListReq?.data?.map((psv: any) => {
        return {
          value: psv.id,
          name: psv.name,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }
);

// In case of edit, populate products
onMounted(async function () {
  try {
    if (!productId) {
      return;
    }
    isLoading.value = true;
    const res = await getProductDetailByIdRequest(productId);
    const {
      type,
      name,
      status,
      productGroup,
      productCategory,
      versions,
      productSoftware,
      productSoftwareVersion,
      discount,
      tax,
      description,
      rules,
      priceList,
      paymentDetail,
    } = res.data;
    product.productType = type;
    state.type = type;
    state.name = name;
    state.status = status;
    state.productGroupId = productGroup?.id;
    state.productCategoryId = productCategory?.id;
    state.versions = versions.map((ver: any) => ver.version);
    state.softwareId = productSoftware?.id;
    state.softwareVersionId = productSoftwareVersion?.id;
    state.discount = discount;
    state.tax = tax;
    state.description = description;
    state.ruleIds = rules;
    state.priceListId = priceList?.id;

    state.manufacturerNumber = paymentDetail?.manufacturerNumber;
    state.executionNumber = paymentDetail?.executionNumber;
    state.unitId = paymentDetail?.productUnit?.id;
    state.fixedPrice = paymentDetail?.fixedPrice;
    state.recurringPayment = paymentDetail?.isRecurringPayment;
    state.paymentPeriodId = paymentDetail?.paymentPeriod?.id;
    state.pricePerPeriod = paymentDetail?.pricePerPeriod;
    state.listingPrice = paymentDetail?.listingPrice;
    state.manufacturerDiscount = paymentDetail?.manufacturerDiscount;
    state.salePrice = paymentDetail?.salePrice;
    state.profit = paymentDetail?.profit;
    state.maintenancePrice = paymentDetail?.maintenancePrice;
    state.maintenanceRate = paymentDetail?.maintenanceRate;
    state.hourlyRate = paymentDetail?.hourlyRate;
    state.quantity = paymentDetail?.quantity;
    state.dailyRate = paymentDetail?.dailyRate;
    state.amsType = paymentDetail?.amsType

    // Todo: they are remove, so remove them permanently
    // state.serviceHours = paymentDetail?.serviceHours;
    // state.serviceDays = paymentDetail?.serviceDays;

    isLoading.value = false;
  } catch (e) {
    console.log(e);
    isLoading.value = false;
  }
});

async function saveProductDetailHandler() {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const formData = {
        type: product.productType,
        ...(state.name && { name: state.name }),
        ...(state.status !== false && { status: state.status }),
        ...(state.productGroupId && { productGroupId: state.productGroupId }),
        ...(state.productCategoryId && {
          productCategoryId: state.productCategoryId,
        }),
        ...(state.versions &&
          state.versions.length > 0 && { versions: state.versions }),
        ...(state.softwareId && { softwareId: state.softwareId }),
        ...(state.softwareVersionId && {
          softwareVersionId: state.softwareVersionId,
        }),
        ...(state.discount && { discount: state.discount }),
        ...(state.tax && { tax: state.tax }),
        ...(state.description && { description: state.description }),
        ...(state.ruleIds &&
          state.ruleIds.length > 0 && { ruleIds: state.ruleIds }),
        ...(state.priceListId && { priceListId: state.priceListId }),
        paymentDetail: {
          ...(state.manufacturerNumber && {
            manufacturerNumber: state.manufacturerNumber,
          }),
          ...(state.executionNumber && {
            executionNumber: state.executionNumber,
          }),
          ...(state.unitId && { unitId: state.unitId }),
          ...(state.fixedPrice && { fixedPrice: state.fixedPrice }),
          ...(state.recurringPayment !== false &&
            state.recurringPayment !== null && {
              recurringPayment: state.recurringPayment,
            }),
          ...(state.paymentPeriodId && {
            paymentPeriodId: state.paymentPeriodId,
          }),
          ...(state.listingPrice && { listingPrice: state.listingPrice }),
          ...(state.manufacturerDiscount && {
            manufacturerDiscount: state.manufacturerDiscount,
          }),
          ...(state.salePrice && { salePrice: state.salePrice }),
          ...(state.profit && { profit: state.profit }),
          ...(state.maintenancePrice && {
            maintenancePrice: state.maintenancePrice,
          }),
          ...(state.maintenanceRate && {
            maintenanceRate: state.maintenanceRate,
          }),
          ...(state.hourlyRate && {
            hourlyRate: state.hourlyRate,
          }),
          ...(state.quantity && {
            quantity: state.quantity,
          }),
          ...(state.dailyRate && {
            dailyRate: state.dailyRate,
          }),
          ...(state.amsType && {
            amsType: state.amsType,
          }),
          // ...(state.serviceHours && {
          //   serviceHours: state.serviceHours,
          // }),
          // ...(state.serviceDays && {
          //   serviceDays: state.serviceDays,
          // }),
          ...(state.pricePerPeriod && {
            pricePerPeriod: state.pricePerPeriod,
          }),
        },
      };
      isLoading.value = true;
      const res = await (productId
        ? editProductDetailRequest(productId, formData)
        : addProductDetailRequest(formData));
      product.addProductData(res?.data);
      Toast.fire({
        title: productId
          ? "Record updated successfully!"
          : "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      if (product.productType === ProductTypeEnum.AMS) {
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

function addNewVersion(newTag) {
  const tag = {
    title: newTag,
    // you'll need to add other items specific to your objects
  };
  state.versions.push(tag);
}
</script>

<template>
  <div>
    <div class="card product-type" v-if="productId">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Product Type") }}</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="product.productType"
                :options="productTypeOptions"
                :key="product.productType"
                label="name"
                track-by="value"
                :textLabel="$t('Product Type')"
                :required="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Product Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.name"
                :label="$t('Name')"
                :required="true"
                id="name"
                :class="{ 'is-invalid': v$.name.$error }"
              />
            </div>
            <div v-if="v$.name.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.name.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.status"
                :options="productStatusOptions"
                :key="state.status"
                label="name"
                track-by="value"
                :textLabel="$t('Status')"
                :required="true"
                :class="{ 'is-invalid': v$.status.$error }"
              />
            </div>
            <div v-if="v$.status.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.status.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group">
              <elements-multiselect
                v-model="state.productGroupId"
                :options="productGroupsOptions"
                :key="state.productGroupId"
                label="name"
                track-by="value"
                :textLabel="$t('Product Group')"
                :required="product.productType !== 'cloud'"
                :class="{ 'is-invalid': v$.productGroupId.$error }"
              />
            </div>
            <div v-if="v$.productGroupId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.productGroupId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group">
              <elements-multiselect
                v-model="state.productCategoryId"
                :options="productCategoriesOptions"
                :key="state.productCategoryId"
                label="name"
                track-by="value"
                :textLabel="$t('Product Category')"
                :required="
                  product.productType !== 'software' &&
                  product.productType !== 'cloud'
                "
                :class="{ 'is-invalid': v$.productCategoryId.$error }"
              />
            </div>
            <div v-if="v$.productCategoryId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.productCategoryId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div
            class="col-md-6"
            v-if="
              product.productType === 'software' ||
              product.productType === 'cloud' ||
              product.productType === 'hosting'
            "
          >
            <div class="form-group">
              <elements-multiselect
                v-model="state.versions"
                :options="state.versions"
                :key="state.versions"
                label="name"
                track-by="name"
                :multiple="true"
                :textLabel="$t('Versions')"
                :required="true"
                :createOption="true"
                :class="{ 'is-invalid': v$.versions.$error }"
                :taggable="true"
                :tagPlaceholder="$t('Add a new version')"
                @tagAdded="addNewVersion"
                placeholder="Add Versions Manually"
              />
            </div>
            <span style="font-size:12px;">{{
                    $t(
                      "Note:- Add Muliple Versions Manually"
                    )
                  }}</span>
            <div v-if="v$.versions.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.versions.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group">
              <elements-multiselect
                v-model="state.softwareId"
                :options="productSoftwareOptions"
                :key="state.softwareId"
                label="name"
                track-by="value"
                :textLabel="$t('Software')"
                :required="product.productType !== 'hosting'"
                :class="{ 'is-invalid': v$.softwareId.$error }"
              />
            </div>
            <div v-if="v$.softwareId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.softwareId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div
            class="col-md-6"
            v-if="
              product.productType === 'software' ||
              product.productType === 'cloud'
            "
          >
            <div class="form-group">
              <elements-multiselect
                v-model="state.softwareVersionId"
                :options="productSoftwareVersionsOptions"
                :key="state.softwareVersionId"
                label="name"
                track-by="value"
                :textLabel="$t('Software Version')"
                :required="product.productType !== 'cloud'"
                :class="{ 'is-invalid': v$.softwareVersionId.$error }"
              />
              <div v-if="v$.softwareVersionId.$error" class="invalid-feedback">
                <span
                  class="text-danger"
                  v-if="v$.softwareVersionId.required"
                  >{{ $t("This value is required") }}</span
                >
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`percentageIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.discount"
                  :label="$t('Discount')"
                  id="discount"
                  type="number"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`percentageIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.tax"
                  :label="$t('Tax(%)')"
                  :required="true"
                  id="tax"
                  type="number"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.tax.$error }"
                />
              </div>
            </div>
            <div v-if="v$.tax.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.tax.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'traveling'">
            <div class="form-group textarea">
              <textarea
                name=""
                id=""
                class="form-control"
                v-model="state.description"
                placeholder="."
              ></textarea>
              <label for="" class="input-label">{{ $t("Description") }}</label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.priceListId"
                :options="priceListOptions"
                :key="state.priceListId"
                label="name"
                track-by="value"
                :textLabel="$t('Price List')"
                :required="product.productType !== 'hosting'"
                :class="{ 'is-invalid': v$.priceListId.$error }"
              />
            </div>
            <div v-if="v$.priceListId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.priceListId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Payment Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div
          class="row"
          v-if="
            product.productType === 'software' ||
            product.productType === 'cloud'
          "
        >
          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.manufacturerNumber"
                :label="$t('Manufacturer article number')"
                :required="true"
                id="manufacturerNumber"
                :class="{ 'is-invalid': v$.manufacturerNumber.$error }"
              />
            </div>
            <div v-if="v$.manufacturerNumber.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.manufacturerNumber.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.executionNumber"
                :label="$t('Execution number')"
                :required="true"
                id="executionNumber"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.executionNumber.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.executionNumber.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.executionNumber.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.unitId"
                :options="unitsOptions"
                :key="state.unitId"
                label="name"
                track-by="value"
                :textLabel="$t('Unit')"
                :required="true"
                :class="{ 'is-invalid': v$.unitId.$error }"
              />
            </div>
            <div v-if="v$.unitId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.unitId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.recurringPayment"
                :options="recurringPaymentOptions"
                :key="state.recurringPayment"
                label="name"
                track-by="value"
                :textLabel="$t('Recurring Payment')"
                :required="true"
                :class="{ 'is-invalid': v$.recurringPayment.$error }"
              />
            </div>
            <div v-if="v$.recurringPayment.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.recurringPayment.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.paymentPeriodId"
                :options="paymentPeriodOptions"
                :key="state.paymentPeriodId"
                label="name"
                track-by="value"
                :textLabel="$t('Payment Period')"
                :required="true"
                :class="{ 'is-invalid': v$.paymentPeriodId.$error }"
              />
            </div>
            <div v-if="v$.paymentPeriodId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.paymentPeriodId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`euroIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.listingPrice"
                  :label="$t('Listing Price')"
                  :required="true"
                  id="listingPrice"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.listingPrice.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.listingPrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.listingPrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`percentageIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.manufacturerDiscount"
                  :label="$t('Manufacturer Discount')"
                  :required="true"
                  id="manufacturerDiscount"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.manufacturerDiscount.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.manufacturerDiscount.$error" class="invalid-feedback">
              <span
                class="text-danger"
                v-if="v$.manufacturerDiscount.required"
                >{{ $t("This value is required") }}</span
              >
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`euroIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.salePrice"
                  :label="$t('Sale Price')"
                  :required="true"
                  id="salePrice"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.salePrice.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.salePrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.salePrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`euroIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.profit"
                  :label="$t('Profit')"
                  :required="true"
                  id="profit"
                  :disabled="state.submitted"
                  :class="{ 'is-invalid': v$.profit.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.profit.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.profit.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'cloud'">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`euroIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.maintenancePrice"
                  :label="$t('Software maintainance price')"
                  :required="true"
                  id="maintenancePrice"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.maintenancePrice.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.maintenancePrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.maintenancePrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6" v-if="product.productType !== 'cloud'">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text"
                    ><elements-icon v-bind:icon="`euroIcon`"
                  /></span>
                </div>
                <elements-input
                  v-model="state.maintenanceRate"
                  :label="$t('Software maintainance rate (%)')"
                  :required="true"
                  id="maintenanceRate"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.maintenanceRate.$error }"
                  type="number"
                />
              </div>
            </div>
            <div v-if="v$.maintenanceRate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.maintenanceRate.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="product.productType === 'hosting'" class="row">
          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.paymentPeriodId"
                :options="paymentPeriodOptions"
                :key="state.paymentPeriodId"
                label="name"
                track-by="value"
                :textLabel="$t('Payment Period')"
                :required="true"
                :class="{ 'is-invalid': v$.paymentPeriodId.$error }"
              />
            </div>
            <div v-if="v$.paymentPeriodId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.paymentPeriodId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.pricePerPeriod"
                :label="$t('Price Per Period')"
                id="pricePerPeriod"
                :disabled="isLoading"
                type="number"
              />
            </div>
          </div>
        </div>

        <div
          v-else-if="
            product.productType === 'service' ||
            product.productType === 'pauschal'
          "
          class="row"
        >
          <div class="col-md-6" v-if="product.productType === 'service'">
            <div class="form-group">
              <elements-input
                v-model="state.hourlyRate"
                :label="$t('Hourly Rate')"
                :required="true"
                id="hourlyRate"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.hourlyRate.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.hourlyRate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.hourlyRate.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.quantity"
                :label="$t('Quantity')"
                :required="true"
                id="quantity"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.quantity.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.quantity.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.quantity.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <elements-multiselect
                v-model="state.unitId"
                :options="unitsOptions"
                :key="state.unitId"
                label="name"
                track-by="value"
                :textLabel="$t('Unit')"
                :required="true"
                :class="{ 'is-invalid': v$.unitId.$error }"
              />
            </div>
            <div v-if="v$.unitId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.unitId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.salePrice"
                :label="$t('Sale Price')"
                :required="true"
                id="salePrice"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.salePrice.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.salePrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.salePrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>

          <div class="col-md-6" v-if="product.productType === 'service'">
            <div class="form-group">
              <elements-input
                v-model="state.dailyRate"
                :label="$t('Daily Rate')"
                :required="true"
                id="dailyRate"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.dailyRate.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.dailyRate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.dailyRate.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>

        <div v-else-if="product.productType === 'ams'" class="row">
          <div
            class="row"
          >
            <div class="col-6">
              <label class="me-2" for="contingent">{{ $t("Contingent") }}</label>
              <input
                class="mt-1"
                name="contingent"
                id="contingent"
                type="radio"
                value="contingent"
                v-model="state.amsType"
              />
            </div>
            <div class="col-6">
              <label class="me-2" for="fix_price">{{ $t("Fix Price") }}</label>
              <input
                class="mt-1"
                name="fix_price"
                id="fix_price"
                type="radio"
                value="fix_price"
                v-model="state.amsType"
              />
            </div>
          </div>

          <div
            v-if="state.amsType === `contingent`"
            class="row"
          >
            <div class="col-md-6">
              <div class="form-group">
                <elements-input
                  v-model="state.hourlyRate"
                  :label="$t('Hourly Rate')"
                  :required="true"
                  id="hourlyRate"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.hourlyRate.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.hourlyRate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.hourlyRate.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <elements-input
                  v-model="state.dailyRate"
                  :label="$t('Daily Rate')"
                  :required="true"
                  id="dailyRate"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.dailyRate.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.dailyRate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.dailyRate.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.unitId"
                  :options="unitsOptions"
                  :key="state.unitId"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Unit')"
                  :required="true"
                  :class="{ 'is-invalid': v$.unitId.$error }"
                />
              </div>
              <div v-if="v$.unitId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.unitId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.paymentPeriodId"
                  :options="paymentPeriodOptions"
                  :key="state.paymentPeriodId"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Payment Period')"
                  :required="true"
                  :class="{ 'is-invalid': v$.paymentPeriodId.$error }"
                />
              </div>
              <div v-if="v$.paymentPeriodId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.paymentPeriodId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="state.amsType === `fix_price`"
            class="row"
          >
            <div class="col-md-6">
              <div class="form-group">
                <elements-input
                  v-model="state.fixedPrice"
                  :label="$t('Fixed Price')"
                  :required="true"
                  id="fixedPrice"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': v$.fixedPrice.$error }"
                  type="number"
                />
              </div>
              <div v-if="v$.fixedPrice.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.fixedPrice.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <elements-multiselect
                  v-model="state.unitId"
                  :options="unitsOptions"
                  :key="state.unitId"
                  label="name"
                  track-by="value"
                  :textLabel="$t('Unit')"
                  :required="true"
                  :class="{ 'is-invalid': v$.unitId.$error }"
                />
              </div>
              <div v-if="v$.unitId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.unitId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>

          <!-- <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.serviceHours"
                :label="$t('Service Hours')"
                :required="true"
                id="serviceHours"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.serviceHours.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.serviceHours.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.serviceHours.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div> -->

          <!-- <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.serviceDays"
                :label="$t('Service Days')"
                :required="true"
                id="serviceDays"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.serviceDays.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.serviceDays.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.serviceDays.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div> -->

          <!-- <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.salePrice"
                :label="$t('Sale Price')"
                :required="true"
                id="salePrice"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.salePrice.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.salePrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.salePrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div> -->
        </div>

        <div v-else-if="product.productType === 'traveling'">
          <div class="col-md-6">
            <div class="form-group">
              <elements-input
                v-model="state.salePrice"
                :label="$t('Sale Price')"
                :required="true"
                id="salePrice"
                :disabled="isLoading"
                :class="{ 'is-invalid': v$.salePrice.$error }"
                type="number"
              />
            </div>
            <div v-if="v$.salePrice.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.salePrice.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-4" v-if="product.productType !== 'traveling'">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("License Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6" >
            <div class="form-group">
              <elements-multiselect
                v-model="state.ruleIds"
                :options="rulesOptions"
                :key="state.ruleIds"
                :multiple="true"
                label="name"
                track-by="value"
                :textLabel="$t('Rules')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-end mt-3">
      <button class="primary-btn me-3"  @click="navigateTo('/products')">
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="saveProductDetailHandler"
        :isLoading="isLoading"
        :iconName="'saveIcon'"
        :buttonName="
          product.productType === ProductTypeEnum.AMS
            ? $t('Save and Proceed')
            : $t('Save and Proceed')
        "
      />
    </div>
  </div>
</template>

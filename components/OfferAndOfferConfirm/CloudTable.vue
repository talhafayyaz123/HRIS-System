<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
const { t } = useI18n();
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

const props = defineProps([
  "cloudTableData",
  "optionalCloudTableData",
  "cloudSummery",
  "optionalProductType"
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "updatePeriodOfAllProducts",
  "calculateProductValue",
]);
const groupToggler = ref({
  cloud: {},
});
const optionalProduct = reactive({
  cloud: props.optionalProductType?.includes("cloud") ? true : false,
});
const paymentPeriodOptions = ref([]);
const cloudGlobalPaymentPeriod = ref("");

watch(
  () => cloudGlobalPaymentPeriod.value,
  (cloudGlobalPeriod) => {
    emits("updatePeriodOfAllProducts", cloudGlobalPeriod, "cloud");
  }
);
onMounted(async function () {
  try {
    const paymentPeriodRes = await genericListingRequest(
      routes.PRODUCT_PAYMENT_PERIOD,
      {
        all: true,
      }
    );
    paymentPeriodOptions.value = paymentPeriodRes?.data?.map((pp: any) => {
      return { value: pp.id, name: pp.name };
    });
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <div class="mt-3">
    <div class="page-header">
      <div class="page-title">
        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item">
              <span>{{ $t("Cloud") }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="other-items d-flex justify-center">
        <div class="right-side">
          <div class="form-group m-0 me-2">
            <elements-multiselect :style="{ width: '220px' }" v-model="cloudGlobalPaymentPeriod"
              :options="paymentPeriodOptions" label="name" track-by="value" placeholder="Payment Period"
              :textLabel="$t('')" />
          </div>
          <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'cloud' })">
            <elements-icon v-bind:icon="'addIcon'" class="me-2" />
            {{ $t("Add Product") }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="doc-table table">
        <thead>
          <tr>
            <th></th>
            <th>{{ $t("POS") }}</th>
            <th>{{ $t("ARTICLE NR.") }}</th>
            <th>{{ $t("NAME") }}</th>
            <th>{{ $t("SOFTWARE") }}</th>
            <th>{{ $t("QUANTITY") }}</th>
            <th>{{ $t("DURATION") }}</th>
            <th>{{ $t("PRODUCT PRICE") }}</th>
            <th>{{ $t("DISCOUNT") }}</th>
            <th>{{ $t("PERIOD") }}</th>
            <th>{{ $t("NETTO TOTAL") }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-for="(cloud, index) in cloudTableData" :key="index">
          <tr>
            <td>
              <input type="checkbox" :id="groupToggler['cloud'][cloud.productId]"
                :value="groupToggler['cloud'][cloud.productId]" v-model="groupToggler['cloud'][cloud.productId]" />
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ cloud?.articleNumber }}</td>
            <td>
              <div>
                {{ cloud?.name }}
                <div>
                  <button @click="
                    $emit('additiontalDescToggle', {
                      index,
                      componentType: `cloud`,
                    })
                    ">
                    {{
                      cloud.descriptionToggle
                      ? `Remove Additional Description`
                      : `Add Additional Description`
                    }}
                  </button>
                  <div v-if="cloud.descriptionToggle">
                    <div class="form-group textarea">
                      <textarea v-model="cloud.additionDescription" class="form-control" placeholder="."></textarea>
                      <label for="" class="input-label">Additional Description</label>
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td>
              {{ cloud?.productSoftware }}
            </td>

            <td>
              <elements-input v-model="cloud.quantity" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'cloud',
                  'quantity'
                )
                " type="number" />
            </td>

            <td>
              <elements-input v-model="cloud.duration" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'cloud',
                  'duration'
                )
                " type="number" />
            </td>

            <td>
              <elements-input v-model="cloud.salePrice" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'cloud',
                  'salePrice'
                )
                " type="number" />
            </td>
            <td>
              <elements-input v-model="cloud.discount" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'cloud',
                  'discount'
                )
                " type="number" />
            </td>

            <td>
              <div :style="{ width: '160px' }">
                <elements-multiselect v-model="cloud.paymentPeriodId" :key="cloud.paymentPeriodId"
                  :options="paymentPeriodOptions" label="name" track-by="value" />
              </div>
            </td>

            <td>
              <elements-input v-model="cloud.totalNetto" type="number" />
            </td>

            <td>
              <i class="mdi mdi-delete edit-icon" @click="() => {
                cloudTableData.splice(index, 1);
              }
                "></i>
            </td>
          </tr>
          <tr v-if="groupToggler['cloud'][cloud.productId] || cloud.childComponents.length > 0">
            <th></th>
            <th>{{ $t("POS") }}</th>
            <th>{{ $t("ARTICLE NR.") }}</th>
            <th>{{ $t("NAME") }}</th>
            <th>{{ $t("SOFTWARE") }}</th>
            <th>{{ $t("QUANTITY") }}</th>
            <th>{{ $t("DURATION") }}</th>
            <th>{{ $t("PRODUCT PRICE") }}</th>
            <th>{{ $t("TOTAL PRICE PERIOD") }}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>

          <tr v-for="(child, childIndex) in cloud.childComponents" :key="childIndex">
            <td></td>
            <td>{{ index + 1 }}.{{ childIndex + 1 }}</td>
            <td>
              {{ child?.articleNumber }}
            </td>
            <td>
              {{ child?.name }}
            </td>
            <td>
              {{ child?.productSoftware }}
            </td>
            <td>
              <div class="d-flex">
                <elements-input v-model="child.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'childCloud',
                    'quantity',
                    childIndex
                  )
                  " type="number" />
              </div>
            </td>
            <td>
              <elements-input v-model="child.duration" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'childCloud',
                  'duration',
                  childIndex
                )
                " type="number" />
            </td>
            <td>
              <elements-input v-model="child.salePrice" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'childCloud',
                  'salePrice',
                  childIndex
                )
                " type="number" />
            </td>
            <td>
              <elements-input v-model="child.totalRate" type="number" disabled />
            </td>

            <td>
              <i class="mdi mdi-delete edit-icon" @click="() => {
                cloudTableData[index].childComponents.splice(
                  childIndex,
                  1
                );
              }
                "></i>
            </td>
            <td></td>
            <td></td>
          </tr>

          <tr v-if="groupToggler['cloud'][cloud.productId]">
            <td></td>
            <td></td>
            <td>
              <button @click="
                $emit('addProduct', {
                  componentType: 'childCloud',
                  parentIndex: index,
                })
                ">
                {{ $t("Add Child Product") }}
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="cloudTableData?.length > 0" class="d-flex align-items-start justify-content-end">
      <div class="offer-table-totals">
        <ul>
          <li class="d-flex">
            <h3>{{ $t("Netto") }}:</h3>
            <p>{{ cloudSummery.netto }}</p>
          </li>
          <li v-for="(tax, index) in cloudSummery.tax" :key="index" class="d-flex">
            <h3>{{ Number(tax) }}% {{ $t("Tax") }} :</h3>
            <p>
              {{
                (
                  Math.round((tax / 100) * cloudSummery.netto * 100) / 100
                ).toFixed(2)
              }}
            </p>
          </li>
          <li class="total">
            <h3>{{ $t("Total") }}:</h3>
            <p>
              {{ cloudSummery.total }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-group checkbox-group">
      <input class="checkbox-input" id="optionalCloud" type="checkbox" v-model="optionalProduct.cloud" />
      <label class="checkbox-label" for="optionalCloud">{{ $t("Optional Products") }}</label>
    </div>
    <div class="mt-3" v-if="optionalProduct.cloud">
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <span>{{ $t("Optional Products") }}</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="other-items d-flex justify-center">
          <div class="right-side">
            <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'cloudOptional' })">
              <elements-icon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Add Product") }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="doc-table table">
          <thead>
            <tr class="">
              <th>{{ $t("POS") }}</th>
              <th>{{ $t("ARTICLE NR.") }}</th>
              <th>{{ $t("NAME") }}</th>
              <th>{{ $t("SOFTWARE") }}</th>
              <th>{{ $t("QUANTITY") }}</th>
              <th>{{ $t("DURATION") }}</th>
              <th>{{ $t("PRODUCT PRICE") }}</th>
              <th>{{ $t("DISCOUNT") }}</th>
              <th>{{ $t("PERIOD") }}</th>
              <th>{{ $t("NETTO TOTAL") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cloud, index) in optionalCloudTableData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ cloud?.articleNumber }}</td>
              <td>{{ cloud?.name }}</td>

              <td>
                {{ cloud?.productSoftware }}
              </td>

              <td>
                <elements-input v-model="cloud.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'cloudOptional',
                    'quantity'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="cloud.duration" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'cloudOptional',
                    'duration'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="cloud.salePrice" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'cloudOptional',
                    'salePrice'
                  )
                  " type="number" />
              </td>
              <td>
                <elements-input v-model="cloud.discount" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'cloudOptional',
                    'discount'
                  )
                  " type="number" />
              </td>

              <td>
                <div :style="{ width: '160px' }">
                  <elements-multiselect v-model="cloud.paymentPeriodId" :key="cloud.paymentPeriodId"
                    :options="paymentPeriodOptions" label="name" track-by="value" />
                </div>
              </td>

              <td>
                <elements-input v-model="cloud.totalNetto" type="number" />
              </td>

              <td>
                <i class="mdi mdi-delete edit-icon" @click="() => {
                  optionalCloudTableData.splice(index, 1);
                }
                  "></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

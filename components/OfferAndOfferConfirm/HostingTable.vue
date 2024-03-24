<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
const { t } = useI18n();
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

const props = defineProps([
  "hostingTableData",
  "optionalHostingTableData",
  "hostingSummery",
  "optionalProductType"
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "updatePeriodOfAllProducts",
  "calculateProductValue",
]);
const groupToggler = ref({
  hosting: {},
});
const optionalProduct = reactive({
  hosting: props.optionalProductType?.includes("hosting") ? true : false,
});
const paymentPeriodOptions = ref([]);
const hostingGlobalPaymentPeriod = ref("");

watch(
  () => hostingGlobalPaymentPeriod.value,
  (hostingGlobalPeriod) => {
    emits("updatePeriodOfAllProducts", hostingGlobalPeriod, "hosting");
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
              <span>{{ $t("Hosting") }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="other-items d-flex justify-center">
        <div class="right-side">
          <div class="form-group m-0 me-2">
            <elements-multiselect :style="{ width: '220px' }" v-model="hostingGlobalPaymentPeriod"
              :options="paymentPeriodOptions" label="name" track-by="value" placeholder="Payment Period"
              :textLabel="$t('')" />
          </div>
          <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'hosting' })">
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
            <th>{{ $t("PRICE PER PERIOD") }}</th>
            <th>{{ $t("DISCOUNT(%)") }}</th>
            <th>{{ $t("PERIOD") }}</th>
            <th>{{ $t("NETTO TOTAL(%)") }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-for="(hosting, index) in hostingTableData" :key="index">
          <tr>
            <td>
              <input type="checkbox" :id="groupToggler['hosting'][hosting?.productId]"
                :value="groupToggler['hosting'][hosting?.productId]"
                v-model="groupToggler['hosting'][hosting?.productId]" />
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ hosting?.articleNumber }}</td>
            <td>
              <div>
                {{ hosting?.name }}
                
              </div>
            </td>

            <td>
              {{ hosting?.productSoftware }}
            </td>

            <td>
              <elements-input v-model="hosting.quantity" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'hosting',
                  'quantity'
                )
                " type="number" />
            </td>

            <td>
              <elements-input v-model="hosting.pricePerPeriod" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'hosting',
                  'pricePerPeriod'
                )
                " type="number" />
            </td>
            <td>
              <elements-input v-model="hosting.discount" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'hosting',
                  'discount'
                )
                " type="number" />
            </td>

            <td>
              <div :style="{ width: '160px' }">
                <elements-multiselect v-model="hosting.paymentPeriodId" :key="hosting.paymentPeriodId"
                  :options="paymentPeriodOptions" label="name" track-by="value" />
              </div>
            </td>

            <td>
              <elements-input v-model="hosting.totalNetto" type="number" />
            </td>

            <td>
              <i class="mdi mdi-delete edit-icon" @click="() => {
                hostingTableData.splice(index, 1);
              }
                "></i>
            </td>
          </tr>
          <tr>
            <td colspan="10">
              <div>
                  <div class="px-5 py-1">
                    <button  class="add-addition-btn" @click="
                    $emit('additiontalDescToggle', {
                      index,
                      componentType: `hosting`,
                    })
                    ">
                    <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                    {{
                      hosting.descriptionToggle
                      ? `Remove Additional Description`
                      : `Add Additional Description`
                    }}
                  </button>
                  </div>
                  <div v-if="hosting.descriptionToggle">
                    <div class="form-group textarea">
                      <textarea v-model="hosting.additionDescription" class="form-control" placeholder="."></textarea>
                      <label for="" class="input-label">Additional Description</label>
                    </div>
                  </div>
                </div>
            </td>
          </tr>
          <tr v-if="groupToggler['hosting'][hosting.productId] || hosting.childComponents.length > 0">
            <th></th>
            <th>{{ $t("POS") }}</th>
            <th>{{ $t("ARTICLE NR.") }}</th>
            <th>{{ $t("NAME") }}</th>
            <th>{{ $t("SOFTWARE") }}</th>
            <th>{{ $t("QUANTITY") }}</th>
            <th>{{ $t("SINGLE PRICE PER PERIOD RATE") }}</th>
            <th>{{ $t("TOTAL PRICE PERIOD") }}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>

          <tr v-for="(child, childIndex) in hosting.childComponents" :key="childIndex">
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
                    'childHosting',
                    'quantity',
                    childIndex
                  )
                  " type="number" />
              </div>
            </td>
            <td>
              <elements-input v-model="child.pricePerPeriod" @input="
                $emit(
                  'calculateProductValue',
                  $event,
                  index,
                  'childHosting',
                  'pricePerPeriod',
                  childIndex
                )
                " type="number" />
            </td>
            <td>
              <elements-input v-model="child.totalRate" disabled type="number" />
            </td>

            <td>
              <i class="mdi mdi-delete edit-icon" @click="() => {
                hostingTableData[index].childComponents.splice(
                  childIndex,
                  1
                );
              }
                "></i>
            </td>
            <td></td>
            <td></td>
          </tr>

          <tr v-if="groupToggler['hosting'][hosting.productId]">
            <td></td>
            <td></td>
            <td>
              <button @click="
                $emit('addProduct', {
                  componentType: 'childHosting',
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
    <div v-if="hostingTableData?.length > 0" class="d-flex align-items-start justify-content-end">
      <div class="offer-table-totals">
        <ul>
          <li class="d-flex">
            <h3>{{ $t("Netto") }}:</h3>
            <p>{{ hostingSummery.netto }}</p>
          </li>
          <li v-for="(tax, index) in hostingSummery.tax" :key="index" class="d-flex">
            <h3>{{ Number(tax) }}% {{ $t("Tax") }} :</h3>
            <p>
              {{
                (
                  Math.round((tax / 100) * hostingSummery.netto * 100) / 100
                ).toFixed(2)
              }}
            </p>
          </li>
          <li class="total">
            <h3>{{ $t("Total") }}:</h3>
            <p>
              {{ hostingSummery.total }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-group checkbox-group">
      <input class="checkbox-input" id="optionalHosting" type="checkbox" v-model="optionalProduct.hosting" />
      <label class="checkbox-label" for="optionalHosting">{{ $t("Optional Products") }}</label>
    </div>
    <div class="mt-3" v-if="optionalProduct.hosting">
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
            <NuxtLink class="primary-btn cursor-pointer"
              @click="$emit('addProduct', { componentType: 'hostingOptional' })">
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
              <th>{{ $t("PRICE PER PERIOD") }}</th>
              <th>{{ $t("DISCOUNT(%)") }}</th>
              <th>{{ $t("PERIOD") }}</th>
              <th>{{ $t("NETTO TOTAL(%)") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(hosting, index) in optionalHostingTableData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ hosting?.articleNumber }}</td>
              <td>
                {{ hosting?.name }}
              </td>

              <td>
                {{ hosting?.productSoftware }}
              </td>

              <td>
                <elements-input v-model="hosting.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'hostingOptional',
                    'quantity'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="hosting.pricePerPeriod" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'hostingOptional',
                    'pricePerPeriod'
                  )
                  " type="number" />
              </td>
              <td>
                <elements-input v-model="hosting.discount" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'hostingOptional',
                    'discount'
                  )
                  " type="number" />
              </td>

              <td>
                <div :style="{ width: '160px' }">
                  <elements-multiselect v-model="hosting.paymentPeriodId" :key="hosting.paymentPeriodId"
                    :options="paymentPeriodOptions" label="name" track-by="value" />
                </div>
              </td>

              <td>
                <elements-input v-model="hosting.totalNetto" type="number" />
              </td>

              <td>
                <i class="mdi mdi-delete edit-icon" @click="() => {
                  optionalHostingTableData.splice(index, 1);
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

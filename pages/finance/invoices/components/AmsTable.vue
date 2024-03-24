<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { routes } from "~/utils/apiRoutes";
import {
  genericListingRequest
} from "~/utils/apiRequests";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "amsTableData",
  "optionalAmsTableData",
  "amsSummery",
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "changeGlobalPeriodState",
  "updatePeriodOfAllProducts",
  "calculateProductValue",
]);

const optionalProduct = reactive({
  ams: false,
});
const paymentPeriodOptions = ref([]);
const amsGlobalPaymentPeriod = ref("");

watch(
  () => amsGlobalPaymentPeriod.value,
  (amsGlobalPeriod) => {
    emits("updatePeriodOfAllProducts", amsGlobalPeriod, "ams");
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

// helper function, converts the days array to string separated by commas
function daysString(days: any) {
  return days?.map((day: any) => day).join(", ") ?? "";
}
</script>

<template>
  <div>
    <div class="mt-3">
      <div class="mb-2 d-flex align-items-center justify-content-end">
        <button class="secondary-btn" @click="$emit('addProduct', { componentType: 'ams' })">
          <elements-icon v-bind:icon="'addIcon'" class="me-2" />
          {{ $t("Add Product") }}
        </button>
      </div>
      <div class="table-responsive border-bottom">
        <table class="doc-table table">
          <thead>
            <tr class="">
              <th class="">{{ $t("POS") }}</th>
              <th class="">{{ $t("Article Number") }}</th>
              <th class="">{{ $t("NAME") }}</th>
              <th class="">{{ $t("SOFTWARE") }}</th>
              <th class="">{{ $t("Quantity/UNIT") }}</th>
              <th class="">{{ $t("HOURLY RATE") }}</th>
              <th class="">{{ $t("Discount(%)") }}</th>
              <th class="">{{ $t("PERIOD") }}</th>
              <th class="">{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody  v-for="(ams, index) in amsTableData" :key="index">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ ams?.articleNumber }}</td>
              <td>
                <div>
                  {{ ams?.name }}
                </div>
              </td>

              <td>
                {{ ams?.productSoftware }}
              </td>

              <td>
                <div class="d-flex" :style="{ width: '120px' }">
                  <elements-input v-model="ams.quantity" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'ams',
                      'quantity'
                    )
                    " type="number" />
                  {{ ams?.productUnit?.name }}
                </div>
              </td>

              <td>
                <elements-input v-model="ams.hourlyRate" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'ams',
                    'hourlyRate'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="ams.discount" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'ams',
                    'discount'
                  )
                  " type="number" />
              </td>
              <td>
                <div :style="{ width: '160px' }">
                  <elements-multiselect v-model="ams.paymentPeriodId" :key="ams.paymentPeriodId"
                    :options="paymentPeriodOptions" label="name" track-by="value" />
                </div>
              </td>
              <td>
                <elements-input v-model="ams.totalNetto" type="number" />
              </td>
              <td>
                <i class="mdi mdi-delete edit-icon" @click="() => {
                  amsTableData.splice(index, 1);
                }
                  "></i>
              </td>
            </tr>
            <tr>
              <td colspan="10">
                <div>
                    <div class="px-5 py-1">
                      <button class="add-addition-btn" @click="
                      $emit('additiontalDescToggle', {
                        index,
                        componentType: `ams`,
                      })
                      ">
                      <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                      {{
                        ams.descriptionToggle
                        ? $t('Remove Additional Description')
                        : $t('Add Additional Description')
                      }}
                    </button>
                    </div>
                    <div v-if="ams.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea v-model="ams.additionDescription" class="form-control" placeholder="."></textarea>
                        <label for="" class="input-label">{{ $t('Additional Description') }}</label>
                      </div>
                    </div>
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="amsTableData?.length > 0" class="d-flex flex-column align-items-end">
        <div class="offer-table-totals">
          <ul>
            <li class="d-flex">
              <p>{{ $t("Netto") }}:</p>
              <p>{{ amsSummery.netto }}</p>
            </li>
            <li v-for="(tax, index) in amsSummery.tax" :key="index" class="d-flex">
              <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
              <p>
                {{
                  (
                    Math.round((tax / 100) * amsSummery.netto * 100) / 100
                  ).toFixed(2)
                }}
              </p>
            </li>
            <li class="d-flex total">
              <p>{{ $t("Total") }}:</p>
              <p>
                {{ amsSummery.total }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
const { t } = useI18n();
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

const props = defineProps([
  "hostingTableData",
  "hostingSummery",
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
  hosting: false,
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
  <div>
    <div class="card mt-3">
      <div>
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <h3 class="card-title">{{ $t("Hosting") }}</h3>
          <button
            class="secondary-btn"
            @click="$emit('addProduct', { componentType: 'hosting' })"
          >
            {{ $t("Add Product") }}
          </button>
        </div>
        <div class="card-body">
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
                    <input
                      type="checkbox"
                      :id="groupToggler['hosting'][hosting.productId]"
                      :value="groupToggler['hosting'][hosting.productId]"
                      v-model="groupToggler['hosting'][hosting.productId]"
                    />
                  </td>
                  <td>{{ index + 1 }}</td>
                  <td>{{ hosting?.articleNumber }}</td>
                  <td>
                    <div>
                      {{ hosting?.name }}
                      <div>
                        <button
                          @click="
                            $emit('additiontalDescToggle', {
                              index,
                              componentType: `hosting`,
                            })
                          "
                        >
                          {{
                            hosting.descriptionToggle
                              ? `Remove Additional Description`
                              : `Add Additional Description`
                          }}
                        </button>
                        <div v-if="hosting.descriptionToggle">
                          <div class="form-group textarea">
                            <textarea
                              v-model="hosting.additionDescription"
                              class="form-control"
                              placeholder="."
                            ></textarea>
                            <label for="" class="input-label"
                              >Additional Description</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ hosting?.productSoftware?.name }}
                  </td>

                  <td>
                    <elements-input
                      v-model="hosting.quantity"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'hosting',
                          'quantity'
                        )
                      "
                      type="number"
                    />
                  </td>

                  <td>
                    <elements-input
                      v-model="hosting.pricePerPeriod"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'hosting',
                          'pricePerPeriod'
                        )
                      "
                      type="number"
                    />
                  </td>
                  <td>
                    <elements-input
                      v-model="hosting.discount"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'hosting',
                          'discount'
                        )
                      "
                      type="number"
                    />
                  </td>

                  <td>
                    <div :style="{ width: '160px' }">
                      <elements-multiselect
                        v-model="hosting.paymentPeriodId"
                        :key="hosting.paymentPeriodId"
                        :options="paymentPeriodOptions"
                        label="name"
                        track-by="value"
                      />
                    </div>
                  </td>

                  <td>
                    <elements-input
                      v-model="hosting.totalNetto"
                      type="number"
                      readonly
                    />
                  </td>

                  <td>
                    <i
                      class="mdi mdi-delete edit-icon"
                      @click="
                        () => {
                          hostingTableData.splice(index, 1);
                        }
                      "
                    ></i>
                  </td>
                </tr>
                <tr v-if="groupToggler['hosting'][hosting.productId]">
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

                <tr
                  v-for="(child, childIndex) in hosting.childComponents"
                  :key="childIndex"
                >
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
                      <elements-input
                        v-model="child.quantity"
                        @input="
                          $emit(
                            'calculateProductValue',
                            $event,
                            index,
                            'childHosting',
                            'quantity',
                            childIndex
                          )
                        "
                        type="number"
                      />
                    </div>
                  </td>
                  <td>
                    <elements-input
                      v-model="child.pricePerPeriod"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'childHosting',
                          'pricePerPeriod',
                          childIndex
                        )
                      "
                      type="number"
                    />
                  </td>
                  <td>
                    <elements-input
                      v-model="child.totalRate"
                      disabled
                      type="number"
                    />
                  </td>

                  <td>
                    <i
                      class="mdi mdi-delete edit-icon"
                      @click="
                        () => {
                          hostingTableData[index].childComponents.splice(
                            childIndex,
                            1
                          );
                        }
                      "
                    ></i>
                  </td>
                  <td></td>
                  <td></td>
                </tr>

                <tr v-if="groupToggler['hosting'][hosting.productId]">
                  <td></td>
                  <td></td>
                  <td>
                    <button
                      @click="
                        $emit('addProduct', {
                          componentType: 'childHosting',
                          parentIndex: index,
                        })
                      "
                    >
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
          <div v-if="hostingTableData?.length > 0">
            <div class="d-flex flex-column align-items-end">
              <div class="d-flex">
                <p>{{ $t("Netto") }}:</p>
                <p>{{ hostingSummery.netto }}</p>
              </div>
              <div
                v-for="(tax, index) in hostingSummery.tax"
                :key="index"
                class="d-flex"
              >
                <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
                <p>
                  {{
                    (
                      Math.round((tax / 100) * hostingSummery.netto * 100) / 100
                    ).toFixed(2)
                  }}
                </p>
              </div>
              <div class="d-flex">
                <p>{{ $t("Total") }}:</p>
                <p>
                  {{ hostingSummery.total }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

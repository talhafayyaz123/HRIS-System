<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
const { t } = useI18n();
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

const props = defineProps([
  "cloudTableData",
  "cloudSummery",
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
  cloud: false,
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
  <div>
    <div class="card mt-3">
      <div>
        <div
          class="card-header d-flex align-items-center justify-content-between"
        >
          <h3 class="card-title">{{ $t("Cloud") }}</h3>
          <button
            class="secondary-btn"
            @click="$emit('addProduct', { componentType: 'cloud' })"
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
                    <input
                      type="checkbox"
                      :id="groupToggler['cloud'][cloud.productId]"
                      :value="groupToggler['cloud'][cloud.productId]"
                      v-model="groupToggler['cloud'][cloud.productId]"
                    />
                  </td>
                  <td>{{ index + 1 }}</td>
                  <td>{{ cloud?.articleNumber }}</td>
                  <td>
                    <div>
                      {{ cloud?.name }}
                      <div>
                        <button
                          @click="
                            $emit('additiontalDescToggle', {
                              index,
                              componentType: `cloud`,
                            })
                          "
                        >
                          {{
                            cloud.descriptionToggle
                              ? $t('Remove Additional Description')
                              : $t('Add Additional Description')
                          }}
                        </button>
                        <div v-if="cloud.descriptionToggle">
                          <div class="form-group textarea">
                            <textarea
                              v-model="cloud.additionDescription"
                              class="form-control"
                              placeholder="."
                            ></textarea>
                            <label for="" class="input-label"
                              >{{ $t('Additional Description') }}</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {{ cloud?.productSoftware?.name }}
                  </td>

                  <td>
                    <elements-input
                      v-model="cloud.quantity"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'cloud',
                          'quantity'
                        )
                      "
                      type="number"
                    />
                  </td>

                  <td>
                    <elements-input
                      v-model="cloud.duration"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'cloud',
                          'duration'
                        )
                      "
                      type="number"
                    />
                  </td>

                  <td>
                    <elements-input
                      v-model="cloud.salePrice"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'cloud',
                          'salePrice'
                        )
                      "
                      type="number"
                    />
                  </td>
                  <td>
                    <elements-input
                      v-model="cloud.discount"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'cloud',
                          'discount'
                        )
                      "
                      type="number"
                    />
                  </td>

                  <td>
                    <div :style="{ width: '160px' }">
                      <elements-multiselect
                        v-model="cloud.paymentPeriodId"
                        :key="cloud.paymentPeriodId"
                        :options="paymentPeriodOptions"
                        label="name"
                        track-by="value"
                      />
                    </div>
                  </td>

                  <td>
                    <elements-input v-model="cloud.totalNetto" type="number" />
                  </td>

                  <td>
                    <i
                      class="mdi mdi-delete edit-icon"
                      @click="
                        () => {
                          cloudTableData.splice(index, 1);
                        }
                      "
                    ></i>
                  </td>
                </tr>
                <tr v-if="groupToggler['cloud'][cloud.productId]">
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

                <tr
                  v-for="(child, childIndex) in cloud.childComponents"
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
                            'childCloud',
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
                      v-model="child.duration"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'childCloud',
                          'duration',
                          childIndex
                        )
                      "
                      type="number"
                    />
                  </td>
                  <td>
                    <elements-input
                      v-model="child.salePrice"
                      @input="
                        $emit(
                          'calculateProductValue',
                          $event,
                          index,
                          'childCloud',
                          'salePrice',
                          childIndex
                        )
                      "
                      type="number"
                    />
                  </td>
                  <td>
                    <elements-input
                      v-model="child.totalRate"
                      type="number"
                      disabled
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

                <tr v-if="groupToggler['cloud'][cloud.productId]">
                  <td></td>
                  <td></td>
                  <td>
                    <button
                      @click="
                        $emit('addProduct', {
                          componentType: 'childCloud',
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
          <div v-if="cloudTableData?.length > 0">
            <div class="d-flex flex-column align-items-end">
              <div class="d-flex">
                <p>{{ $t("Netto") }}:</p>
                <p>{{ cloudSummery.netto }}</p>
              </div>
              <div
                v-for="(tax, index) in cloudSummery.tax"
                :key="index"
                class="d-flex"
              >
                <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
                <p>
                  {{
                    (
                      Math.round((tax / 100) * cloudSummery.netto * 100) / 100
                    ).toFixed(2)
                  }}
                </p>
              </div>
              <div class="d-flex">
                <p>{{ $t("Total") }}:</p>
                <p>
                  {{ cloudSummery.total }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

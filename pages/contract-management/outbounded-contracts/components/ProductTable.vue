<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { formatter } from "~/utils/helperFunctions";
import { routes } from "~/utils/apiRoutes";
import { genericListingRequest } from "~/utils/apiRequests";

const { t } = useI18n();

const props = defineProps([
  "contractFieldsTableData",
  "softwareLicencesSummery",
  "attachmentIndex",
  "contractIndex",
]);
const emits = defineEmits(["additiontalDescToggle", "calculateProductValue"]);

const paymentPeriodOptions = ref([]);

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
  <div class="">
    <div class="mt-3">
      <div class="table-responsive">
        <table class="doc-table table">
          <thead>
            <tr>
              <th>{{ $t("Pos") }}</th>
              <th>{{ $t("Article Number") }}</th>
              <th>{{ $t("Name") }}</th>
              <th>{{ $t("Software") }}</th>
              <th>{{ $t("Quantity/Unit") }}</th>
              <th>{{ $t("Product Price") }}</th>
              <th>{{ $t("Hourly Rate") }}</th>
              <th>{{ $t("Price Per Period") }}</th>
              <th>{{ $t("Duration") }}</th>
              <th>{{ $t("Discount(%)") }}</th>
              <th>{{ $t("Tax") }}</th>
              <th>{{ $t("Tax Rate") }}</th>
              <th>{{ $t("Period") }}</th>
              <th>{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(field, index) in props.contractFieldsTableData"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ field?.articleNumber }}</td>
              <td>
                <div>
                  {{ field?.name }}
                  <div>
                    <button
                      @click="
                        $emit('additiontalDescToggle', {
                          index,
                          componentType: `licences`,
                        })
                      "
                    >
                      {{
                        field.descriptionToggle
                          ? `Remove Additional Description`
                          : `Add Additional Description`
                      }}
                    </button>
                    <div v-if="field.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea
                          v-model="field.additionDescription"
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
                <div v-if="['ams', 'hosting', 'cloud'].includes(field?.type)">
                  {{ field?.productSoftware?.name }}
                </div>
              </td>

              <td>
                <elements-input
                  v-model="field.quantity"
                  @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      attachmentIndex,
                      contractIndex,
                      index,
                      'quantity'
                    )
                  "
                  type="number"
                />
                <p>{{ field.productUnit.name }}</p>
              </td>
              <td>
                <div
                  v-if="
                    ['software', 'traveling', 'cloud', 'pauschal'].includes(
                      field.type
                    )
                  "
                >
                  <elements-input
                    v-model="field.salePrice"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'salePrice'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>

              <td>
                <div v-if="['ams', 'service'].includes(field.type)">
                  <elements-input
                    v-model="field.hourlyRate"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'hourlyRate'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>

              <td>
                <div v-if="['hosting'].includes(field.type)">
                  <elements-input
                    v-model="field.pricePerPeriod"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'pricePerPeriod'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>

              <td>
                <div v-if="field.type === 'cloud'">
                  <elements-input
                    v-model="field.duration"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'duration'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>

              <td>
                <elements-input
                  v-model="field.discount"
                  @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      attachmentIndex,
                      contractIndex,
                      index,
                      'discount'
                    )
                  "
                  type="number"
                />
              </td>

              <td>
                <div v-if="['service'].includes(field.type)">
                  <elements-input
                    v-model="field.tax"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'tax'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>
              <td>
                <div v-if="['service'].includes(field.type)">
                  <elements-input
                    v-model="field.taxRate"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        attachmentIndex,
                        contractIndex,
                        index,
                        'taxRate'
                      )
                    "
                    type="number"
                  />
                </div>
              </td>

              <td>
                <div
                  v-if="
                    ['ams', 'hosting', 'cloud'].includes(field.type)
                  "
                >
                  <div class="form-group" :style="{ width: '200px' }">
                    <elements-multiselect
                      v-model="field.paymentPeriodId"
                      placeholder="Payment Period"
                      :options="paymentPeriodOptions"
                      label="name"
                      track-by="value"
                      :textLabel="$t('')"
                    />
                  </div>
                </div>
              </td>

              <td>
                <elements-input v-model="field.totalNetto" type="number" />
              </td>

              <td>
                <i
                  class="mdi mdi-delete edit-icon"
                  @click="
                    () => {
                      props.contractFieldsTableData.splice(index, 1);
                    }
                  "
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div
        v-if="softwareLicencesTableData?.length > 0"
        class="d-flex align-items-start justify-content-end"
      >
        <div class="offer-table-totals">
          <ul>
            <li>
              <h3>{{ $t("Netto") }}</h3>
              <p>{{ softwareLicencesSummery.netto }}</p>
            </li>
            <li
              v-for="(tax, index) in softwareLicencesSummery.tax"
              :key="index"
            >
              <h3>{{ Number(tax) }}% {{ $t("Tax") }} :</h3>
              <p>
                {{
                  (
                    Math.round(
                      (tax / 100) * softwareLicencesSummery.netto * 100
                    ) / 100
                  ).toFixed(2)
                }}
              </p>
            </li>
            <li class="total">
              <h3>{{ $t("Total") }}:</h3>
              <p>
                {{ softwareLicencesSummery.total }}
              </p>
            </li>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

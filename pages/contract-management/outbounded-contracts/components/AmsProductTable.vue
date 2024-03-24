<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "attachmentFieldsTableData",
  "category",
  "softwareLicencesSummery",
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "calculateProductValue",
]);

const attachmentAmsProdByCategory = computed(() => {
  return props.attachmentFieldsTableData?.filter((attachField) => attachField.productCategoryId === props.category.id);
});

</script>

<template>
  <div>
    <div class="mt-3">
      <div class="table-responsive">
        <table class="doc-table table">
          <thead>
            <tr>
              <th>{{ $t("Pos") }}</th>
              <th>{{ $t("Article Number") }}</th>
              <th>{{ $t("Name") }}</th>
              <th>{{ $t("Software") }}</th>
              <th>{{ $t("Quantity") }}</th>
              <th>{{ $t("Hourly Rate") }}</th>
              <th>{{ $t("Discount(%)") }}</th>
              <th>{{ $t("Period") }}</th>
              <th>{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(field, index) in attachmentAmsProdByCategory"
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

              <td>{{ field.productSoftware }}</td>
              <td>
                <div class="flex align-items-center">
                  <elements-input
                    v-model="field.quantity"
                    @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'licences',
                        'quantity'
                      )
                    "
                    type="number"
                  />
                  <p>{{ field.productUnit }}</p>
                </div>
              </td>

              <td>
                <elements-input
                  v-model="field.hourlyRate"
                  @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'licences',
                      'salePrice'
                    )
                  "
                  type="number"
                />
              </td>

              <td>
                <elements-input
                  v-model="field.discount"
                  @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'licences',
                      'discount'
                    )
                  "
                  type="number"
                />
              </td>

              <td>
                <elements-input v-model="field.paymentPeriodId" type="number" />
              </td>

              <td>
                <elements-input v-model="field.totalNetto" type="number" />
              </td>
              <td>
                <i
                  class="mdi mdi-delete edit-icon"
                  @click="
                    () => {
                      props.attachmentFieldsTableData.splice(index, 1);
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

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "softwareLicencesTableData",
  "softwareLicencesSummery"
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "calculateProductValue",
]);

const optionalProduct = reactive({
  software: false,
});
</script>

<template>
  <div>
    <div class="mt-3">
      <div class="d-flex align-items-center justify-content-end mb-2">
        <button class="secondary-btn" @click="$emit('addProduct', { componentType: 'licences' })">
          <elements-icon v-bind:icon="'addIcon'" />
          {{ $t("Add Product") }}
        </button>
      </div>
      <div class="table-responsive border-bottom">
        <table class="doc-table table">
          <thead>
            <tr class="">
              <th class="">{{ $t("Article Number") }}</th>
              <th class="">{{ $t("Product Name") }}</th>
              <th class="">{{ $t("Quantity") }}</th>
              <th class="">{{ $t("Product Price") }}</th>
              <th class="">{{ $t("Discount(%)") }}</th>
              <th class="">{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="(
                    softwareLicense, index
                  ) in props.softwareLicencesTableData" :key="index">
            <tr>
              <td>{{ softwareLicense?.articleNumber }}</td>
              <td>
                <div>
                  {{ softwareLicense?.name }}


                </div>
              </td>

              <td>
                <elements-input v-model="softwareLicense.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'licences',
                    'quantity'
                  )
                  " type="number" />
              </td>

              <td>
                <div class="form-group m-0">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <ElementsIcon v-bind:icon="'euroIcon'" />
                      </span>
                    </div>
                    <elements-input v-model="softwareLicense.salePrice" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'licences',
                        'salePrice'
                      )
                      " type="number" />
                  </div>
                </div>
              </td>

              <td>
                <div class="form-group m-0">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <ElementsIcon v-bind:icon="'euroIcon'" />
                      </span>
                    </div>
                    <elements-input v-model="softwareLicense.discount" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'licences',
                        'discount'
                      )
                      " type="number" />
                  </div>
                </div>
              </td>
              <td>
                <div class="form-group m-0">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <ElementsIcon v-bind:icon="'euroIcon'" />
                      </span>
                    </div>
                    <elements-input readonly v-model="softwareLicense.totalNetto" type="number" />
                  </div>
                </div>
              </td>
              <td>
                <div class="cursor-pointer" @click="() => {
                  props.softwareLicencesTableData.splice(index, 1);
                }">
                  <elements-icon v-bind:icon="'xIcon'" />
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div class="py-1 px-5">
                  <button class="add-addition-btn" @click="
                    $emit('additiontalDescToggle', {
                      index,
                      componentType: `licences`,
                    })
                    ">
                    <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                    {{
                      softwareLicense.descriptionToggle
                      ? $t('Remove Additional Description')
                      : $t('Add Additional Description')
                    }}
                  </button>
                </div>
                <div v-if="softwareLicense.descriptionToggle">
                  <div class="form-group textarea">
                    <textarea v-model="softwareLicense.additionDescription" class="form-control"
                      placeholder="."></textarea>
                    <label for="" class="input-label">{{ $t('Additional Description') }}</label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="softwareLicencesTableData?.length > 0" class=" d-flex flex-column align-items-end">
        <div class="offer-table-totals">
          <ul>
            <li class="d-flex">
              <p>{{ $t("Netto") }}:</p>
              <p>{{ softwareLicencesSummery.netto }}</p>
            </li>
            <li v-for="(tax, index) in softwareLicencesSummery.tax" :key="index" class="d-flex">
              <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
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
            <li class="d-flex total">
              <p>{{ $t("Total") }}:</p>
              <p>
                {{ softwareLicencesSummery.total }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

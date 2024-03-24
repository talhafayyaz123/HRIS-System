<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "softwareMaintenanceTableData",
  "softwareMaintenanceSummery",
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
        <!-- <h3 class="card-title">{{ $t("Software Maintenance") }}</h3> -->
        <button class="secondary-btn" @click="$emit('addProduct', { componentType: 'maintainance' })">
          <elements-icon v-bind:icon="'addIcon'" />
          {{ $t("Add Product") }}
        </button>
      </div>
      <div class="table-responsive  border-bottom">
        <table class="doc-table table">
          <thead>
            <tr class="">
              <th class="">{{ $t("Article Number") }}</th>
              <th class="">{{ $t("Product Name") }}</th>
              <th class="">{{ $t("Quantity") }}</th>
              <th class="">{{ $t("Product Price") }}</th>
              <th class="">{{ $t("MAINTENANCE RATE(%)") }}</th>
              <th class="">{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="(
                    softwareMaintenance, index
                  ) in props.softwareMaintenanceTableData" :key="index">
            <tr>
              <td>{{ softwareMaintenance?.articleNumber }}</td>
              <td>
                <div>
                  {{ softwareMaintenance?.name }}


                </div>
              </td>

              <td>
                <elements-input v-model="softwareMaintenance.quantity" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'maintenance',
                    'quantity'
                  )
                  " type="number" />
              </td>

              <td>
                <div class="form-group m-0">
                  <elements-input :modelValue="softwareMaintenance?.salePrice *
                    softwareMaintenance?.quantity
                    " @input=" $emit(
    'calculateProductValue',
    $event,
    index,
    'maintenance',
    'salePrice'
  )
    " disabled type="number" />
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
                    <elements-input v-model="softwareMaintenance.maintenanceRate" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'maintenance',
                        'maintenanceRate'
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
                    <elements-input v-model="softwareMaintenance.totalNetto" type="number" readonly />
                  </div>
                </div>
              </td>
              <td>
                <div class="cursor-pointer" @click="() => {
                  props.softwareMaintenanceTableData.splice(index, 1);
                }"><elements-icon v-bind:icon="'xIcon'" /></div>

              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div class="py-1 px-5">
                  <button class="add-addition-btn" @click="
                    $emit('additiontalDescToggle', {
                      index,
                      componentType: `maintenance`,
                    })
                    ">
                    <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                    {{
                      softwareMaintenance.descriptionToggle
                      ? $t('Remove Additional Description')
                      : $t('Add Additional Description')
                    }}
                  </button>
                </div>
                <div v-if="softwareMaintenance.descriptionToggle">
                  <div class="form-group textarea">
                    <textarea v-model="softwareMaintenance.additionDescription" class="form-control"
                      placeholder="."></textarea>
                    <label for="" class="input-label">{{ $t('Additional Description') }}</label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="softwareMaintenanceTableData?.length > 0" class=" d-flex align-items-start justify-content-end">

        <div class="offer-table-totals">
          <ul class="">
            <li class="d-flex">
              <p>{{ $t("Subtotal") }}:</p>
              <p>{{ softwareMaintenanceSummery.netto }}</p>
            </li>
            <li v-if="softwareMaintenanceSummery.discountMonth != 0" class="d-flex">
              <p>
                {{ $t("Duration Discount") }} ({{
                  softwareMaintenanceSummery.discountMonth
                }}/12):
              </p>
              <p>{{ softwareMaintenanceSummery.discountTax }}</p>
            </li>

            <li class="d-flex">
              <p>{{ $t("Netto") }}:</p>
              <p>{{ softwareMaintenanceSummery.nettoTotal }}</p>
            </li>

            <li v-for="(tax, index) in softwareMaintenanceSummery.tax" :key="index" class="d-flex">
              <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
              <p>
                {{
                  (
                    Math.round(
                      (tax / 100) * softwareMaintenanceSummery.nettoTotal * 100
                    ) / 100
                  ).toFixed(2)
                }}
              </p>
            </li>
            <li class="total">
              <p>{{ $t("Total") }}:</p>
              <p>{{ softwareMaintenanceSummery.total }}</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

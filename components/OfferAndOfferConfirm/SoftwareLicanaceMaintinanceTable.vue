<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps([
  "softwareLicencesTableData",
  "optionalSoftwareLicencesTableData",
  "softwareMaintenanceTableData",
  "optionalSoftwareMaintenanceTableData",
  "softwareLicencesSummery",
  "softwareMaintenanceSummery",
  "optionalProductType",
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "calculateProductValue",
]);

const optionalProduct = reactive({
  software:
    props.optionalProductType?.includes("license") |
      props.optionalProductType?.includes("maintenance")
      ? true
      : false,
});
</script>

<template>
  <div class="">
    <!--====Software licences====-->
    <div class="mt-3">
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <span>Software licences</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="other-items d-flex justify-center">
          <div class="right-side">
            <NuxtLink class="primary-btn cursor-pointer" @click="$emit('addProduct', { componentType: 'licences' })">
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
              <th class="">{{ $t("Article Number") }}</th>
              <th class="">{{ $t("Product Name") }}</th>
              <th class="">{{ $t("Quantity") }}</th>
              <th class="">{{ $t("Product Price") }}</th>
              <th class="">{{ $t("Discount(%)") }}</th>
              <th class="">{{ $t("Netto Total") }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody  v-for="(
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
                <elements-input v-model="softwareLicense.salePrice" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'licences',
                    'salePrice'
                  )
                  " type="number" />
              </td>

              <td>
                <elements-input v-model="softwareLicense.discount" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'licences',
                    'discount'
                  )
                  " type="number" />
              </td>
              <td>
                <elements-input v-model="softwareLicense.totalNetto" type="number" />
              </td>
              <td>
                <div class="cursor-pointer" @click="() => {
                  props.softwareLicencesTableData.splice(index, 1);
                  props.softwareMaintenanceTableData.splice(index, 1);
                }
                  ">
                  <ElementsIcon v-bind:icon="'xIcon'" />
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div>
                    <div class="px-5 py-1">
                      <button class="add-addition-btn" @click="
                      $emit('additiontalDescToggle', {
                        index,
                        componentType: `licences`,
                      })
                      ">
                      <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                      {{
                        softwareLicense.descriptionToggle
                        ? `Remove Additional Description`
                        : `Add Additional Description`
                      }}
                    </button>
                    </div>
                    <div v-if="softwareLicense.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea v-model="softwareLicense.additionDescription" class="form-control"
                          placeholder="."></textarea>
                        <label for="" class="input-label">Additional Description</label>
                      </div>
                    </div>
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="softwareLicencesTableData?.length > 0" class="d-flex align-items-start justify-content-end">
        <div class="offer-table-totals">
          <ul>
            <li>
              <h3>{{ $t("Netto") }}</h3>
              <p>{{ softwareLicencesSummery.netto }}</p>
            </li>
            <li v-for="(tax, index) in softwareLicencesSummery.tax" :key="index">
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
      </div>
      <!--Optional Product-->
      <div class="form-group checkbox-group">
        <input class="checkbox-input me-2" id="optionalLicence" type="checkbox" v-model="optionalProduct.software" />
        <label class="checkbox-label" for="optionalLicence">{{ $t("Optional Products") }}</label>
      </div>
      <div class="mt-3" v-if="optionalProduct.software">
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
              <NuxtLink class="primary-btn cursor-pointer" v-if="optionalProduct.software"
                @click="$emit('addProduct', { componentType: 'licencesOptional' })">
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
                <th class="">{{ $t("Article Number") }}</th>
                <th class="">{{ $t("Product Name") }}</th>
                <th class="">{{ $t("Quantity") }}</th>
                <th class="">{{ $t("Product Price") }}</th>
                <th class="">{{ $t("Discount(%)") }}</th>
                <th class="">{{ $t("Netto Total") }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(
                  softwareLicense, index
                ) in props.optionalSoftwareLicencesTableData" :key="index">
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
                      'licencesOptional',
                      'quantity'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="softwareLicense.salePrice" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'licencesOptional',
                      'salePrice'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="softwareLicense.discount" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'licencesOptional',
                      'discount'
                    )
                    " type="number" />
                </td>
                <td>
                  <elements-input v-model="softwareLicense.totalNetto" type="number" />
                </td>
                <td>
                  <div class="cursor-pointer" @click="() => {
                    props.optionalSoftwareLicencesTableData.splice(
                      index,
                      1
                    );
                    props.optionalSoftwareMaintenanceTableData.splice(
                      index,
                      1
                    );
                  }
                    ">
                    <ElementsIcon v-bind:icon="'xIcon'" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!--========-->
    <!--====Software Maintenance====-->
    <div class="mt-3">
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <span>{{ $t("Software Maintenance") }}</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="other-items d-flex justify-center">
          <div class="right-side">
            <button class="primary-btn" disabled>
              <elements-icon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Add Product") }}
            </button>
          </div>
        </div>
      </div>
      <div class="table-responsive">
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
                <elements-input :modelValue="softwareMaintenance?.salePrice *
                  softwareMaintenance?.quantity
                  " @input="
    $emit(
      'calculateProductValue',
      $event,
      index,
      'maintenance',
      'salePrice'
    )
    " disabled type="number" />
              </td>

              <td>
                <elements-input v-model="softwareMaintenance.maintenanceRate" @input="
                  $emit(
                    'calculateProductValue',
                    $event,
                    index,
                    'maintenance',
                    'maintenanceRate'
                  )
                  " type="number" />
              </td>
              <td>
                <elements-input v-model="softwareMaintenance.totalNetto" type="number" />
              </td>
              <td>
                <div class="cursor-pointer" @click="() => {
                  props.softwareMaintenanceTableData.splice(index, 1);
                  props.softwareLicencesTableData.splice(index, 1);
                }
                  ">
                  <ElementsIcon v-bind:icon="'xIcon'" />
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <div>
                  <div class="px-5 py-1">
                    <button class="add-addition-btn" @click="
                      $emit('additiontalDescToggle', {
                        index,
                        componentType: `maintenance`,
                      })
                      ">
                      <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                      {{
                        softwareMaintenance.descriptionToggle
                        ? `Remove Additional Description`
                        : `Add Additional Description`
                      }}
                    </button>
                  </div>
                  <div v-if="softwareMaintenance.descriptionToggle">
                    <div class="form-group textarea">
                      <textarea v-model="softwareMaintenance.additionDescription" class="form-control"
                        placeholder="."></textarea>
                      <label for="" class="input-label">Additional Description</label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="softwareMaintenanceTableData?.length > 0" class="d-flex align-items-start justify-content-end">
        <div class="offer-table-totals">
          <ul>
            <li class="">
              <h3>{{ $t("Netto") }}:</h3>
              <p>{{ softwareMaintenanceSummery.netto }}</p>
            </li>
            <li v-for="(tax, index) in softwareMaintenanceSummery.tax" :key="index">
              <h3>{{ Number(tax) }}% {{ $t("Tax") }} :</h3>
              <p>
                {{
                  (
                    Math.round(
                      (tax / 100) * softwareMaintenanceSummery.netto * 100
                    ) / 100
                  ).toFixed(2)
                }}
              </p>
            </li>
            <li class="total">
              <h3>{{ $t("Total") }}:</h3>
              <p>{{ softwareMaintenanceSummery.total }}</p>
            </li>
          </ul>

        </div>
      </div>
      <!--Optional Product-->
      <div class="form-group checkbox-group">
        <input class="checkbox-input" id="optionalMaintenance" type="checkbox" v-model="optionalProduct.software" />
        <label class="checkbox-label" for="optionalMaintenance">Optional Products</label>
      </div>
      <div class="mt-3" v-if="optionalProduct.software">
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
              <button class="primary-btn" v-if="optionalProduct.software" disabled>
                <elements-icon v-bind:icon="'addIcon'" class="me-2" />
                {{ $t("Add Product") }}
              </button>
            </div>
          </div>
        </div>
        <div class="table-responsive">
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
            <tbody>
              <tr v-for="(
                    softwareLicense, index
                  ) in optionalSoftwareMaintenanceTableData" :key="index">
                <td>{{ softwareLicense?.articleNumber }}</td>
                <td>
                  {{ softwareLicense?.name }}
                </td>

                <td>
                  <elements-input v-model="softwareLicense.quantity" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'maintenanceOptional',
                      'quantity'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input :modelValue="softwareLicense?.salePrice * softwareLicense?.quantity
                    " @input="
    $emit(
      'calculateProductValue',
      $event,
      index,
      'maintenanceOptional',
      'salePrice'
    )
    " disabled type="number" />
                </td>

                <td>
                  <elements-input v-model="softwareLicense.maintenanceRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'maintenanceOptional',
                      'maintenanceRate'
                    )
                    " type="number" />
                </td>
                <td>
                  <elements-input v-model="softwareLicense.totalNetto" type="number" />
                </td>
                <td>
                  <div class="cursor-pointer" @click="() => {
                    optionalSoftwareMaintenanceTableData.splice(index, 1);
                    optionalSoftwareLicencesTableData.splice(index, 1);
                  }">
                    <elements-icon v-bind:icon="'xIcon'" />
                  </div>


                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

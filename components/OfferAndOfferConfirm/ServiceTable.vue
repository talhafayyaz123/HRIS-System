<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
const { t } = useI18n();

const props = defineProps([
  "servicesTableData",
  "servicesTableDataByCategory",
  "optionalServicesTableData",
  "optionalServicesTableDataByCategory",
  "groupBy",
  "serviceSummery",
  "serviceSummeryByCategory",
  "optionalProductType",
]);
const emits = defineEmits([
  "addProduct",
  "additiontalDescToggle",
  "calculateProductValue",
]);
const groupToggler = ref({
  service: {},
});
const optionalProduct = reactive({
  services: props.optionalProductType?.includes("service") ? true : false,
});
</script>

<template>
  <div>
    <div class="mt-3">
      <div class="page-header">
        <div class="page-title">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <span>{{ $t("Services") }}</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="other-items d-flex justify-center">
          <div class="right-side">
            <button class="primary-btn" @click="$emit('addProduct', { componentType: 'services' })">
              <elements-icon v-bind:icon="'addIcon'" class="me-2" />
              {{ $t("Add Product") }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="groupBy === 'nothing'">
        <div class="table-responsive">
          <table class="doc-table table">
            <thead>
              <tr>
                <th></th>
                <th>{{ $t("POS") }}</th>
                <th>{{ $t("ARTICLE NR.") }}</th>
                <th>{{ $t("NAME") }}</th>
                <th>{{ $t("QUANTITY/UNIT") }}</th>
                <th>{{ $t("HOURLY RATE") }}</th>
                <th>{{ $t("Discount(%)") }}</th>
                <th>{{ $t("TAX(%)") }}</th>
                <th>{{ $t("TAX RATE(%)") }}</th>
                <th>{{ $t("NETTO TOTAL(%)") }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody v-for="(services, index) in servicesTableData" :key="index">
              <tr>
                <td>
                  <input type="checkbox" :id="groupToggler['service'][services.productId]"
                    :value="groupToggler['service'][services.productId]"
                    v-model="groupToggler['service'][services.productId]" />
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ services?.articleNumber }}</td>
                <td>
                  <div>
                    {{ services?.name }}

                  </div>
                </td>

                <td>
                  <div class="d-flex">
                    <elements-input v-model="services.quantity" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'service',
                        'quantity'
                      )
                      " type="number" />
                    {{ services?.unit }}
                  </div>
                </td>

                <td>
                  <elements-input v-model="services.hourlyRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'service',
                      'hourlyRate'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="services.discount" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'service',
                      'discount'
                    )
                    " type="number" />
                </td>

                <td>
                  <div :style="{ width: '100px' }">
                    <elements-input v-model="services.tax" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'service',
                        'tax'
                      )
                      " type="number" />
                  </div>
                </td>

                <td>
                  <elements-input v-model="services.taxRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'service',
                      'taxRate'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="services.totalNetto" type="number" />
                </td>
                <td>
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    servicesTableData.splice(index, 1);
                  }
                    "></i>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <div class="px-5 py-1">
                      <button class="add-addition-btn" @click="
                        $emit('additiontalDescToggle', {
                          index,
                          componentType: `services`,
                        })
                        ">
                        <ElementsIcon v-bind:icon="'addcircleIcon'" class="me-2" />
                        {{
                          services.descriptionToggle
                          ? `Remove Additional Description`
                          : `Add Additional Description`
                        }}
                      </button>
                    </div>
                    <div v-if="services.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea v-model="services.additionDescription" class="form-control" placeholder="."></textarea>
                        <label for="" class="input-label">Additional Description</label>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="groupToggler['service'][services.productId] ||
                services.childComponents.length > 0
                ">
                <th></th>
                <th>{{ $t("POS") }}</th>
                <th>{{ $t("ARTICLE NR.") }}</th>
                <th>{{ $t("NAME") }}</th>
                <th>{{ $t("QUANTITY/UNIT") }}</th>
                <th>{{ $t("SINGLE HOURLY RATE") }}</th>
                <th>{{ $t("TOTAL RATE(%)") }}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>

              <tr v-for="(child, childIndex) in services.childComponents" :key="childIndex">
                <td class="pl-5"></td>
                <td class="pl-5">
                  <div class="">
                    <p>{{ index + 1 }}.{{ childIndex + 1 }}</p>
                  </div>
                </td>
                <td class="pl-5">
                  <div>
                    <p>
                      {{ child?.articleNumber }}
                    </p>
                  </div>
                </td>
                <td class="pl-5">
                  <div>
                    <p>
                      {{ child?.name }}
                    </p>
                  </div>
                </td>
                <td class="pl-5">
                  <div class="d-flex">
                    <elements-input v-model="child.quantity" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'childService',
                        'quantity',
                        childIndex
                      )
                      " type="number" />
                    {{ child?.unit }}
                  </div>
                </td>
                <td class="pl-5">
                  <elements-input v-model="child.hourlyRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'childService',
                      'hourlyRate',
                      childIndex
                    )
                    " type="number" />
                </td>
                <td class="pl-5">
                  <elements-input v-model="child.totalRate" type="number" disabled />
                </td>

                <td class="pl-5">
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    servicesTableData[index].childComponents.splice(
                      childIndex,
                      1
                    );
                  }
                    "></i>
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>

              <tr v-if="groupToggler['service'][services.productId]">
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button @click="
                    $emit('addProduct', {
                      componentType: 'childServices',
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
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="servicesTableData?.length > 0" class="d-flex flex-column align-items-end">
          <div class="offer-table-totals">
            <ul>
              <li class="d-flex">
                <p>{{ $t("Netto") }}:</p>
                <p>{{ serviceSummery.netto }}</p>
              </li>
              <li v-for="(tax, index) in serviceSummery.tax" :key="index" class="d-flex">
                <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
                <p>
                  {{
                    (
                      Math.round((tax / 100) * serviceSummery.netto * 100) /
                      100
                    ).toFixed(2)
                  }}
                </p>
              </li>
              <li class="d-flex total">
                <p>{{ $t("Total") }}:</p>
                <p>
                  {{ serviceSummery.total }}
                </p>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <div v-else-if="groupBy === 'category'">
        <div class="table-responsive">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("POS") }}</th>
                <th>{{ $t("ARTICLE NR.") }}</th>
                <th>{{ $t("NAME") }}</th>
                <th>{{ $t("QUANTITY/UNIT") }}</th>
                <th>{{ $t("HOURLY RATE") }}</th>
                <th>{{ $t("Discount(%)") }}</th>
                <th>{{ $t("TAX(%)") }}</th>
                <th>{{ $t("TAX RATE(%)") }}</th>
                <th>{{ $t("NETTO TOTAL(%)") }}</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(category, index) in servicesTableDataByCategory" :key="'category-' + index">
                <td>{{ index + 1 }}</td>
                <td>
                  <p v-for="product in category.products" :key="'product-' + product.id">
                    {{ product.articleNumber }}
                  </p>
                </td>
                <td>
                  <div>
                    <p class="fw-bolder">
                      {{ category?.name }}
                    </p>
                    <li class="ml-2" v-for="(product, index) in category.products" :key="'service-child-' + index">
                      {{ product?.name }}
                    </li>
                  </div>

                  <div>
                    <button @click="
                      $emit('additiontalDescToggle', {
                        index,
                        componentType: `servicesByCategory`,
                      })
                      ">
                      {{
                        category.descriptionToggle
                        ? `Remove Additional Description`
                        : `Add Additional Description`
                      }}
                    </button>
                    <div v-if="category.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea v-model="category.additionDescription" class="form-control" placeholder="."></textarea>
                        <label for="" class="input-label">Additional Description</label>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="pl-5">
                  <div class="flex">
                    <elements-input v-model="category.quantity" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategory',
                        'quantity'
                      )
                      " type="number" />
                    <p class="self-center ml-2">
                      {{ category?.unit?.name }}
                    </p>
                  </div>
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.hourlyRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceByCategory',
                      'hourlyRate'
                    )
                    " type="number" />
                </td>
                <td class="pl-5">
                  <div class="flex">
                    <elements-input v-model="category.discount" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategory',
                        'discount'
                      )
                      " type="number" />
                  </div>
                </td>
                <td class="pl-5">
                  <div :style="{ width: '100px' }">
                    <elements-input v-model="category.tax" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategory',
                        'tax'
                      )
                      " type="number" />
                  </div>
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.taxRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceByCategory',
                      'taxRate'
                    )
                    " type="number" />
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.totalNetto" type="number" />
                </td>

                <td class="text-center">
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    servicesTableDataByCategory.splice(index, 1);
                  }
                    "></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="servicesTableData?.length > 0">
          <div class="d-flex flex-column align-items-end">
            <div class="d-flex">
              <p>{{ $t("Netto") }}:</p>
              <p>{{ serviceSummeryByCategory.netto }}</p>
            </div>
            <div v-for="(tax, index) in serviceSummeryByCategory.tax" :key="index" class="d-flex">
              <p>{{ Number(tax) }}% {{ $t("Tax") }} :</p>
              <p>
                {{
                  (
                    Math.round(
                      (tax / 100) * serviceSummeryByCategory.netto * 100
                    ) / 100
                  ).toFixed(2)
                }}
              </p>
            </div>
            <div class="d-flex">
              <p>{{ $t("Total") }}:</p>
              <p>
                {{ serviceSummeryByCategory.total }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="checkbox-group mt-3">
        <input class="checkbox-input" id="optionalService" type="checkbox" v-model="optionalProduct.services" />
        <label class="checkbox-label" for="optionalService">Optional Products</label>
      </div>
      <div class="" v-if="optionalProduct.services">
        <div class="page-header mt-3">
          <div class="page-title">
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  <span>{{ $t("Optional Product") }}</span>
                </li>
              </ol>
            </div>
          </div>
          <div class="other-items d-flex justify-center">
            <div class="right-side">
              <button class="primary-btn" @click="$emit('addProduct', { componentType: 'servicesOptional' })">
                <elements-icon v-bind:icon="'addIcon'" class="me-2" />
                {{ $t("Add Product") }}
              </button>
            </div>
          </div>
        </div>
        <div class="table-responsive" v-if="groupBy === 'nothing'">
          <table class="doc-table table">
            <thead>
              <tr class="">
                <th class="">{{ $t("POS") }}</th>
                <th class="">{{ $t("ARTICLE NR.") }}</th>
                <th class="">{{ $t("NAME") }}</th>
                <th class="">{{ $t("QUANTITY/UNIT") }}</th>
                <th class="">{{ $t("HOURLY RATE") }}</th>
                <th class="">{{ $t("Discount(%)") }}</th>
                <th class="">{{ $t("TAX(%)") }}</th>
                <th class="">{{ $t("TAX RATE(%)") }}</th>
                <th class="">{{ $t("NETTO TOTAL(%)") }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(services, index) in optionalServicesTableData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ services?.articleNumber }}</td>
                <td>
                  {{ services?.name }}
                </td>

                <td>
                  <div class="d-flex">
                    <elements-input v-model="services.quantity" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceOptional',
                        'quantity'
                      )
                      " type="number" />
                    {{ services?.unit }}
                  </div>
                </td>

                <td>
                  <elements-input v-model="services.hourlyRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceOptional',
                      'hourlyRate'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="services.discount" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceOptional',
                      'discount'
                    )
                    " type="number" />
                </td>

                <td>
                  <div :style="{ width: '100px' }">
                    <elements-input v-model="services.tax" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceOptional',
                        'tax'
                      )
                      " type="number" />
                  </div>
                </td>

                <td>
                  <elements-input v-model="services.taxRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceOptional',
                      'taxRate'
                    )
                    " type="number" />
                </td>

                <td>
                  <elements-input v-model="services.totalNetto" type="number" />
                </td>
                <td>
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    optionalServicesTableData.splice(index, 1);
                  }
                    "></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-responsive" v-else-if="groupBy === 'category'">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("POS") }}</th>
                <th>{{ $t("ARTICLE NR.") }}</th>
                <th>{{ $t("NAME") }}</th>
                <th>{{ $t("QUANTITY/UNIT") }}</th>
                <th>{{ $t("HOURLY RATE") }}</th>
                <th>{{ $t("Discount(%)") }}</th>
                <th>{{ $t("TAX(%)") }}</th>
                <th>{{ $t("TAX RATE(%)") }}</th>
                <th>{{ $t("NETTO TOTAL(%)") }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(
                    category, index
                  ) in optionalServicesTableDataByCategory" :key="'category-' + index">
                <td>{{ index + 1 }}</td>
                <td>
                  <p v-for="product in category.products" :key="'product-' + product.id">
                    {{ product.articleNumber }}
                  </p>
                </td>
                <td>
                  <div>
                    <p class="fw-bolder">
                      {{ category?.name }}
                    </p>
                    <li class="ml-2" v-for="(product, index) in category.products" :key="'service-child-' + index">
                      {{ product?.name }}
                    </li>
                  </div>
                </td>
                <td class="pl-5">
                  <div class="flex">
                    <elements-input v-model="category.quantity" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategoryOptional',
                        'quantity'
                      )
                      " type="number" />
                    <p class="self-center ml-2">
                      {{ category?.unit?.name }}
                    </p>
                  </div>
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.hourlyRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceByCategoryOptional',
                      'hourlyRate'
                    )
                    " type="number" />
                </td>
                <td class="pl-5">
                  <div class="flex">
                    <elements-input v-model="category.discount" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategoryOptional',
                        'discount'
                      )
                      " type="number" />
                  </div>
                </td>
                <td class="pl-5">
                  <div :style="{ width: '100px' }">
                    <elements-input v-model="category.tax" @input="
                      $emit(
                        'calculateProductValue',
                        $event,
                        index,
                        'serviceByCategoryOptional',
                        'tax'
                      )
                      " type="number" />
                  </div>
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.taxRate" @input="
                    $emit(
                      'calculateProductValue',
                      $event,
                      index,
                      'serviceByCategoryOptional',
                      'taxRate'
                    )
                    " type="number" />
                </td>
                <td class="pl-5">
                  <elements-input v-model="category.totalNetto" type="number" />
                </td>

                <td class="text-center">
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    optionalServicesTableDataByCategory.splice(index, 1);
                  }
                    "></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

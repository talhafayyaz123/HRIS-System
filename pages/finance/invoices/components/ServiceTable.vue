<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
const { t } = useI18n();

const props = defineProps([
  "servicesTableData",
  "servicesTableDataByCategory",
  "groupBy",
  "serviceSummery",
  "serviceSummeryByCategory",
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
  services: false,
});
</script>

<template>
  <div>
    <div class="mt-3">
      <div class="mb-2 d-flex align-items-center justify-content-end">
        <button class="secondary-btn" @click="$emit('addProduct', { componentType: 'services' })">
          <ElementsIcon v-bind:icon="'addIcon'" class="me-2" />
          {{ $t("Add Product") }}
        </button>
      </div>
      <div v-if="groupBy === 'nothing'">
        <div class="table-responsive border-bottom">
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
                  <elements-input v-model="services.totalNetto" type="number" readonly />
                </td>
                <td>
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    servicesTableData.splice(index, 1);
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
                          <textarea v-model="services.additionDescription" class="form-control"
                            placeholder="."></textarea>
                          <label for="" class="input-label">Additional Description</label>
                        </div>
                      </div>
                    </div>
                </td>
              </tr>
              <tr v-if="groupToggler['service'][services.productId]">
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
            <tbody  v-for="(category, index) in servicesTableDataByCategory" :key="'category-' + index">
              <tr>
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
                  <elements-input v-model="category.totalNetto" type="number" readonly />
                </td>

                <td class="text-center">
                  <i class="mdi mdi-delete edit-icon" @click="() => {
                    servicesTableDataByCategory.splice(index, 1);
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
                        componentType: `servicesByCategory`,
                      })
                      ">
                      <elements-icon v-bind:icon="'addcircleIcon'" />
                      {{
                        category.descriptionToggle
                        ? `Remove Additional Description`
                        : `Add Additional Description`
                      }}
                    </button>
                    </div>
                    <div v-if="category.descriptionToggle">
                      <div class="form-group textarea">
                        <textarea v-model="category.additionDescription" class="form-control" placeholder="."></textarea>
                        <label for="" class="input-label">Additional Description</label>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="servicesTableData?.length > 0" class="d-flex flex-column align-items-end">
          <div class="offer-table-totals">
            <ul>
              <li class="d-flex">
                <p>{{ $t("Netto") }}:</p>
                <p>{{ serviceSummeryByCategory.netto }}</p>
              </li>
              <li v-for="(tax, index) in serviceSummeryByCategory.tax" :key="index" class="d-flex">
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
              </li>
              <li class="d-flex total">
                <p>{{ $t("Total") }}:</p>
                <p>
                  {{ serviceSummeryByCategory.total }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

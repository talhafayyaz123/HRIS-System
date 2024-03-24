<script setup lang="ts">
import { formatter } from "~/utils/helperFunctions";

const { t } = useI18n();

const props = defineProps(["productTableData"]);
const emits = defineEmits(["addProduct"]);
</script>

<template>
  <div>
    <div class="card mt-3">
        <div class="card-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Products") }}</h3>
          <elements-tooltip/>
          </div>
          <button class="secondary-btn" @click="$emit('addProduct')">
            <elements-icon v-bind:icon="'addIcon'" class="me-2"/> 
            {{ $t("Add Product") }}
          </button>
        </div>
        <div class="card-body mt-3">
          <div class="table-responsive">
            <table class="doc-table table">
              <thead>
                <tr class="">
                  <th class="">{{ $t("Article Number") }}</th>
                  <th class="">{{ $t("Product Name") }}</th>
                  <th class="">{{ $t("Quantity") }}</th>
                  <th class="">{{ $t("Product Price") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in props.productTableData" :key="index">
                  <td>{{ product?.articleNumber }}</td>
                  <td>
                    {{ product?.name }}
                  </td>

                  <td>
                    <elements-input v-model="product.quantity" type="number" :disabled="true" />
                  </td>

                  <td>
                    {{ product?.productPrice }}
                  </td>
                </tr>

                <tr v-if="props.productTableData.length === 0">
                  <td>{{ $t('No Products Added') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  </div>
</template>

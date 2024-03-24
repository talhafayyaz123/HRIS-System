<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
const { router, Toast, deleteAlert } = commonCode();
const { t } = useI18n();
const productId = ref("");
const productName = ref("");
const emit = defineEmits(["productAdded"]);
const props = defineProps(["showModal", "hideModal", "products"]);
const errorProduct = ref(false);
const changeProduct = (id, name) => {
  errorProduct.value = false;
  productId.value = id;
  productName.value = name
};

const addProduct = () => {
  errorProduct.value = false;
  if (productId.value == "") {
    errorProduct.value = true;
  } else {
    emit("productAdded", { productId: productId.value, productName: productName.value } );
    props.hideModal()
  }
};
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Add Product`"
    class="table-modal"
  >
    <div class="row mt-4 product-table">
      <div class="col-12 col-lg-12 col-sm-12">
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>ARTICLE NUMBER</th>
                <th>NAME</th>
                <th>PRODUCT CATEGORY</th>
                <th>STATUS</th>
                <th>SALE PRICE</th>
                <th>DISCOUNT</th>
                <th>QUANTITY</th>
                <th>PROFIT</th>
                <th>LISTING PRICE</th>
                <th>TAX</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in props.products" :key="index">
                <td>
                  <div class="d-flex align-items-center">
                    <div>
                      <input
                        type="radio"
                        name="product"
                        @click="changeProduct(item?.id, item?.name)"
                      />
                    </div>
                    <span>{{ item?.articleNumber }}</span>
                  </div>
                </td>

                <td>{{ item?.name }}</td>
                <td>{{ item?.showStatus }}</td>
                <td>{{ item?.salePrice }}</td>
                <td>{{ item?.type }}</td>
                <td>{{ item?.productCategory?.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <span class="error" v-if="errorProduct">Please add the product</span>
    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button :buttonName="$t('Add Product')" @click="addProduct()" />
    </div>
  </Modal>
</template>


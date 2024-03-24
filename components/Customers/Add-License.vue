<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import commonCode from "~/composables/common";
import {
  customerLicenseCreateRequest
} from "~/utils/apiRequests";

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  emit = defineEmits(["licensesAdded", "onSortChange"]);
const sales = ref([]);
const licenses = ref([]);
const props = defineProps(["products","customerId", "showModal", "hideModal", "data"])
sales.value = props.products.map((product: any) => {
  return {
    productId: product?.id,
    quantity: 1,
    articleNumber: product?.articleNumber,
    name: product?.name,
    softwareName: product?.productSoftware?.name,
    salePrice: product?.salePrice,
    maintenancePrice: product?.maintenancePrice,
    totalMaintenancePrice: product?.maintenancePrice,
    totalSalePrice: product?.salePrice,
    isEvaluation: false,
  };
});

const changePrice = (index, event) => {
  const changedValue = event.target.value;
  sales.value[index].totalSalePrice =
    changedValue * props.products[index].salePrice;
  sales.value[index].totalMaintenancePrice =
    changedValue * props.products[index].maintenancePrice;
};

const addLicenses = () => {
  customerLicenseCreateRequest({
    licenses: licenses.value
  })
    .then((response) => {
      props.hideModal()
      Toast.fire({
        icon: "success",
        title: t("Record created successfully!"),
      });
      emit("licensesAdded")
      licenses.value = [];
    })
    .catch((error) => {
      Toast.fire({ icon: "error", title: t("something went wrong!") });
    });
  
    
  };

const checkboxValue = (index, event) => {
  const changedValue = event.target.checked;
  if (changedValue == true) 
  {
    const obj = {
      companyId: props.customerId,
      isEvaluation: sales.value[index].isEvaluation,
      maintenancePrice: sales.value[index].maintenancePrice,
      productId: sales.value[index].productId,
      quantity: sales.value[index].quantity,
      salePrice: sales.value[index].salePrice
    };
    licenses.value.push(obj);
  }
  else 
    licenses.value.splice(index, 1);
},
    paginationCall = (values: any) => {
      emit('onSortChange', values)
    }
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="`Add License`"
    class="table-modal"
  >
    <div class="row mt-4 product-table">
      <div class="col-12 col-lg-12 col-sm-12">
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr class="">
                <th class="">{{ $t("Article Number") }}</th>
                <th class="">{{ $t("Product Name") }}</th>
                <th class="">{{ $t("Software Type") }}</th>
                <th class="">{{ $t("Quantity") }}</th>
                <th class="">{{ $t("Sale Price Per Unit") }}</th>
                <th class="">{{ $t("Sale Price") }}</th>
                <th class="">{{ $t("Maintenance Per Unit") }}</th>
                <th class="">{{ $t("Maintenance Rate") }}</th>
                <th class="">{{ $t("EVALUATION LICENSE") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in sales" :key="index">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="me-2">
                      <input
                        type="checkbox"
                        @change="checkboxValue(index, $event)"
                        name="license"
                      />
                    </div>
                    <span>{{ product?.articleNumber }}</span>
                  </div>
                </td>
                <td>{{ product?.name }}</td>
                <td>{{ product?.softwareName }}</td>
                <td>
                  <div class="" style="width: 100px">
                    <input
                      min="1"
                      v-model="product.quantity"
                      @change="changePrice(index, $event)"
                      type="number"
                      class="form-control"
                    />
                  </div>
                </td>
                <td>
                  <div class="" style="width: 100px">
                    <input
                      v-model="product.salePrice"
                      readonly
                      type="number"
                      class="form-control"
                    />
                  </div>
                </td>
                <td>
                  <div class="" style="width: 100px">
                    <input
                      type="number"
                      readonly
                      v-model="product.totalSalePrice"
                      class="form-control"
                    />
                  </div>
                </td>
                <td>
                  <div class="" style="width: 100px">
                    <input
                      type="number"
                      readonly
                      v-model="product.maintenancePrice"
                      class="form-control"
                    />
                  </div>
                </td>
                <td>
                  <div class="" style="width: 100px">
                    <input
                      type="number"
                      readonly
                      v-model="product.totalMaintenancePrice"
                      class="form-control"
                    />
                  </div>
                </td>
                <td>
                  <div class="">
                    <input v-model="product.isEvaluation" type="checkbox" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3">
          <Pagination @change="paginationCall" :totalPages="data?.totalPages" :nextPage="data?.nextPageUrl" :count="data?.count"
                :firstPageUrl="data?.firstPageUrl" :lastPageUrl="data?.lastPageUrl" :previousPageUrl="data?.previousPageUrl"
                :currentPage="data?.currentPage"
          />
      </div>
    </div>
    <!-- <span class="error" v-if="errorProduct">Please add the product</span> -->
    <div class="d-flex align-items-center justify-content-end mt-3">
      <button
        type="button"
        class="primary-btn me-2"
        data-bs-dismiss="modal"
        @click="() => props.hideModal()"
      >
        Close
      </button>
      <submittal-button @click="addLicenses()" :buttonName="$t('Add License')" />
    </div>
  </Modal>
</template>

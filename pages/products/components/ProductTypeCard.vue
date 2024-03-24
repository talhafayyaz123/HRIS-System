<script setup lang="ts">
import { ref, reactive, computed, provide, inject, onBeforeMount, onBeforeUnmount } from "vue";
import { useProductStore } from "~/store/product";

import commonCode from "~/composables/common";
import { ProductTypeEnum } from "~/utils/enums";
const { t } = useI18n();
const product = useProductStore()
const props = defineProps(["image", "title", "tooltip", "description"]);
const emits = defineEmits(["setShowProductType"]);

function changeProductType(title: string) {
  if (title === "Software") {
    product.setProductType(ProductTypeEnum.SOFTWARE)
    emits("setShowProductType")
  } else if (title === "Services") {
    product.setProductType(ProductTypeEnum.SERVICE);
    emits("setShowProductType")
  } else if (title === "Pauschal") {
    product.setProductType(ProductTypeEnum.PAUSCHAL);
    emits("setShowProductType")
  } else if (title === "Hosting") {
    product.setProductType(ProductTypeEnum.HOSTING);
    emits("setShowProductType")
  } else if (title === "AMS") {
    product.setProductType(ProductTypeEnum.AMS);
    emits("setShowProductType")
  } else if (title === "Cloud Software") {
    product.setProductType(ProductTypeEnum.CLOUD);
    emits("setShowProductType")
  }
  else if (title === "Traveling") {
    product.setProductType(ProductTypeEnum.TRAVELING);
    emits("setShowProductType")
  }
}
onBeforeMount(() => {
  document.body.classList.add('product-cr');
});

onBeforeUnmount(() => {
  document.body.classList.remove('product-cr');
});

</script>

<template>
  <div class="product-card h-100" @click="changeProductType(props.title)">
    <div class="product-img">
      <img :src="props.image" alt="type-img" />
    </div>
    <div class="product-content">
      <div class="mb-1 d-flex align-items-center">
        <h4 class="me-2">{{ props.title }}</h4>
        <ElementsTooltip :label="props.tooltip" />
      </div>
      <p>{{ props.description }}</p>
    </div>
  </div>
</template>

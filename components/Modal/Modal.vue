<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(["showModal", "title"]);

const emits = defineEmits(["hideModal", "save"]);
const isModalOpen = computed(function () {
  return props.showModal;
});
</script>

<template>
  <div v-if="isModalOpen" class="custom-modal">
    <div class="overlay"></div>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-card">
          <div class="modal-header">
            <h5 class="modal-title">{{ props.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="$emit('hideModal')"></button>
          </div>
          <div class="modal-body">
            <slot> </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

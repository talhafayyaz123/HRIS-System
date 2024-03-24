<script setup lang="ts">
const { t } = useI18n();
const props = defineProps(["showModal", "hideModal", "licenseKey"]);

function copyText(type) {
  // Copy the text inside the text field
  navigator.clipboard.writeText(props.licenseKey);
  // Alert the copied text
  alert("License key copied successfully!");
}
</script>

<template>
  <Modal
    :showModal="props.showModal"
    @hideModal="props.hideModal"
    :title="$t('License Key')"
  >
    <div class="flex flex-wrap -mr-6 px-8 py-1">
      <elements-input
        :modelValue="licenseKey"
        :key="licenseKey"
        :isReadonly="true"
      />
      <element-input
        :modelValue="licenseKey"
        :key="licenseKey"
        :isReadonly="true"
        class="w-full pr-2"
      />
      <button
        @click="copyText()"
        class="px-3 py-1 my-2 docsHeroColorBlue rounded"
      >
        {{ $t("Copy") }}
      </button>
    </div>
  </Modal>
</template>

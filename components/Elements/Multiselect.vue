<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import { watch, ref } from "vue";

const props = defineProps({
  textLabel: String,
  label: {
    type: String,
    default: "label",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  objectType: {
    type: Boolean,
    default: false,
  },

  trackBy: {
    type: String,
    default: "value",
  },
  modelValue: [String, Number, Boolean, Array, Object],
  options: {
    type: Array,
    default: () => [],
  },
  moduleName: {
    type: String,
    default: "",
  },
  multiple: { type: Boolean, default: false },
  key: [Object, Number, String],
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: "Select Option" },
  class: {
    type: String,
    default: "",
  },
  createOption: { type: Boolean, default: false },
  taggable: { type: Boolean, default: false },
  tagPlaceholder: { type: String, default: "" },
  createTag:  { type: Boolean, default: false },
  searchable:  { type: Boolean, default: true },
});
const selected = ref(props.modelValue);
const emits = defineEmits([
  "change",
  "tagAdded",
  "search-change",
  "open",
  "select",
  "deSelect",
  "update:modelValue",
]);
function onOpen(id: any) {
  emits("open", id);
}
function onSelect(selectedOption: any) {
  emits("select", selectedOption);
}

function onDeSelect(removedOption: any) {
  emits("deSelect", removedOption);
}
function addTag(tag: any) {
  emits("tagAdded", tag);
}
watch(selected, (current) => {
  emits("update:modelValue", current);
});
</script>
<template>
    <Multiselect
      ref="multiselect"
      :mode="!!multiple ? 'tags' : 'single'"
      :key="key"
      v-model="selected"
      :options="options"
      :label="label"
      :track-by="trackBy"
      :close-on-select="true"
      :searchable="searchable"
      :disabled="disabled"
      :object="objectType"
      :taggable="taggable"
      :tag-placeholder="tagPlaceholder"
      @tag="addTag"
      @open="onOpen"
      @select="onSelect"
      @deselect="onDeSelect"
      class="form-control"
      :class="class"
      :placeholder="placeholder"
      :create-option="createOption"
      
    />
    <label v-if="textLabel" class="input-label">
      {{ textLabel }}
      <span v-if="required" style="color: red">*</span>
    </label>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>

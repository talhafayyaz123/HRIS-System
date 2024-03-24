<script setup lang="ts" >
const props = defineProps({
    modelValue: [Number, String],
    attrs: [String, Number],
    value: [String, Number],
    model_value: [String, Number],
    readonly: Boolean,
    type: {
        type: String,
        default: 'text'
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 0
    },
    autosize: {
        type: [Boolean, Object],
        default: false
    },
    autoComplete: {
        type: String,
        default: 'off'
    },
    /** @Deprecated in next major version */
    validateEvent: {
        type: Boolean,
        default: true
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: "",
    },
    clearable: {
        type: Boolean,
        default: false
    },
    showPassword: {
        type: Boolean,
        default: false
    },
    showWordLimit: {
        type: Boolean,
        default: false
    },
    classes: {
        type: String,
        default: " ",
    },
    placeholder: {
        type: String,
        default: " ",
    },
    id: {
        type: String,
        default: " ",
    },
    required: { type: Boolean, required: false },
    error: String,
}),
    emits = defineEmits(["change", "keyPress", "blur", "focus", "update:modelValue"])
function handleChange() {
    emits("change")
}
function keyChange() {
    emits("keyPress")
}
function handleBlur() {
    emits("blur")
}
function handleFocus() {
    emits("focus")
}
</script>
<template>
    
    <input :id="id" class="form-control" :class="classes" v-bind="$attrs" :value="modelValue" :type="type"
        :disabled="disabled" :readonly="readonly" :autocomplete="autoComplete" :placeholder="placeholder" ref="input"
        @input="$emit('update:modelValue', $event.target.value)" @focus="handleFocus" @blur="handleBlur"
        @change="handleChange" @keypress="keyChange" :aria-label="label" :min="min" />
    <label v-if="label" class="input-label" :for="id">
        {{ label }}&nbsp;<span v-if="required" style="color: red">*</span></label>
    <div v-if="error" class="form-error">{{ $t(error) ?? "" }}</div>
</template>

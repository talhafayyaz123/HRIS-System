
<script setup>
import { v4 as uuid } from "uuid";
import { ref } from "vue";

const
    inheritAttrs = true,
    selected = ref(props.modelValue), // Initialize the selected value with the prop value
    props = defineProps({
        required: { type: Boolean, required: false },
        disabled: Boolean,
        //floatingLabel: Boolean,
        id: {
            type: String,
            default() {
                return `select-input-${uuid()}`;
            },
        },
        error: String,
        class: String,
        label: String,
        modelValue: [String, Number, Boolean, Object],
    }),
    emits = defineEmits(["update:modelValue"])

watch(selected, (newValue) => {
    emits("update:modelValue", newValue);
});

</script>


<template>
    <div :class="$attrs.class">
        <select :disabled="disabled" :id="id" ref="input" v-model="selected" v-bind="{ ...$attrs, class: null }"
            class="form-control " :class="error">
            <slot />
        </select>
        <label v-if="label" class="input-label">
            {{ label }}
            <span v-if="required" style="color: red">*</span>
        </label>
        <div v-if="error" class="invalid-feedback">
            <span class="text-danger" v-if="error">{{ $t('This value is required') }}</span><br>
        </div>
    </div>
</template>


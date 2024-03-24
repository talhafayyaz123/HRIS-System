<script setup >
import { v4 as uuid } from "uuid";


   const
      inheritAttrs = false,
      props= defineProps({
        required: { type: Boolean, required: false },
        id: {
            type: String,
            default() {
                return `textarea-input-${uuid()}`;
            },
        },
        rows: {
            type: Number,
            default: 5,
        },
        error: String,
        label: String,
        modelValue: String,
        isReadonly: {
            type: Boolean,
            default: false,
        },
    }),
    emits = defineEmits(["update:modelValue"])

</script>

<template>
    <div :class="$attrs.class">

        <textarea
                :id="id"
                ref="input"
                v-bind="{ ...$attrs, class: null }"
                class="form-control"
                :value="modelValue"
                :rows="rows"
                :readonly="isReadonly"
                :class="error"
                @input="$emit('update:modelValue', $event.target.value)"
                placeholder="."
        ></textarea>
        <label v-if="label" class="input-label" :for="id">
            <span v-if="required" style="color: red;">*&nbsp;</span>
            {{ label }}
        </label>
        <div v-if="error" class="form-error">{{ $t(error) ?? "" }}</div>
    </div>
</template>


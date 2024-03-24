<template>
    <div :class="$attrs.class" class="form-group m-0">

        <div v-if="floatingLabel" class="relative z-0">
            <input :id="'floating_standard_' + id" ref="input" v-bind="{ ...$attrs, class: null }" :readonly="isReadonly"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                :class="{ error: error }" :type="type" :value="modelValue" :style="isButton ? 'cursor: pointer;' : ''"
                @input="$emit('update:modelValue', $event.target.value)" />
            <label :for="'floating_standard_' + id"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"><span
                    v-if="required" style="color: red">*</span>&nbsp;{{
                        label
                    }}</label>
        </div>
        <input v-else :id="id" ref="input" v-bind="{ ...$attrs, class: null }" :readonly="isReadonly" class="form-control"
            :class="{ error: error }" :type="type" :value="modelValue" :style="isButton ? 'cursor: pointer;' : ''"
            @input="$emit('update:modelValue', $event.target.value)" placeholder="."/>
        <label v-if="label && !floatingLabel" class="input-label" :for="id"><span v-if="required"
                style="color: red">*</span>&nbsp;{{ label }}
            <span class="cursor-pointer" :title="tooltipMessage" v-if="tooltipMessage?.length">
                <font-awesome-icon icon="fa-solid fa-question" class="tooltip" />&nbsp;</span>:</label>
        <div v-if="placeholder" class="text-gray-500 text-sm mt-2">
            {{ placeholder }}
        </div>
        <div v-if="error" class="form-error">{{ $t(error) ?? "" }}</div>
    </div>
</template>

<script>
import { v4 as uuid } from "uuid";

export default {
    inheritAttrs: true,
    props: {
        isButton: { type: Boolean, required: false },
        required: { type: Boolean, required: false },
        id: {
            type: String,
            default() {
                return `text-input-${uuid()}`;
            },
        },
        type: {
            type: String,
            default: "text",
        },
        isReadonly: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: "",
        },

        floatingLabel: Boolean,
        error: String,
        label: String,
        modelValue: String,
        tooltipMessage: {
            type: String,
            required: false,
            default: "",
        },
    },
    emits: ["update:modelValue"],
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        select() {
            this.$refs.input.select();
        },
        setSelectionRange(start, end) {
            this.$refs.input.setSelectionRange(start, end);
        },
    },
};
</script>

<style scoped>
.tooltip {
    border-radius: 50%;
    font-size: 0.6rem;
    padding: 2px 4px 2px 4px;
    background-color: black;
    color: white;
}
</style>

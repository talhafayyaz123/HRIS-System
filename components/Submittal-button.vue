<script setup>
const props = defineProps({
    iconName: { type: String, default: ' ' },
    buttonName: { type: String, default: ' ' },
    isLoading: { type: Boolean, default: false },
    bType: { type: String, default: 'submit' },
    classes: { type: String, default: 'secondary-btn' }
})

</script>
<template>
    <button :disabled="isLoading" :type="bType" :class="[classes]">
        <span v-show="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <span v-if="isLoading">processing...</span>
        <div class="d-flex align-items-center" v-else>
            <span class="me-2">
                <elements-icon v-bind:icon="iconName"/>
            </span>
            <span>{{ buttonName }}</span>
        </div>
    </button>
</template>


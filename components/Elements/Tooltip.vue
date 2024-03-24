<script setup lang="ts" >
const props = defineProps({
    label: {
        type: String,
        default: "",
    },
})
const showTooltip = ref(false);

const showToolip = () => {
    showTooltip.value = true;
}

const hideTooltip = () => {
    showTooltip.value = false;
}

</script>
<template>
    <div class="tooltip-box">
        <div class="tooltip-btn" @mouseover="showToolip" @mouseleave="hideTooltip">
            <elements-icon v-bind:icon="'infoIcon'"/>
        </div>
        <div class="tooltip-custom" v-if="showTooltip"> {{ label }}</div>
    </div>
</template>


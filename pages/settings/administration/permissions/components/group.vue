<template>
    <div v-if="groupTemp" class="">
        <div class="d-flex align-items-center my-2">
            <div class="form-group w-100 mt-0 mb-0 me-2">
                <elements-input :error="nameErrorText" v-model="groupTemp.name" :label="$t('Name')" />
            </div>
            <a v-if="isOriginal" @click.prevent="$emit('deleteParentGroup', true)" class="cursor-pointer">
                <ElementsIcon v-bind:icon="'deleteIcon'" />
            </a>
            <a v-if="parent" @click.prevent="parent.child = null" class="cursor-pointer">
                <ElementsIcon v-bind:icon="'deleteIcon'" />
            </a>
        </div>
        <div v-if="groupTemp.child" class="">
            <Group :isOriginal="false" :triggered="triggered" :parent="groupTemp" :group="groupTemp.child" />
        </div>
        <div v-else class="d-flex align-items-center justify-content-end">
            <button @click="addSubGroup" class="secondary-btn">
                + {{ $t("Add Child Group") }}
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
    name: "Group",
    props: {
        isOriginal: {
            type: Boolean,
            default: false,
        },
        triggered: {
            type: Boolean,
            default: false,
        },
        parent: {
            type: Object,
        },
        group: {
            type: Object,
            default: null,
        },
    },
    setup(props) {
        const groupTemp = ref(null);
        onMounted(() => {
            groupTemp.value = props.group;
        });
        const nameErrorText = computed(() => {
            if (groupTemp.value.name.length === 0 && props.triggered) {
                return "Name is required";
            }
            return "";
        });
        const addSubGroup = () => {
            groupTemp.value.child = {
                name: "",
                child: null,
            };
        };
        return {
            groupTemp,
            nameErrorText,
            addSubGroup,
        };
    },
};
</script>

<style scoped></style>

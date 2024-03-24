<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th v-if="!removeSerialAble">
                        <div v-if="!notSerialAble" class="text-nowrap d-flex align-items-center"
                            @click="updateOrdering('id')">
                            <button>
                                <i :class="orderDirection === 'desc' && orderColumn === 'id' ? 'text-primary' : orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'id' ? 'd-none text-dark' : 'text-dark'"
                                    class="fas fa-caret-up"></i>
                                <i class="fas fa-caret-down"
                                    :class="orderDirection === 'asc' && orderColumn === 'id' ? 'text-primary' : orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'id' ? 'd-none text-dark' : 'text-dark'"></i>
                            </button>
                            <span :class="{ 'text-hex-aa00 ': orderColumn === 'id' }">
                                {{ $t('Serial Number') }}
                            </span>
                        </div>
                        <div v-else>
                            <span :class="{ 'text-hex-aa00 ': orderColumn === 'id' }">
                                {{ $t('Serial Number') }}
                            </span>
                        </div>
                    </th>
                    <th v-for="(row) in columns" :key='row.field'>
                        <div v-if="row.sortable" class="text-nowrap d-flex align-items-center"
                            @click="updateOrdering(row.field)">
                            <button>
                                <i :class="orderDirection === 'desc' && orderColumn === row.field ? 'text-primary' : orderDirection !== '' && orderDirection !== 'desc' && orderColumn === row.field ? 'd-none text-dark' : 'text-dark'"
                                    class="fas fa-caret-up"></i>
                                <i class="fas fa-caret-down"
                                    :class="orderDirection === 'asc' && orderColumn === row.field ? 'text-primary' : orderDirection !== '' && orderDirection !== 'asc' && orderColumn === row.field ? 'd-none text-dark' : 'text-dark'"></i>
                            </button>
                            <span :class="{ 'text-hex-aa00 ': orderColumn === row.field }">
                                {{ row.label }}
                            </span>
                        </div>
                        <div v-else>
                            <span :class="{ 'text-hex-aa00 ': orderColumn === row.field }">
                                {{ row.label }}
                            </span>
                        </div>
                    </th>
                    <th class="text-right" style="width: 75px;">
                        <div class="table-setting" @click="toggleRightBarSetting()">
                            <i class="fe-settings"></i>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-if="isCustomBody">
                <slot></slot>
            </tbody>
            <tbody v-else>
                <tr v-if="rows?.length > 0" v-for="(row, index) in rows">
                    <td v-if="!removeSerialAble">
                        <span v-if="!!isSerialNoCustomColumn">
                            {{ row?.serialNo }}
                        </span>
                        <span v-else>
                            {{ row?.id }}
                        </span>
                    </td>
                    <td v-for="(col, key) in columns" :key='col.field' v-show="col.field !== 'action'">
                        {{ row[col.field] }}
                    </td>
                    <td v-if="isUUid == 1" style="width: 130px;">

                        <ul class="list-inline table-action m-0">
                            <li class="list-inline-item ml-1" v-if="!!editPath">

                                <NuxtLink v-if="!!parentId" :title="'Edit'" :to="editPath + row.uuid + '/' + parentId">
                                    <ElementsIcon v-bind:icon="'editIcon'" />
                                </NuxtLink>

                                <NuxtLink :title="'Edit'" :to="editPath + row.uuid" v-else>
                                    <ElementsIcon v-bind:icon="'editIcon'" />
                                </NuxtLink>

                            </li>
                            <li class="list-inline-item ml-1" v-if="!editPath" @click="$emit('edit', row.uuid)">
                                <NuxtLink title="'Edit'">
                                    <ElementsIcon v-bind:icon="'editIcon'" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ml-1" @click="$emit('destroy', row.uuid)">
                                <NuxtLink title="'Delete'">
                                    <ElementsIcon v-bind:icon="'deleteIcon'" class="cursor-pointer" />
                                </NuxtLink>

                            </li>
                        </ul>
                    </td>

                    <td v-else style="width: 130px;">
                        <ul class="list-inline table-action m-0">

                            <li class="list-inline-item ms-1" v-if="!!generateEmail"
                                @click="$emit('generateEmail', row.id)">
                                <NuxtLink :title="'Generate Email'">
                                    <ElementsIcon v-bind:icon="'infoIcon'" class="cursor-pointer" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ms-1" v-if="!!generateDocs" @click="$emit('generateDocs', row.id)">
                                <NuxtLink :title="'Generate Document'">
                                    <ElementsIcon v-bind:icon="'circleIcon'" class="cursor-pointer" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ms-1" v-if="!!showPath">
                                <NuxtLink :title="'View'" :to="showPath + row.id">
                                    <ElementsIcon v-bind:icon="'visibleIcon'" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ms-1" v-if="!!editPath">
                                <NuxtLink :title="'Edit'" :to="editPath + row.id">
                                    <ElementsIcon v-bind:icon="'editIcon'" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ms-1" v-if="!editPath" @click="$emit('edit', row.id)">
                                <NuxtLink title="'Edit'">
                                    <ElementsIcon v-bind:icon="'editIcon'" />
                                </NuxtLink>
                            </li>
                            <li class="list-inline-item ms-1" @click="$emit('destroy', row.id)">
                                <NuxtLink :title="'Delete'">
                                    <ElementsIcon v-bind:icon="'deleteIcon'" class="cursor-pointer" />
                                </NuxtLink>
                            </li>

                        </ul>
                    </td>
                    <td></td>
                </tr>
                <tr v-else>
                    <td :colspan="columns ? (columns.length + 2) : 1" class="text-sm text-center">
                        {{ $t("No Records Added") }}
                    </td>
                </tr>
            </tbody>

        </table>
        <div class="rightbar-main" :class="{ 'show': showRightBarSetting }">
            <RightSidebar @rightBarEvent="rightBarClose" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
interface Props {
    columns: Object,
    rows?: Object,
    editPath?: String,
    showPath?: String | null,
    generateEmail?: boolean
    generateDocs?: boolean
    isUUid?: Boolean,
    isCustomBody?: Boolean,
    parentId?: String | null,
    orderColumn?: String,
    orderDirection?: String
    notSerialAble?: Boolean
    removeSerialAble?: Boolean,
    isSerialNoCustomColumn?: Boolean
}
const props = defineProps<Props>()

const emits = defineEmits(['onSortChange', 'destroy', 'edit', 'show', 'generateEmail'])
const orderColumn = ref(props.orderColumn),
    orderDirection = ref(props.orderDirection)
function updateOrdering(column: any) {
    orderColumn.value = column;
    orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc';
    emits('onSortChange', orderColumn.value, orderDirection.value)
}
const showRightBarSetting = ref(false);
function toggleRightBarSetting() {
    showRightBarSetting.value = !showRightBarSetting.value;
}
function rightBarClose() {
    showRightBarSetting.value = false;
}

</script>
<style scoped>
.fill-orange {
    fill: #ffaa00;
}

.fill-white {
    fill: #FFFFFF;
}
</style>
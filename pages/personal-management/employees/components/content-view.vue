<script setup lang="ts" >
import { useLayoutStore } from "@/store/layout";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import { ref } from "vue";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";

const store = useLayoutStore();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    data,
    listingFunc,
    onSortChange,
    handleSearch,
    destroy,
} = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode();
const props = defineProps({
    currentView: String,
});
const columnConfig = [
    {
        label: "Name",
        field: "name",
        sortable: true,
    },
    {
        label: "Email",
        field: "email",
        sortable: true,
    },
    {
        label: "Job Title",
        field: "jobTitle",
        sortable: true,
    },
    {
        label: "Location Name",
        field: "locationName",
        sortable: true,
    },
    {
        label: "Join Date",
        field: "joinDate",
        sortable: true,
    },
    {
        label: "Date Of Birth",
        field: "dateOfBirth",
        sortable: true,
    },

    {
        label: "Actions",
        field: "action",
        sortable: false,
    },
];
const rows = ref([]);
const showOverlay = ref(false);
function cardOverlay() {
    showOverlay.value = true;
}
function hideOverlay() {
    showOverlay.value = false;
}
function refresh(
    page = 1,
    perPage = 10,
    column = "id",
    order = "desc",
    search = ""
) {
    listingFunc({
        page: page,
        perPage: perPage,
        sortBy: column,
        sortOrder: order,
        search: search,
    });
}
const { columns } = useTranslatedColumns(columnConfig);

apiRoute.value = routes.EMPLOYEE;
refresh();
</script>

<template>
    <div>
        <div v-if="currentView === 'list'">
            <Table class="doc-table" :key="data?.customers?.length" :columns="columns" :rows="data?.employees"
                editPath="/personal-management/employees/edit-" @onSortChange="onSortChange" @destroy="destroy" />
        </div>
        <div v-if="currentView === 'grid'">
            <div class="">
                <div class="employee-card" @click="cardOverlay">
                    <div class="card-upper">
                        <ElementsIcon v-bind:icon="'cardWatermarkIcon'" class="watermark-img" />
                        <ElementsIcon v-bind:icon="'cardfrontIcon'" class="front-bg" />
                        <div class="text-center">
                            <ElementsIcon v-bind:icon="'doctextIcon'" />
                        </div>
                        <div class="card-img">
                            <div class="img-container">
                                <ElementsIcon v-bind:icon="'imgBorderIcon'" class="img-border" />
                                <ElementsIcon v-bind:icon="'tobaisImgIcon'" class="img" />
                            </div>
                        </div>
                        <div class="card-content">
                            <h4>Tobias Schmidt-Tudl</h4>
                            <h5>Geschäftsführer | CEO</h5>
                            <ul>
                                <li>
                                    <div class="icon">
                                        <ElementsIcon v-bind:icon="'cardUserIcon'" />
                                    </div>
                                    |
                                    <span>00001</span>
                                </li>
                                <li>
                                    <div class="icon">
                                        <ElementsIcon v-bind:icon="'cardMailIcon'" />
                                    </div>
                                    |
                                    <span>tobias@docshero.com</span>
                                </li>
                                <li>
                                    <div class="icon">
                                        <ElementsIcon v-bind:icon="'cardCallIcon'" />
                                    </div>
                                    |
                                    <span>54786666</span>
                                </li>
                                <li>
                                    <div class="icon">
                                        <ElementsIcon v-bind:icon="'cardcalenderIcon'" />
                                    </div>
                                    |
                                    <span>05/04/2002</span>
                                </li>
                                <li>
                                    <div class="icon">
                                        <ElementsIcon v-bind:icon="'cardLocationIcon'" />
                                    </div>
                                    |
                                    <span>Standort Karlsruhe</span>
                                </li>
                            </ul>
                        </div>
                        <p class="bottom-text">Business Unit - Administration,<br>
                            Business Unit - ELO</p>
                    </div>
                    <div class="card-back">
                        <ElementsIcon v-bind:icon="'cardBackIcon'" class="front-bg" />
                        <ElementsIcon v-bind:icon="'cardlogIcon'" class="union-icon" />
                        <div class="text-center">
                            <ElementsIcon v-bind:icon="'cardlogoIcon'" />
                        </div>
                        <div class="card-back-content">
                            <div class="content-inner">
                                <div class="left-content">
                                    <h4>Office</h4>
                                </div>
                                <div class="center-border">
                                    <div class="border-line"></div>
                                </div>
                                <div class="right-content">
                                    <div class="mb-1 d-flex align-items-center justify-content-end">
                                        <ElementsIcon v-bind:icon="'locaIcon'" class="me-1" />
                                        <h4>Office</h4>
                                    </div>
                                    <p>A5, Some Street,
                                        Some Colony,
                                        Westside,
                                        City (Country)
                                        401111</p>
                                </div>
                            </div>

                        </div>
                        <p class="bottom-text">https://www.docshero.de</p>
                    </div>
                    <div class="card-overlay" v-show="showOverlay" @mouseleave="hideOverlay"></div>
                    <div class="card-overlay-btn" v-show="showOverlay" @mouseleave="hideOverlay">
                        <ul>
                            <li>
                                <a href="">
                                    <ElementsIcon v-bind:icon="'cardVisibleIcon'" />
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <ElementsIcon v-bind:icon="'cardEditIcon'" />
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <ElementsIcon v-bind:icon="'carddeleteIcon'" />
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <ElementsIcon v-bind:icon="'cardDownloadIcon'" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-3">
            <Pagination :data="data" @change="refresh" />
        </div>
    </div>
</template>
  
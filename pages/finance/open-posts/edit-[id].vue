<script setup lang="ts">
import { ref } from "vue";
import { routes } from "~/utils/apiRoutes";
import { useLayoutStore } from "@/store/layout";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import genericFeatures from "~/composables/generic";


const { fetchListing, showGenericListing } = genericFeatures();
const layoutStore = useLayoutStore();
const { t } = useI18n();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    orderDirection,
    orderColumn,
    data,
    storeFunc,
    updateFunc,
    listingFunc,
    onSortChange,
    handleSearch,
    submitted,
    destroy,
} = genericFunctionality(),
    { router, Toast, deleteAlert } = commonCode();

const breadCrumbsConfig = [
    {
        text: "Admin portal",
        to: "/",
    },
    {
        text: "Finance",
        to: "/finance",
    },
    {
        text: "Open posts",
        to: "/finance/open-posts",
    },
    {
        text: "Edit",
        active: true,
    },
],
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Open Post Edit");

useHead({
    title: title,
});

const isLoading = ref(false),
    state = reactive({
        levelId: "",
        reminderStop: false,
        reminderStopUntil: null,
    }),
    validationRulesForm = {
        levelId: { required },
        reminderStopUntil: {
            required: requiredIf(function () {
                return (
                    state.reminderStop == true
                );
            }),
        },
    },
    v$ = useVuelidate(validationRulesForm, state),
    levels = ref([]),
    refresh = async (page = currentPage.value, perPage = currentPerPage.value, column = 'id', order = 'desc', search = '') => {
        layoutStore.changeLoaderValue(true);
        showGenericListing(routes.REMINDER_LEVEL).then((response: any) => {
            levels.value = response?.data?.reminderLevels.map((level: any) => {
                return {
                    text: level.name,
                    value: level.id,
                };
            });
        }).finally(()=>{
            layoutStore.changeLoaderValue(false);
        })
    },
    store = async () => {
        v$.value.$touch();
        if (v$.value.$invalid) {
            submitted.value = false;
            return false;
        }
        const route = useRoute();
        try {
            apiRoute.value = routes.OPEN_POST;
            let payLoad = {
                id: route?.params?.id,
                data: { ...state, levelId: state.levelId }
            }
            updateFunc(payLoad, route?.params?.id);
        } catch (e) { }
    }

refresh();

</script>

<template>
    <div>
        <page-header :title="title" :items="items" />
        <form @submit.prevent="store">
            <div class="row">
                <div class="col-lg-6">
                    <div class="card h-auto">
                        <div class="card-header d-flex align-items-center">
                            <h3 class="card-title me-2">
                                {{ $t("Open post Edit") }}
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <elements-multiselect v-model="state.levelId" :options="levels" label="text"
                                            track-by="value" :textLabel="$t('Invoice Reminder Level:')" :required="true"
                                            :class="{ 'is-invalid': v$.levelId.$error }" />
                                    </div>
                                    <div v-if="v$.levelId.$error" class="invalid-feedback">
                                        <span class="text-danger" v-if="v$.levelId.required">
                                            {{ $t("This value is required") }}
                                        </span>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <label for="" class="me-3">{{ $t('Reminder Stop') }}:</label>
                                        <input type="checkbox" v-model="state.reminderStop" class="me-2" />
                                    </div>
                                </div>
                                <div class="col-lg-12" v-if="state.reminderStop">
                                    <div class="form-group">
                                        <elements-input v-model="state.reminderStopUntil" :label="$t('Reminder Stop Until')"
                                            :required="true" :disabled="isLoading" id="category-name" type="date" :class="{ 'is-invalid': v$.reminderStopUntil.$error }" />
                                    </div>
                                    <div v-if="v$.reminderStopUntil.$error" class="invalid-feedback" >
                                        <span class="text-danger" v-if="v$.reminderStopUntil.required">{{
                                          $t("This value is required")
                                        }}</span>
                                      </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="mt-3 d-flex align-items-center justify-content-end">
                        <submittal-button :isLoading="isLoading" :buttonName="$t('Update')" />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
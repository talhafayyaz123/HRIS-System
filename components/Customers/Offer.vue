<script setup lang="ts">
import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
    { t } = useI18n(),
    state = reactive({
        isLoading: false,
        submitted: false,
        name: "",
        types: ""
    }),
    typesOptions = [
        { value: "premise", name: "On-Premise" },
        { value: "private", name: "Cloud (Private)" },
        { value: "public", name: "Cloud (Public)" },
        { value: "hosting", name: "Hosting" },
        { value: "other", name: "Other" },
    ],
    validationRules = {
        name: { required },
    },
    v$ = useVuelidate(validationRules, state);

</script>
<template>
    <div>
        <div class="card">
            <div class="card-header px-4 py-2 pb-3 d-flex align-items-center">
                <h3 class="card-title me-2">{{ $t("2023-76080") }}</h3>
                <elements-tooltip />
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-6">
                        <!-- <div class="form-group">
                            <elements-multiselect v-model="state.types" :options="typesOptions" label="name"
                                track-by="value" :multiple="true" :textLabel="$t('Terms')" />
                        </div> -->
                    </div>
                    <div class="col-lg-6">
                        <!-- <div class="form-group">
                            <elements-multiselect v-model="state.types" :options="typesOptions" label="name"
                                track-by="value" :multiple="true" :textLabel="$t('Terms')" />
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <div class="table-responsive mb-3">
            <table class="doc-table table">
                <thead>
                    <tr>
                        <th>{{ $t("Component") }}</th>
                        <th>{{ $t("Netto") }}</th>
                        <th>{{ $t("Tax") }}</th>
                        <th style="width: 140px;">{{ $t("Total") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

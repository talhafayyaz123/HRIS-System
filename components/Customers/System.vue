<script setup lang="ts">
import { ref, reactive } from "vue";
import {
    customerCreateRequest,
    customerUpdateRequest,
    customerShowRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const { router, Toast } = commonCode(),
    { t } = useI18n(),
    state = reactive({
        isLoading: false,
        submitted: false,
        name: "",
        vatId: "",
        zip: "",
        city: "",
        phone: "",
        state: "",
        url: "",
        fax: "",
        productType: "",
        addressLine1: "",
        addressLine2: "",
        countryId: "",
        termOfPayment: "",
        invoiceEmailAddress: "",
        paymentPeriodId: "",
        mergePdfOnDefault: false,
        applyReverseChanges: false,
        externalOrderNumber: "",
        hourlyRate: "",
        discount: "",
        defaultServiceDailyRate: "",
        productName: "",
        productId: "",
    }),
    emit = defineEmits(["tab1Done"]),
    customerId = ref(""),
    isBankDetails = ref(false),
    bankDetails = reactive({
        isLoading: false,
        submitted: false,
        bankName: "",
        swift: "",
        iban: "",
    }),
    productTypeOptions = [
        { value: "premise", name: "On-Premise" },
        { value: "private", name: "Cloud (Private)" },
        { value: "public", name: "Cloud (Public)" },
        { value: "hosting", name: "Hosting" },
        { value: "other", name: "Other" },
    ],
    validationRules = {
        name: { required },
        vatId: { required },
        zip: { required },
        phone: { required },
        city: { required },
        url: { required },
        state: { required },
        addressLine1: { required },
        countryId: { required },
        paymentPeriodId: { required },
    },
    bankDetailsRules = {
        bankName: { required },
        swift: { required },
        iban: { required },
    },
    v$ = useVuelidate(validationRules, state),
    v2$ = useVuelidate(bankDetailsRules, bankDetails);
const rows = ref([]);
const props = defineProps({
    countries: {
        type: Array,
        default: [],
    },
    customerId: {
        type: String,
        default: "",
    },
    products: {
        type: Array,
        default: [],
    },
    termsOfPayments: {
        type: Array,
        default: [],
    },
    paymentPeriods: {
        type: Array,
        default: [],
    },
    isUpdate: {
        type: Boolean,
        default: false,
    },
});

const popRow = (index) => {
    rows.value.splice(index, 1);
};
const defaultServiceProductAdded = (data) => {
    state.productId = data.productId;
    state.productName = data.productName;
};
const isModalOpen = ref(false);

function hideModal() {
    isModalOpen.value = false;
}

function openModal() {
    isModalOpen.value = true;
}

const showCustomer = () => {
    customerShowRequest(props.customerId).then((response) => {
        state.vatId = response?.data?.vatId;
        state.name = response?.data?.name;
        state.productType = response?.data?.type;
        state.addressLine1 = response?.data?.addressFirst;
        state.addressLine2 = response?.data?.addressSecond;
        state.city = response?.data?.city;
        state.state = response?.data?.state;
        state.phone = response?.data?.phone;
        state.zip = response?.data?.zip;
        state.url = response?.data?.url;
        state.fax = response?.data?.fax;
        state.productId = response?.data?.defaultServiceProduct?.id;
        state.defaultServiceDailyRate = response?.data?.defaultServiceDailyRate;
        state.hourlyRate = response?.data?.defaultServiceHourlyRate;
        state.invoiceEmailAddress = response?.data?.invoiceEmail;
        state.countryId = response?.data?.country?.id;
        state.productName = response?.data?.defaultServiceProduct?.name;
        state.discount = response?.data?.discount;
        state.termOfPayment = response?.data?.termOfPayment?.id;
        state.paymentPeriodId = response?.data?.paymentPeriodId;
        state.applyReverseChanges = response?.data?.applyReverseChange;
        state.mergePdfOnDefault = response?.data?.mergePdfOnDefault;
        state.externalOrderNumber = response?.data?.externalOrderNo;
        rows.value = response?.data?.bankDetails;

    });
};

const refresh = () => {
    if (router.params.id) {
        showCustomer();
    }
};

refresh();

const addBankDetails = () => {
    isBankDetails.value = true;
    bankDetails.submitted = true;
    v2$.value.$touch();
    if (v2$.value.$invalid) {
        return false;
    } else {
        bankDetails.submitted = false;
        const obj = {
            bankName: bankDetails.bankName,
            swift: bankDetails.swift,
            iban: bankDetails.iban,
        };
        rows.value.push(obj);
        isBankDetails.value = false;
        bankDetails.swift = "";
        bankDetails.bankName = "";
        bankDetails.iban = "";
    }
};

const store = () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        state.submitted = false;
        return false;
    } else {
        try {
            state.isLoading = true;
            if (props.isUpdate == true) {
                updateCompany();
            } else {
                createCompany();
            }
        } catch (e) {
            Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
            state.isLoading = false;
            state.submitted = false;
        }
    }
};

const updateCompany = () => {
    customerUpdateRequest(
        {
            name: state.name,
            vatId: state.vatId,
            addressFirst: state.addressLine1,
            addressSecond: state.addressLine2,
            type: state.productType,
            zip: state.zip,
            city: state.city,
            countryId: state.countryId,
            state: state.state,
            phone: state.phone,
            fax: state.fax,
            url: state.url,
            termOfPaymentId: state.termOfPayment,
            invoiceEmail: state.invoiceEmailAddress,
            paymentPeriodId: state.paymentPeriodId,
            applyReverseChange: state.applyReverseChanges,
            mergePdfOnDefault: state.mergePdfOnDefault,
            externalOrderNo: state.externalOrderNumber,
            bankDetails: rows.value,
            defaultServiceProduct: state.productId,
            defaultServiceDailyRate: state.defaultServiceDailyRate,
            defaultServiceHourlyRate: state.hourlyRate,
            discount: state.discount,
        },
        props.customerId
    )
        .then((response) => {
            Toast.fire({
                icon: "success",
                title: t("Record updated successfully!"),
            });
            state.isLoading = false;
            state.submitted = false;
            emit("tab1Done", { customerId: response?.data?.id });
        })
        .catch((error) => {
            state.isLoading = false;
            state.submitted = false;
            Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
};

const createCompany = () => {
    customerCreateRequest({
        name: state.name,
        vatId: state.vatId,
        addressFirst: state.addressLine1,
        addressSecond: state.addressLine2,
        type: state.productType,
        zip: state.zip,
        city: state.city,
        fax: state.fax,
        countryId: state.countryId,
        state: state.state,
        phone: state.phone,
        url: state.url,
        termOfPaymentId: state.termOfPayment,
        invoiceEmail: state.invoiceEmailAddress,
        paymentPeriodId: state.paymentPeriodId,
        applyReverseChange: state.applyReverseChanges,
        mergePdfOnDefault: state.mergePdfOnDefault,
        externalOrderNo: state.externalOrderNumber,
        bankDetails: rows.value,
        defaultServiceProduct: state.productId,
        defaultServiceDailyRate: state.defaultServiceDailyRate,
        defaultServiceHourlyRate: state.hourlyRate,
        discount: state.discount,
    })
        .then((response) => {
            Toast.fire({
                icon: "success",
                title: t("Record created successfully!"),
            });
            customerId.value = response?.data?.id;
            emit("tab1Done", { customerId: response?.data?.id });

            state.isLoading = false;
            state.submitted = false;
        })
        .catch((error) => {
            state.isLoading = false;
            state.submitted = false;
            Toast.fire({ icon: "error", title: t("something went wrong!") });
        });
};
</script>
<template>
    <div>
        <div class="card-header px-4 py-2 pb-3 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("On Premise System") }}</h3>
            <elements-tooltip />
        </div>
        <div class="table-responsive">
            <table class="doc-table table">
                <thead>
                    <tr>
                        <th>{{ $t("System Name") }}</th>
                        <th>{{ $t("System Number") }}</th>
                        <th>{{ $t("Customer") }}</th>
                        <th>{{ $t("ServerIp") }}</th>
                        <th>{{ $t("Instance Type") }}</th>
                        <th>{{ $t("Operating System") }}</th>
                        <th style="width: 140px;">{{ $t("Actions") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <ul class="list-inline table-action m-0">
                                <li class="list-inline-item ms-1">
                                    <div class="cursor-pointer" :title="'Edit'">
                                        <ElementsIcon v-bind:icon="'editIcon'" />
                                    </div>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-header px-4 py-3 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Cloud System") }}</h3>
            <elements-tooltip />
        </div>
        <div class="table-responsive">
            <table class="doc-table table">
                <thead>
                    <tr>
                        <th>{{ $t("Tennant Name") }}</th>
                        <th>{{ $t("System Number") }}</th>
                        <th>{{ $t("Host") }}</th>
                        <th>{{ $t("Sub Type") }}</th>
                        <th>{{ $t("Instance Type") }}</th>
                        <th style="width: 140px;">{{ $t("Actions") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <ul class="list-inline table-action m-0">
                                <li class="list-inline-item ms-1">
                                    <div class="cursor-pointer" :title="'Edit'">
                                        <ElementsIcon v-bind:icon="'editIcon'" />
                                    </div>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-header px-4 py-3 d-flex align-items-center">
            <h3 class="card-title me-2">{{ $t("Hosting System") }}</h3>
            <elements-tooltip />
        </div>
        <div class="table-responsive">
            <table class="doc-table table">
                <thead>
                    <tr>
                        <th>{{ $t("Tennant Name") }}</th>
                        <th>{{ $t("System Number") }}</th>
                        <th>{{ $t("Customer") }}</th>
                        <th>{{ $t("ServerIp") }}</th>
                        <th>{{ $t("Instance Type") }}</th>
                        <th style="width: 140px;">{{ $t("Actions") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <ul class="list-inline table-action m-0">
                                <li class="list-inline-item ms-1">
                                    <div class="cursor-pointer" :title="'Edit'">
                                        <ElementsIcon v-bind:icon="'editIcon'" />
                                    </div>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

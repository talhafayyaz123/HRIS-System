<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";

import { useVuelidate } from "@vuelidate/core";
import {
  required,
  requiredIf,
  minLength,
  helpers,
} from "@vuelidate/validators";
import { ValidateEach } from "@vuelidate/components";

import Multiselect from "@vueform/multiselect";

import { routes } from "~/utils/apiRoutes";
import genericFeatures from "~/composables/generic";
import genericFunctionality from "~/composables/genericFunctionality";
import { genericListingRequest } from "~/utils/apiRequests";
import { specificGetRequest } from "~/utils/apiRequests";

import { useLayoutStore } from "~/store/layout";

import AddProduct from "./AddProduct.vue";
import ProductTable from "./ProductTable.vue";
import AddAmsProduct from "./AddAmsProduct.vue";
import AmsProductTable from "./AmsProductTable.vue";

const layout = useLayoutStore();
const { showSpecificGenericListing, showGenericListing } = genericFeatures(),
  { isLoading, apiRoute, storeFunc, updateFunc, showFunc } =
    genericFunctionality(),
  { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    receiverType: "",
    customerId: "", // receiver
    contractTypeId: "",
    personInCharge: "",
  });
let attachmentsState = reactive([
  // {
  //   attachmentId: "",
  //   userId: "",
  //   startDate: "",
  //   terminationDate: "",
  //   signedDate: "",
  //   slaServiceTimeId: "",
  //   slaLevelIncidentId: "",
  //   slaLevelChangeId: "",
  // },
]);
const isSubmitted = ref(false),
  attachmentsData = ref(),
  productCategoriesData = ref(), // contain Api response data
  companyDetail = ref(),
  receiverTypeOptions = [
    {
      value: "customer",
      name: "Customer",
    },
    {
      value: "lead",
      name: "Lead",
    },
  ],
  // companies = ref([]),
  customerOptions = ref([]),
  userOptions = ref([]),
  personInChargeOptions = ref([]),
  contractFieldCustomerOptions = ref([]),
  contractFieldInvoiceOptions = ref([]),
  contractFieldOfferOptions = ref([]),
  contractFieldPROptions = ref([]),
  contractTypeOptions = ref([]),
  contractFieldSlaServiceOptions = ref([]),
  contractFieldSlaLevelOptions = ref([]),
  parentAttachmentIndex = ref(null),
  childContractIndex = ref(null),
  categoryId = ref(null),
  stateValidation = {
    receiverType: { required },
    customerId: { required },
    contractTypeId: { required },
    personInCharge: { required },
  },
  attachmentsStateValidation = {
    attachmentId: {},
    userId: {},
    startDate: {
      required,
      minLength: minLength(attachmentsState.length),
    },
    terminationDate: "",
    signedDate: "",

    slaServiceTimeId: {
      required,
    },
    slaLevelId: {
      required,
    },
    // contractFields: {
    //   $each: helpers.forEach({
    //     key: { required },
    //     value: { required },
    //   }),
    // },
    // contractFields: {
    //   $each: {
    //     key: { required },
    //     value: { required },
    //     // ... other validations for contractFields
    //   },
    // },
  };

// dynamic validation
const attachmentsStateValid = useVuelidate(
  attachmentsStateValidation,
  attachmentsState as any,
  { $stopPropagation: true }
);
const v$ = useVuelidate(stateValidation, state); // static validation

onMounted(async function () {
  try {
    const res = await genericListingRequest(routes.CONTRACT_TYPES, {
      all: true,
    });
    const prodCategoryRes = await genericListingRequest(
      routes.PRODUCT_CATEGORY,
      {
        type: "ams",
      }
    );
    const personInChargeRes = await genericListingRequest(routes.EMPLOYEE, {
      all: true,
    });

    const contractFieldCustomerRes = await genericListingRequest(
      routes.COMPANY,
      {
        all: true,
      }
    );
    const contractFieldInvoiceRes = await genericListingRequest(
      routes.INVOICE,
      {
        all: true,
      }
    );
    const contractFieldOfferRes = await genericListingRequest(
      routes.SALE_OFFER,
      {
        all: true,
      }
    );
    const contractFieldPRRes = await genericListingRequest(
      routes.PERFORMANCE_RECORD,
      {
        search: "",
        company: "",
        sortBy: "",
        sortOrder: "desc",
      }
    );
    const contractFieldSlaServiceRes = await genericListingRequest(
      routes.SLA_SERVICE_TIME,
      {
        all: true,
      }
    );
    const contractFieldSlaLevelRes = await genericListingRequest(
      routes.SLA_LEVEL,
      {
        all: true,
      }
    );

    contractTypeOptions.value = res?.data?.contractTypes?.map((ts: any) => {
      return { value: ts.id, name: ts.name };
    });

    productCategoriesData.value = prodCategoryRes?.data?.productCategories;

    contractFieldCustomerOptions.value =
      contractFieldCustomerRes?.data?.customers?.map((rs: any) => {
        return {
          value: rs?.id,
          name: rs?.name,
        };
      });

    contractFieldInvoiceOptions.value =
      contractFieldInvoiceRes?.data?.invoices?.map((rs: any) => {
        return {
          value: rs?.id,
          name: rs?.invoiceType, // need to change
        };
      });
    contractFieldOfferOptions.value = contractFieldOfferRes?.data?.map(
      (rs: any) => {
        return {
          value: rs?.id,
          name: rs?.offerType, //
        };
      }
    );
    contractFieldPROptions.value = contractFieldPRRes?.data?.records?.map(
      (rs: any) => {
        return {
          value: rs?.id,
          name: rs?.companyNumber,
        };
      }
    );
    contractFieldSlaServiceOptions.value =
      contractFieldSlaServiceRes?.data?.map((rs: any) => {
        return {
          value: rs?.id,
          name: rs?.name,
        };
      });
    contractFieldSlaLevelOptions.value = contractFieldSlaLevelRes?.data.map(
      (rs: any) => {
        return {
          value: rs?.id,
          name: rs?.name,
        };
      }
    );

    personInChargeOptions.value = personInChargeRes?.data?.employees.map(
      (rs: any) => {
        return {
          value: rs?.id,
          name: rs?.firstName,
        };
      }
    );

    specificGetRequest(routes.LIST_USERS, {
      limit_start: 1,
      limit_count: 500,
      type: 0,
    }).then((response) => {
      userOptions.value = response.data.map((user: any) => {
        return { value: user.id, name: user.first_name + " " + user.last_name };
      });
    });
  } catch (e) {
    console.log(e);
  }
});

// receiverOptions will populate on basic of receiverType
watch(
  () => state.receiverType,
  async (receiverType, receiverTypePrev) => {
    try {
      const receiverRes =
        receiverType === "customer"
          ? await genericListingRequest(routes.COMPANY, {
              all: true,
            })
          : await genericListingRequest(routes.LEAD, {
              all: true,
            });
      customerOptions.value =
        receiverType === "customer"
          ? receiverRes?.data?.customers?.map((rs: any) => {
              return {
                value: rs?.id,
                name: rs?.name,
              };
            })
          : receiverRes?.data?.leads?.map((rs: any) => {
              return {
                value: rs?.id,
                name: rs?.name,
              };
            });
      // if (receiverType !== receiverTypePrev && !props.recordId) {
      //   // when receiver type change, set the receiver/customerId to null
      //   state.customerId = null;
      // }
    } catch (e) {
      console.log(e);
    }
  }
);

watch(
  () => state.contractTypeId,
  async (contractType, contractTypePrev) => {
    try {
      const contractTypeRes = await genericListingRequest(
        routes.CONTRACT_ATTACHMENT,
        {
          contractTypeId: contractType,
        }
      );
      attachmentsData.value = contractTypeRes?.data?.attachments;
    } catch (e) {
      console.log(e);
    }
  }
);

const checkedAttachments = computed(() => {
  return attachmentsData.value?.filter((attachment) => attachment.checked);
});

watch(
  () => checkedAttachments.value,
  (checkedAttach) => {
    attachmentsState.splice(0, attachmentsState.length);
    const selectedAttachment = [];
    if (checkedAttach.length > 0) {
      checkedAttach.map((checkedVal) => {
        if (checkedVal.checked) {
          selectedAttachment.push({
            ...checkedVal,
            attachmentId: checkedVal.id,
            userId: "",
            startDate: "",
            terminationDate: "",
            signedDate: "",
            slaServiceTimeId: "",
            slaLevelId: "",
            // slaLevelChangeId: "8", // remove this later
            contractFields: checkedVal.contractFields.map((cf: any) => {
              return cf.type === "product"
                ? { id: cf.id, key: cf.key, type: cf.type, value: [] }
                : { id: cf.id, key: cf.key, type: cf.type, value: "" };
            }),
            products: [],
            productCategories: checkedVal.allowToAddSla ? productCategoriesData.value.map((pc) => {
              return { ...pc, checked: false}
            }) : []
            // productCategories: checkedVal.allowToAddSla
            //   ? [...productCategoriesData.value]
            //   : [],
          });
        }
      });
      attachmentsState.push(...selectedAttachment);
    }
  }
);

// Todo
// const selectedCategories = ref([]);
// function selectCategory(event, category) {
//   if (!!event.target.checked) {
//     selectedCategories.value.push(category);
//   } else {
//     let selectedCategoryIndex = selectedCategories.value.findIndex(
//       (cat) => cat.id == category.id
//     );
//     selectedCategories.value.splice(selectedCategoryIndex, 1);

//   }
// }

function changeProductCategory(event: any, attachIndex: any, categoryIndex: any) {
  debugger
  const value = event.target.checked;
  attachmentsState[attachIndex].productCategories[categoryIndex].checked =
    value;
}

const isModalOpen = ref(false);

function hideModal() {
  isModalOpen.value = false;
}

function openModal() {
  isModalOpen.value = true;
}

// open the add product modal
function addProductModal(parentIndex: any, childIndex: any, catId: any) {
  parentAttachmentIndex.value = parentIndex;
  childContractIndex.value = childIndex ?? null;
  categoryId.value = catId ?? null;
  isModalOpen.value = true;
}

// when product added from Add Product Modal
function productAdded(product, parentIndex, childIndex, addProductIn) {
  if (addProductIn === "contractFieldProd") {
    attachmentsState[parentIndex].contractFields[childIndex].value.push(
      ...product
    );
  } else if (addProductIn === "attachmentFieldProd") {
    attachmentsState[parentIndex].products.push(...product);
  }
}

// TODO: that is in progress
async function outbountContractHandler() {
  isSubmitted.value = true;
  v$.value.$touch();
  attachmentsStateValid.value.$touch();
  // if (v$.value.$invalid || contractFieldsValid.value.$invalid) {
  if (false) {
    return;
    isSubmitted.value = true;
  } else {
    layout.changeLoaderValue(true);
    // Delete the productCategories key value pair
    attachmentsState.map((at) => {
        delete at.productCategories
      }),
    apiRoute.value = routes.OUTBOUNDED_CONTRACT;
    const payload = {
      ...state,
      attachments: attachmentsState,
    };

    // TODO
    // attachmentId
    //   ? updateFunc(
    //       payload,
    //       attachmentId,
    //       "/settings/contract-management/attachments"
    //     )
    //   : storeFunc(payload, "/settings/contract-management/attachments");

    storeFunc(payload, "/contract-management/outbounded-contracts");

    layout.changeLoaderValue(false);
    isSubmitted.value = false;
  }
}


  const calculateTotalNetto = (table, index, nettoType, childComponent) => {
    // calculate total netto
    if (nettoType === "maintenance") {
      const productPrice =
        table.value[index].quantity * table.value[index].salePrice;
      table.value[index].totalNetto =
        (table.value[index].maintenanceRate / 100) *
        (table.value[index].quantity * productPrice);
    } else if (nettoType === "ams" || nettoType === "service") {
      const quantityMultiplyRate =
        table.value[index].quantity * table.value[index].hourlyRate;
      const discount =
        (table.value[index].discount / 100) * quantityMultiplyRate;

      table.value[index].taxRate =
        (table.value[index].tax / 100) * (quantityMultiplyRate - discount);

      table.value[index].totalNetto = quantityMultiplyRate - discount;
    } else if (nettoType === "childService") {
      let newHourlyRate = 0;
      childComponent.map((cc) => {
        newHourlyRate = newHourlyRate + cc.totalRate;
      });
      table.value[index].hourlyRate = newHourlyRate;
      const quantityMultiplyRate =
        table.value[index].quantity * table.value[index].hourlyRate;
      const discount =
        (table.value[index].discount / 100) * quantityMultiplyRate;
      table.value[index].taxRate =
        (table.value[index].tax / 100) * quantityMultiplyRate;

      table.value[index].totalNetto = quantityMultiplyRate - discount;
    } else if (nettoType === "hosting") {
      const quantityMultiplyPrice =
        table.value[index].quantity * table.value[index].pricePerPeriod;
      const discount =
        (table.value[index].discount / 100) * quantityMultiplyPrice;
      table.value[index].totalNetto = quantityMultiplyPrice - discount;
    } else if (nettoType === "childHosting") {
      let newPricePerPeriod = 0;
      childComponent.map((cc) => {
        newPricePerPeriod = newPricePerPeriod + cc.totalRate;
      });
      table.value[index].pricePerPeriod = newPricePerPeriod;
      const quantityMultiplyPrice =
        table.value[index].quantity * table.value[index].pricePerPeriod;
      const discount =
        (table.value[index].discount / 100) * quantityMultiplyPrice;
      table.value[index].totalNetto = quantityMultiplyPrice - discount;
    } else if (nettoType === "cloud") {
      const quantityDurationPrice =
        table.value[index].quantity *
        table.value[index].duration *
        table.value[index].salePrice;
      const discount =
        (table.value[index].discount / 100) * quantityDurationPrice;
      table.value[index].totalNetto = quantityDurationPrice - discount;
    } else if (nettoType === "childCloud") {
      let newSalePrice = 0;
      childComponent.map((cc) => {
        newSalePrice = newSalePrice + cc.totalRate;
      });
      table.value[index].salePrice = newSalePrice;
      const quantityDurationPrice =
        table.value[index].quantity *
        table.value[index].duration *
        table.value[index].salePrice;
      const discount =
        (table.value[index].discount / 100) * quantityDurationPrice;
      table.value[index].totalNetto = quantityDurationPrice - discount;
    } else {
      const quantityMultiplyPrice =
        table.value[index].quantity * table.value[index].salePrice;
      const discount =
        (table.value[index].discount / 100) * quantityMultiplyPrice;
      table.value[index].totalNetto = quantityMultiplyPrice - discount;
    }
  };

 const calculateProductValue = (
    event,
    attachIndex,
    contraIndex,
    rowIndex,
    changedValue,
  ) => {
    // QUANTITY
    debugger
    if (changedValue === "quantity") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].quantity = event.target.value;
      calculateTotalNetto(attachmentsState, attachIndex, contraIndex, rowIndex );
    } 
    // else if (
    //   componentType === "licencesOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalSoftwareLicencesTableData.value[index].quantity =
    //     event.target.value;
    //   calculateTotalNetto(optionalSoftwareLicencesTableData, index);
    // } else if (componentType === "maintenance" && changedValue === "quantity") {
    //   softwareMaintenanceTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
    // } else if (
    //   componentType === "maintenanceOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalSoftwareMaintenanceTableData.value[index].quantity =
    //     event.target.value;
    //   calculateTotalNetto(
    //     optionalSoftwareMaintenanceTableData,
    //     index,
    //     "maintenance"
    //   );
    // } else if (componentType === "ams" && changedValue === "quantity") {
    //   amsTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(amsTableData, index, "ams");
    // } else if (componentType === "amsOptional" && changedValue === "quantity") {
    //   optionalAmsTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(optionalAmsTableData, index, "ams");
    // } else if (componentType === "service" && changedValue === "quantity") {
    //   servicesTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(servicesTableData, index, "service");
    // } else if (
    //   componentType === "serviceOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalServicesTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(optionalServicesTableData, index, "service");
    // } else if (
    //   componentType === "childService" &&
    //   changedValue === "quantity"
    // ) {
    //   servicesTableData.value[index].childComponents[childIndex].quantity =
    //     event.target.value;
    //   servicesTableData.value[index].childComponents[childIndex].totalRate =
    //     servicesTableData.value[index].childComponents[childIndex].quantity *
    //     servicesTableData.value[index].childComponents[childIndex].hourlyRate;
    //   calculateTotalNetto(
    //     servicesTableData,
    //     index,
    //     "childService",
    //     servicesTableData.value[index].childComponents
    //   );
    // } else if (
    //   componentType === "serviceByCategory" &&
    //   changedValue === "quantity"
    // ) {
    //   servicesTableDataByCategory.value[index].quantity = event.target.value;
    //   calculateTotalNetto(servicesTableDataByCategory, index, "service");
    // } else if (
    //   componentType === "serviceByCategoryOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalServicesTableDataByCategory.value[index].quantity =
    //     event.target.value;
    //   calculateTotalNetto(
    //     optionalServicesTableDataByCategory,
    //     index,
    //     "service"
    //   );
    // } else if (componentType === "hosting" && changedValue === "quantity") {
    //   hostingTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(hostingTableData, index, "hosting");
    // } else if (
    //   componentType === "hostingOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalHostingTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(optionalHostingTableData, index, "hosting");
    // } else if (
    //   componentType === "childHosting" &&
    //   changedValue === "quantity"
    // ) {
    //   hostingTableData.value[index].childComponents[childIndex].quantity =
    //     event.target.value;
    //   hostingTableData.value[index].childComponents[childIndex].totalRate =
    //     hostingTableData.value[index].childComponents[childIndex].quantity *
    //     hostingTableData.value[index].childComponents[childIndex]
    //       .pricePerPeriod;
    //   calculateTotalNetto(
    //     hostingTableData,
    //     index,
    //     "childHosting",
    //     hostingTableData.value[index].childComponents
    //   );
    // } else if (componentType === "cloud" && changedValue === "quantity") {
    //   cloudTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(cloudTableData, index, "cloud");
    // } else if (
    //   componentType === "cloudOptional" &&
    //   changedValue === "quantity"
    // ) {
    //   optionalCloudTableData.value[index].quantity = event.target.value;
    //   calculateTotalNetto(optionalCloudTableData, index, "cloud");
    // } else if (componentType === "childCloud" && changedValue === "quantity") {
    //   cloudTableData.value[index].childComponents[childIndex].quantity =
    //     event.target.value;
    //   cloudTableData.value[index].childComponents[childIndex].totalRate =
    //     cloudTableData.value[index].childComponents[childIndex].quantity *
    //     cloudTableData.value[index].childComponents[childIndex].duration *
    //     cloudTableData.value[index].childComponents[childIndex].salePrice;
    //   calculateTotalNetto(
    //     cloudTableData,
    //     index,
    //     "childCloud",
    //     cloudTableData.value[index].childComponents
    //   );
    // }

    // /// SALE PRICE
    else if (changedValue === "salePrice") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].salePrice = event.target.value;
      // calculateTotalNetto(softwareLicencesTableData, index);
    } 
    //else if (
    //   componentType === "licencesOptional" &&
    //   changedValue === "salePrice"
    // ) {
    //   optionalSoftwareLicencesTableData.value[index].salePrice =
    //     event.target.value;
    //   calculateTotalNetto(optionalSoftwareLicencesTableData, index);
    // } else if (componentType === "cloud" && changedValue === "salePrice") {
    //   cloudTableData.value[index].salePrice = event.target.value;
    //   calculateTotalNetto(cloudTableData, index, "cloud");
    // } else if (
    //   componentType === "cloudOptional" &&
    //   changedValue === "salePrice"
    // ) {
    //   optionalCloudTableData.value[index].salePrice = event.target.value;
    //   calculateTotalNetto(optionalCloudTableData, index, "cloud");
    // } else if (componentType === "childCloud" && changedValue === "salePrice") {
    //   cloudTableData.value[index].childComponents[childIndex].salePrice =
    //     event.target.value;
    //   cloudTableData.value[index].childComponents[childIndex].totalRate =
    //     cloudTableData.value[index].childComponents[childIndex].quantity *
    //     cloudTableData.value[index].childComponents[childIndex].duration *
    //     cloudTableData.value[index].childComponents[childIndex].salePrice;
    //   calculateTotalNetto(
    //     cloudTableData,
    //     index,
    //     "childCloud",
    //     cloudTableData.value[index].childComponents
    //   );
    // }

    // // DISCOUNT
    else if (changedValue === "discount") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].discount = event.target.value;
      // calculateTotalNetto(softwareLicencesTableData, index);
    } 
    //else if (
    //   componentType === "licencesOptional" &&
    //   changedValue === "discount"
    // ) {
    //   optionalSoftwareLicencesTableData.value[index].discount =
    //     event.target.value;
    //   calculateTotalNetto(optionalSoftwareLicencesTableData, index);
    // } else if (componentType === "ams" && changedValue === "discount") {
    //   amsTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(amsTableData, index, "ams");
    // } else if (componentType === "amsOptional" && changedValue === "discount") {
    //   optionalAmsTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(optionalAmsTableData, index, "ams");
    // } else if (componentType === "service" && changedValue === "discount") {
    //   servicesTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(servicesTableData, index, "service");
    // } else if (
    //   componentType === "serviceOptional" &&
    //   changedValue === "discount"
    // ) {
    //   optionalServicesTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(optionalServicesTableData, index, "service");
    // } else if (
    //   componentType === "serviceByCategory" &&
    //   changedValue === "discount"
    // ) {
    //   servicesTableDataByCategory.value[index].discount = event.target.value;
    //   calculateTotalNetto(servicesTableDataByCategory, index, "service");
    // } else if (
    //   componentType === "serviceByCategoryOptional" &&
    //   changedValue === "discount"
    // ) {
    //   optionalServicesTableDataByCategory.value[index].discount =
    //     event.target.value;
    //   calculateTotalNetto(
    //     optionalServicesTableDataByCategory,
    //     index,
    //     "service"
    //   );
    // } else if (componentType === "hosting" && changedValue === "discount") {
    //   hostingTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(hostingTableData, index, "hosting");
    // } else if (
    //   componentType === "hostingOptional" &&
    //   changedValue === "discount"
    // ) {
    //   optionalHostingTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(optionalHostingTableData, index, "hosting");
    // } else if (componentType === "cloud" && changedValue === "discount") {
    //   cloudTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(cloudTableData, index, "cloud");
    // } else if (
    //   componentType === "cloudOptional" &&
    //   changedValue === "discount"
    // ) {
    //   optionalCloudTableData.value[index].discount = event.target.value;
    //   calculateTotalNetto(optionalCloudTableData, index, "cloud");
    // }

    // // MAINTENANCE RATE
    // else if (
    //   componentType === "maintenance" &&
    //   changedValue === "maintenanceRate"
    // ) {
    //   softwareMaintenanceTableData.value[index].maintenanceRate =
    //     event.target.value;
    //   calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
    // } else if (
    //   componentType === "maintenanceOptional" &&
    //   changedValue === "maintenanceRate"
    // ) {
    //   optionalSoftwareMaintenanceTableData.value[index].maintenanceRate =
    //     event.target.value;
    //   calculateTotalNetto(
    //     optionalSoftwareMaintenanceTableData,
    //     index,
    //     "maintenance"
    //   );
    // }
    // // HOURLY RATE
    else if (changedValue === "hourlyRate") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].hourlyRate = event.target.value;
      // calculateTotalNetto(amsTableData, index, "ams");
    } 
    //else if (
    //   componentType === "amsOptional" &&
    //   changedValue === "hourlyRate"
    // ) {
    //   optionalAmsTableData.value[index].hourlyRate = event.target.value;
    //   calculateTotalNetto(optionalAmsTableData, index, "ams");
    // } else if (componentType === "service" && changedValue === "hourlyRate") {
    //   servicesTableData.value[index].hourlyRate = event.target.value;
    //   calculateTotalNetto(servicesTableData, index, "service");
    // } else if (
    //   componentType === "serviceOptional" &&
    //   changedValue === "hourlyRate"
    // ) {
    //   optionalServicesTableData.value[index].hourlyRate = event.target.value;
    //   calculateTotalNetto(optionalServicesTableData, index, "service");
    // } else if (
    //   componentType === "childService" &&
    //   changedValue === "hourlyRate"
    // ) {
    //   servicesTableData.value[index].childComponents[childIndex].hourlyRate =
    //     event.target.value;
    //   servicesTableData.value[index].childComponents[childIndex].totalRate =
    //     servicesTableData.value[index].childComponents[childIndex].quantity *
    //     servicesTableData.value[index].childComponents[childIndex].hourlyRate;
    //   calculateTotalNetto(
    //     servicesTableData,
    //     index,
    //     "childService",
    //     servicesTableData.value[index].childComponents
    //   );
    // } else if (
    //   componentType === "serviceByCategory" &&
    //   changedValue === "hourlyRate"
    // ) {
    //   servicesTableDataByCategory.value[index].hourlyRate = event.target.value;
    //   calculateTotalNetto(servicesTableDataByCategory, index, "service");
    // } else if (
    //   componentType === "serviceByCategoryOptional" &&
    //   changedValue === "hourlyRate"
    // ) {
    //   optionalServicesTableDataByCategory.value[index].hourlyRate =
    //     event.target.value;
    //   calculateTotalNetto(
    //     optionalServicesTableDataByCategory,
    //     index,
    //     "service"
    //   );
    // }
    // // PRICE PER PERIOD
    else if (changedValue === "pricePerPeriod") {
     attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].pricePerPeriod = event.target.value;
      // calculateTotalNetto(hostingTableData, index, "hosting");
    } 
    //else if (
    //   componentType === "hostingOptional" &&
    //   changedValue === "pricePerPeriod"
    // ) {
    //   optionalHostingTableData.value[index].pricePerPeriod = event.target.value;
    //   calculateTotalNetto(optionalHostingTableData, index, "hosting");
    // } else if (
    //   componentType === "childHosting" &&
    //   changedValue === "pricePerPeriod"
    // ) {
    //   hostingTableData.value[index].childComponents[childIndex].pricePerPeriod =
    //     event.target.value;
    //   hostingTableData.value[index].childComponents[childIndex].totalRate =
    //     hostingTableData.value[index].childComponents[childIndex].quantity *
    //     hostingTableData.value[index].childComponents[childIndex]
    //       .pricePerPeriod;
    //   calculateTotalNetto(
    //     hostingTableData,
    //     index,
    //     "childHosting",
    //     hostingTableData.value[index].childComponents
    //   );
    // }
    // // DURATION
    else if (changedValue === "duration") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].duration = event.target.value;
      // calculateTotalNetto(cloudTableData, index, "cloud");
    } 
    // else if (
    //   componentType === "cloudOptional" &&
    //   changedValue === "duration"
    // ) {
    //   optionalCloudTableData.value[index].duration = event.target.value;
    //   calculateTotalNetto(optionalCloudTableData, index, "cloud");
    // } else if (componentType === "childCloud" && changedValue === "duration") {
    //   cloudTableData.value[index].childComponents[childIndex].duration =
    //     event.target.value;
    //   cloudTableData.value[index].childComponents[childIndex].totalRate =
    //     cloudTableData.value[index].childComponents[childIndex].quantity *
    //     cloudTableData.value[index].childComponents[childIndex].duration *
    //     cloudTableData.value[index].childComponents[childIndex].salePrice;
    //   calculateTotalNetto(
    //     cloudTableData,
    //     index,
    //     "childCloud",
    //     cloudTableData.value[index].childComponents
    //   );
    // }
    // // TAX
    else if (changedValue === "tax") {
      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].tax = event.target.value;

      // servicesTableData.value[index].tax = event.target.value;
      // const quantityMultpilyRate =
      //   servicesTableData.value[index].quantity *
      //   servicesTableData.value[index].hourlyRate;
      // const discount =
      //   quantityMultpilyRate -
      //   (servicesTableData.value[index].discount / 100) * quantityMultpilyRate;
      // servicesTableData.value[index].taxRate =
      //   (servicesTableData.value[index].tax / 100) * discount;
    } 
    // else if (componentType === "serviceOptional" && changedValue === "tax") {
    //   optionalServicesTableData.value[index].tax = event.target.value;
    //   const quantityMultpilyRate =
    //     optionalServicesTableData.value[index].quantity *
    //     optionalServicesTableData.value[index].hourlyRate;
    //   const discount =
    //     quantityMultpilyRate -
    //     (optionalServicesTableData.value[index].discount / 100) *
    //       quantityMultpilyRate;
    //   optionalServicesTableData.value[index].taxRate =
    //     (optionalServicesTableData.value[index].tax / 100) * discount;
    // } else if (
    //   componentType === "serviceByCategory" &&
    //   changedValue === "tax"
    // ) {
    //   servicesTableDataByCategory.value[index].tax = event.target.value;
    //   const quantityMultpilyRate =
    //     servicesTableDataByCategory.value[index].quantity *
    //     servicesTableDataByCategory.value[index].hourlyRate;
    //   const discount =
    //     quantityMultpilyRate -
    //     (servicesTableDataByCategory.value[index].discount / 100) *
    //       quantityMultpilyRate;
    //   servicesTableDataByCategory.value[index].taxRate =
    //     (servicesTableDataByCategory.value[index].tax / 100) * discount;
    // } else if (
    //   componentType === "serviceByCategoryOptional" &&
    //   changedValue === "tax"
    // ) {
    //   optionalServicesTableDataByCategory.value[index].tax = event.target.value;
    //   const quantityMultpilyRate =
    //     optionalServicesTableDataByCategory.value[index].quantity *
    //     optionalServicesTableDataByCategory.value[index].hourlyRate;
    //   const discount =
    //     quantityMultpilyRate -
    //     (optionalServicesTableDataByCategory.value[index].discount / 100) *
    //       quantityMultpilyRate;
    //   optionalServicesTableDataByCategory.value[index].taxRate =
    //     (optionalServicesTableDataByCategory.value[index].tax / 100) * discount;
    // }
    // // TAX RATE
    else if (changedValue === "taxRate") {

      attachmentsState[attachIndex].contractFields[contraIndex].value[rowIndex].taxRate = event.target.value;

      // servicesTableData.value[index].taxRate = event.target.value;
      // servicesTableData.value[index].hourlyRate =
      //   (servicesTableData.value[index].taxRate * 100) /
      //   servicesTableData.value[index].tax /
      //   servicesTableData.value[index].quantity;
      // calculateTotalNetto(servicesTableData, index, "service");
    } 
    // else if (
    //   componentType === "serviceOptional" &&
    //   changedValue === "taxRate"
    // ) {
    //   optionalServicesTableData.value[index].taxRate = event.target.value;
    //   optionalServicesTableData.value[index].hourlyRate =
    //     (optionalServicesTableData.value[index].taxRate * 100) /
    //     optionalServicesTableData.value[index].tax /
    //     optionalServicesTableData.value[index].quantity;
    //   calculateTotalNetto(optionalServicesTableData, index, "service");
    // } else if (
    //   componentType === "serviceByCategory" &&
    //   changedValue === "taxRate"
    // ) {
    //   servicesTableDataByCategory.value[index].taxRate = event.target.value;
    //   servicesTableDataByCategory.value[index].hourlyRate =
    //     (servicesTableDataByCategory.value[index].taxRate * 100) /
    //     servicesTableDataByCategory.value[index].tax /
    //     servicesTableDataByCategory.value[index].quantity;
    //   calculateTotalNetto(servicesTableDataByCategory, index, "service");
    // } else if (
    //   componentType === "serviceByCategoryOptional" &&
    //   changedValue === "taxRate"
    // ) {
    //   optionalServicesTableDataByCategory.value[index].taxRate =
    //     event.target.value;
    //   optionalServicesTableDataByCategory.value[index].hourlyRate =
    //     (optionalServicesTableDataByCategory.value[index].taxRate * 100) /
    //     optionalServicesTableDataByCategory.value[index].tax /
    //     optionalServicesTableDataByCategory.value[index].quantity;
    //   calculateTotalNetto(
    //     optionalServicesTableDataByCategory,
    //     index,
    //     "service"
    //   );
    // }
    
  };
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
        <elements-Tooltip :label="''" />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.receiverType"
                :options="receiverTypeOptions"
                :key="state.receiverType"
                label="name"
                track-by="value"
                :required="true"
                :textLabel="$t('Reciever Type')"
              />
            </div>
            <div v-if="v$.receiverType.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.receiverType.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.customerId"
                :options="customerOptions"
                :key="state.customerId"
                label="name"
                track-by="value"
                :required="true"
                :textLabel="$t('Reciever')"
              />
            </div>
            <div v-if="v$.customerId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.customerId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <label>{{ $t("Attachments") }}:</label>
            <div
              v-for="(attachment, index) in attachmentsData"
              :key="'attachment-' + attachment.id"
              class="flex py-1"
            >
              <input
                class="mr-2 mt-1"
                :checked="attachment.checked"
                v-model="attachment.checked"
                type="checkbox"
              />
              <label
                >{{ $t("Attachment") + " " + (index + 1) }}.&nbsp;<span>{{
                  attachment.name
                }}</span></label
              >
            </div>
            <div v-if="!attachmentsData?.length">
              <p class="text-xs text-gray-500">
                {{ $t("No attachments found") }}
              </p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.contractTypeId"
                :options="contractTypeOptions"
                :key="state.contractTypeId"
                :required="true"
                label="name"
                track-by="value"
                :textLabel="$t('Contract Type')"
              />
            </div>
            <div v-if="v$.contractTypeId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.contractTypeId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.personInCharge"
                :options="personInChargeOptions"
                :key="state.personInCharge"
                label="name"
                track-by="value"
                :required="true"
                :textLabel="$t('Person in charge')"
              />
            </div>
            <div v-if="v$.personInCharge.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.personInCharge.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ValidateEach
      v-for="(attachment, attachmentIndex) in attachmentsState"
      :key="attachmentIndex"
      :state="attachment"
      :rules="attachmentsStateValidation"
    >
      <template #default="{ v }">
        <div class="accordion mt-3">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <p v-if="attachment.attachmentNumber" class="self-center">
                  {{ attachment.attachmentNumber }}
                </p>
                <p v-else class="self-center">
                  {{ attachment.prefix }}{{ new Date().getFullYear() }}-XXXXXX
                </p>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <div class="row">
                  <div class="col-lg-8"></div>

                  <div class="col-lg-4" v-if="attachment.selectUser">
                    <div class="form-group">
                      <Multiselect
                        v-model="v.userId.$model"
                        placeholder="Offer"
                        label="name"
                        :options="userOptions"
                      >
                        <template v-slot:beforelist>
                          <div
                            class="d-flex justify-content-between"
                            :style="' width: 100%'"
                          >
                            <p>{{ $t("First Name") }}</p>
                            <p>{{ $t("Last Name") }}</p>
                          </div>
                        </template>

                        <template v-slot:singlelabel="{ value }">
                          <div class="multiselect-single-label">
                            <p>{{ value.name }}</p>
                          </div>
                        </template>

                        <template v-slot:option="{ option }">
                          <div
                            class="d-flex justify-content-between"
                            :style="' width: 100%'"
                          >
                            <p>
                              {{ option.name.split(/(\s+)/)[0] }}
                            </p>
                            <p>
                              {{ option.name.split(/(\s+)/)[2] }}
                            </p>
                          </div>
                        </template>
                      </Multiselect>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4">
                    <div class="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <elements-input
                          v-model="v.startDate.$model"
                          :label="$t('Start Date')"
                          :required="true"
                          id="startDate"
                          :class="{ 'is-invalid': v.startDate.$error }"
                          type="date"
                        />
                      </div>
                      <div
                        v-for="(error, errorIndex) in v.startDate.$errors"
                        :key="errorIndex"
                        class="invalid-feedback"
                      >
                        <span class="text-danger" v-if="error.$message"
                          >{{ error.$message }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-4">
                    <div class="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <elements-input
                          v-model="v.terminationDate.$model"
                          :label="$t('Termination Date')"
                          id="terminationDate"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-4">
                    <div class="form-group">
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <elements-input
                          v-model="v.signedDate.$model"
                          :label="$t('Signed Date')"
                          id="signedDate"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="row"
                  v-for="(
                    attachmentContract, contractIndex
                  ) in attachment.contractFields"
                  :key="contractIndex"
                >
                  <!-- key -->
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-input
                        v-model="attachmentContract.key"
                        :label="$t('Key')"
                        id="contractKey"
                        :disabled="true"
                      />
                    </div>
                  </div>

                  <!-- Value -->
                  <div class="col-lg-4">
                    <div
                      class="form-group"
                      v-if="attachmentContract.type === 'text'"
                    >
                      <elements-input
                        v-model="attachmentContract.value"
                        :label="$t('Value')"
                        id="contractValue"
                        :required="true"
                        :class="{
                          'is-invalid':
                            isSubmitted && !attachmentContract.value,
                        }"
                      />
                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div
                      class="form-group"
                      v-if="attachmentContract.type === 'number'"
                    >
                      <elements-input
                        v-model="attachmentContract.value"
                        :label="$t('Value')"
                        id="contractValue"
                        :required="true"
                        type="number"
                        :class="{
                          'is-invalid':
                            isSubmitted && !attachmentContract.value,
                        }"
                      />
                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div
                      class="form-group"
                      v-if="attachmentContract.type === 'date'"
                    >
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'dateIcon'" />
                          </span>
                        </div>
                        <elements-input
                          v-model="attachmentContract.value"
                          :label="$t('Value')"
                          :required="true"
                          id="contractValue"
                          :class="{
                            'is-invalid':
                              isSubmitted && !attachmentContract.value,
                          }"
                          type="date"
                        />
                      </div>
                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div
                      class="form-group"
                      v-if="attachmentContract.type === 'time'"
                    >
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <ElementsIcon v-bind:icon="'clockIcon'" />
                          </span>
                        </div>
                        <elements-input
                          v-model="attachmentContract.value"
                          :label="$t('Value')"
                          :required="true"
                          id="contractValueTime"
                          :class="{
                            'is-invalid':
                              isSubmitted && !attachmentContract.value,
                          }"
                          type="time"
                        />
                      </div>
                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div v-if="attachmentContract.type === 'customer'">
                      <div class="form-group">
                        <elements-multiselect
                          v-model="attachmentContract.value"
                          :options="contractFieldCustomerOptions"
                          :key="attachmentContract.value"
                          label="name"
                          track-by="value"
                          :required="true"
                          :textLabel="$t('Customer')"
                        />
                      </div>

                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div v-if="attachmentContract.type === 'invoice'">
                      <div class="form-group">
                        <elements-multiselect
                          v-model="attachmentContract.value"
                          :options="contractFieldInvoiceOptions"
                          :key="attachmentContract.value"
                          label="name"
                          track-by="value"
                          :required="true"
                          :textLabel="$t('Invoice')"
                        />
                      </div>

                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div v-if="attachmentContract.type === 'offer'">
                      <div class="form-group">
                        <elements-multiselect
                          v-model="attachmentContract.value"
                          :options="contractFieldOfferOptions"
                          :key="attachmentContract.value"
                          label="name"
                          track-by="value"
                          :required="true"
                          :textLabel="$t('Offer')"
                        />
                      </div>

                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>

                    <div
                      v-if="attachmentContract.type === 'performance_record'"
                    >
                      <div class="form-group">
                        <elements-multiselect
                          v-model="attachmentContract.value"
                          :options="contractFieldPROptions"
                          :key="attachmentContract.value"
                          label="name"
                          track-by="value"
                          :required="true"
                          :textLabel="$t('Performance Record')"
                        />
                      </div>

                      <div
                        v-if="isSubmitted && !attachmentContract.value"
                        class="invalid-feedback"
                      >
                        <span class="text-danger">{{
                          $t("This value is required")
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="col-lg-12"
                    v-if="attachmentContract.type === 'product'"
                  >
                    <div
                      class="d-flex align-items-center justify-content-between mt-3"
                    >
                      <h3 class="card-title">{{ attachmentContract.key }}</h3>
                      <button
                        class="secondary-btn"
                        @click="
                          addProductModal(attachmentIndex, contractIndex, null)
                        "
                      >
                        Add Product
                      </button>
                    </div>
                    <!-- {{ attachmentContract.value }} -->
                    <product-table
                      :contractFieldsTableData="attachmentContract.value"
                      :softwareLicencesSummery="softwareLicencesSummery"
                      :attachmentIndex = "attachmentIndex"
                      :contractIndex = "contractIndex"
                      @additiontalDescToggle="additiontalDescToggle"
                      @calculateProductValue="calculateProductValue"
                    />
                  </div>
                </div>

                <div class="col-lg-4 mt-5" v-if="attachment.allowToAddSla">
                  <!-- {{ attachment.productCategories }} -->
                  <span
                    v-for="(category, categoryIndex) in attachment.productCategories"
                    :key="'product-category-' + categoryIndex"
                    class="mr-5"
                  >
                    <input
                      @input="changeProductCategory($event, attachmentIndex, categoryIndex)"
                      :key="category.checked"
                      :checked="category.checked"
                      :id="'product-category-' + category.id"
                      type="checkbox"
                    />
                    <label> {{ category.name }} </label>
                  </span>

                </div>

                <div v-if="attachment.allowToAddSla">
                  <div
                    v-for="(category, index) in attachment.productCategories"
                    :key="'product-category-' + category.id"
                  >
                    <div v-if="category.checked" class="row mt-5">
                      <div class="col-lg-12 flex justify-content-between">
                        <h3 class="card-title">{{ category.name }}</h3>
                        <button
                          class="secondary-btn"
                          @click="
                            addProductModal(attachmentIndex, null, category.id)
                          "
                        >
                          Add Product
                        </button>
                      </div>

                      <div class="col-lg-12">
                        <ams-product-table
                          :attachmentFieldsTableData="attachment.products"
                          :softwareLicencesSummery="softwareLicencesSummery"
                          :category="category"
                          @additiontalDescToggle="additiontalDescToggle"
                          @calculateProductValue="calculateProductValue"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mt-5" v-if="attachment.allowToAddSla">
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="v.slaServiceTimeId.$model"
                        :options="contractFieldSlaServiceOptions"
                        :key="v.slaServiceTimeId.$model"
                        label="name"
                        track-by="value"
                        :required="true"
                        :textLabel="$t('SLA Service Time')"
                      />
                    </div>
                    <div
                      v-for="(error, errorIndex) in v.slaServiceTimeId.$errors"
                      :key="errorIndex"
                      class="invalid-feedback"
                    >
                      <span class="text-danger" v-if="error.$message"
                        >{{ error.$message }}
                      </span>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <elements-multiselect
                        v-model="v.slaLevelId.$model"
                        :options="contractFieldSlaLevelOptions"
                        :key="v.slaLevelId.$model"
                        label="name"
                        track-by="value"
                        :required="true"
                        :textLabel="$t('SLA Level')"
                      />
                    </div>
                    <div
                      v-for="(error, errorIndex) in v.slaLevelId
                        .$errors"
                      :key="errorIndex"
                      class="invalid-feedback"
                    >
                      <span class="text-danger" v-if="error.$message"
                        >{{ error.$message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ValidateEach>

    <div class="card mt-3">
      <div class="card-header d-flex align-items-center">
        <h3 class="card-title me-2">{{ $t("Company Details") }}</h3>
      </div>
      <div class="card-body">
        <div class="row mt-2">
          <div class="col-lg-6">
            <p>ALTUS AG</p>
            <p>Kleinoberfeld 55</p>
            <p>76135 Karlsruhe</p>
            <p>Baden-Württemberg</p>
            <p>Deutschland</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3 d-flex align-items-center justify-content-end">
      <button
        class="primary-btn me-3"
        @click="navigateTo('/contract-management/outbounded-contracts')"
      >
        <elements-icon v-bind:icon="'cancelIcon'" class="me-2" />
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button
        @click="outbountContractHandler"
        :isLoading="submitted"
        :iconName="'saveIcon'"
        :buttonName="$t('Save and Proceed')"
      />
    </div>

    <!-- add product modal -->
    <add-product
      v-if="
        isModalOpen &&
        parentAttachmentIndex !== null &&
        childContractIndex !== null
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :attachmentIndex="parentAttachmentIndex"
      :contractIndex="childContractIndex"
      @productAdded="productAdded"
    />

    <!-- ams product modal -->

    <add-ams-product
      v-if="
        isModalOpen && parentAttachmentIndex !== null && categoryId !== null
      "
      :categoryId="categoryId"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :attachmentIndex="parentAttachmentIndex"
      @productAdded="productAdded"
    />
  </div>
</template>

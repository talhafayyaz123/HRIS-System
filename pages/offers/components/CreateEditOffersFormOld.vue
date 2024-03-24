<script setup lang="ts">
// TODO: Delete this conponent once code approved
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { genericListingRequest } from "~/utils/apiRequests";
import { routes } from "~/utils/apiRoutes";

import {
  customerRequest,
  leadRequest,
  addSaleOfferRequest,
  editSaleOfferRequest,
  getSaleOfferRequest,
  customerLicenseRequest,
  listSlaInfrastructureRequest,
  listSlaServiceTimesRequest,
  listSlaLevelRequest,
  getUserListFromComsumerIdRequest,
  getProjectsFromComsumerIdRequest,
  invoicePdfGenerationRequest,
  docSelectedListRequest,
} from "~/utils/apiRequests";

const props = defineProps(["recordId"]);

const { router, Toast } = commonCode(),
  { t } = useI18n(),
  state = reactive({
    logedinUserId: localStorage.getItem("user_id"), // NOT FOR API
    receiverType: "",
    customerId: "", // receiver
    contactPersonId: null,
    termOfPaymentId: null,
    projectId: null,
    offerType: "budget_offer",
    template: "",
    groupBy: "nothing",
    expiryDate: "",
    orderStatus: "draft",
    offerStatus: "",
    paymentTerm: "",
    coverLetterText: "",
    descriptionText: "",
    removeFromStatistics: false,
    company: null, //
    term: null, //
    contactPerson: null, // first name and last name
    plannedStartDate: new Date(), //
    user: null, // loggedin user
    offerNumber: "", // off number of record like service
    selectedOffer: "", // no need
    createdBy: localStorage.getItem("user_id"), // having loggedin user id
  }),
  // offerType = ref("budget_offer"),
  isModalOpen = ref(false),
  isLoading = ref(false),
  productType = ref([]),
  selectedComponentType = ref(""),
  parentComponentIndex = ref(null), // used when adding childComponents to any parent object
  receiverTypeOptions = [
    { value: "customer", name: "Customer" },
    { value: "lead", name: "Lead" },
  ],
  receiverOptions = ref([]),
  contactPersonOptions = ref([]),
  termOfPaymentOptions = ref([]),
  projectOptions = ref([]),
  offerTypeOptions = [
    { value: "budget_offer", name: "Budget Offer" },
    { value: "offer", name: "Offer" },
  ],
  templateOptions = [
    { value: "empty", name: "Empty" },
    { value: "project", name: "Project" },
  ],
  groupedByOptions = [
    { value: "nothing", name: "Nothing" },
    { value: "category", name: "Category" },
  ],
  statusOptions = [
    { value: "entwurf", name: "Entwurf" },
    { value: "versendet", name: "Versendet" },
    { value: "beauftragt", name: "Beauftragt" },
    { value: "abgelehnt", name: "Abgelehnt" },
  ],
  companyDetail = reactive({
    companyName: "",
    companyNumber: "",
    contactPerson: "",
    address: "",
    code: "",
    city: "",
    state: "",
    country: "",
  }),
  validationRules = {
    receiverType: { required },
    customerId: { required },
    termOfPaymentId: { required },
    offerType: { required },
    expiryDate: { required },
    offerStatus: { required },
  },
  v$ = useVuelidate(validationRules, state);

const softwareLicencesTableData = ref([]);
const optionalSoftwareLicencesTableData = ref([]);

const softwareMaintenanceTableData = ref([]);
const optionalSoftwareMaintenanceTableData = ref([]);

const servicesTableData = ref([]);
const optionalServicesTableData = ref([]);

// populate state when edit offer and  groupBy is category aus use it when groupBy is noting
const servicesTableCategoryForEdit = ref([]);
const optionalServicesTableCategoryForEdit = ref([]);

const servicesTableDataByCategory = ref([]);
const optionalServicesTableDataByCategory = ref([]);

const amsTableData = ref([]);
const optionalAmsTableData = ref([]);

const hostingTableData = ref([]);
const optionalHostingTableData = ref([]);

const cloudTableData = ref([]);
const optionalCloudTableData = ref([]);

const softwareLicencesSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const softwareMaintenanceSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const serviceSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const serviceSummeryByCategory = reactive({
  netto: null,
  tax: [],
  total: null,
});
const amsSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const hostingSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
const cloudSummery = reactive({
  netto: null,
  tax: [],
  total: null,
});
function hideModal() {
  isModalOpen.value = false;
}
function showModal() {
  isModalOpen.value = true;
}

// For edit case fetch the record
onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    const res = await getSaleOfferRequest(props.recordId);
    const {
      receiverType,
      customer,
      contactPersonId,
      termOfPayment,
      projectId,
      offerType,
      template,
      groupBy,
      expiryDate,
      offerStatus,
      paymentTerm,
      coverLetterText,
      descriptionText,
      productComponents,
      optionalProductComponents,
    } = res.data;
    state.receiverType = receiverType;
    state.customerId = customer.id;
    state.contactPersonId = contactPersonId;
    state.termOfPaymentId = termOfPayment.id;
    state.projectId = projectId;
    state.offerType = offerType;
    state.template = template;
    state.groupBy = groupBy;
    state.expiryDate = expiryDate;
    state.offerStatus = offerStatus;
    state.paymentTerm = paymentTerm;
    state.coverLetterText = coverLetterText;
    state.descriptionText = descriptionText;

    softwareLicencesTableData.value =
      productComponents.license && productComponents.license.length > 0
        ? productComponents.license.map((licance: any) => {
            return {
              type: "license",
              componentId: licance?.id ?? "",
              productId: licance.productId,
              articleNumber: licance.articleNumber,
              name: licance.name,
              quantity: licance.quantity,
              salePrice: licance.salePrice,
              discount: licance.discount,
              maintenanceRate: licance.maintenanceRate,
              totalNetto: licance.totalNetto,
              tax: licance.tax,
              additionDescription: licance.additionDescription,
              ...(licance.additionDescription && {
                descriptionToggle: true,
              }),
            };
          })
        : [];
    softwareMaintenanceTableData.value =
      productComponents.maintenance && productComponents.maintenance.length > 0
        ? productComponents.maintenance.map((maintenance: any) => {
            return {
              type: "maintenance",
              componentId: maintenance?.id ?? "",
              productId: maintenance.productId,
              articleNumber: maintenance.articleNumber,
              name: maintenance.name,
              quantity: maintenance.quantity,
              salePrice: maintenance.salePrice,
              discount: maintenance.discount,
              maintenanceRate: maintenance.maintenanceRate,
              totalNetto: maintenance.totalNetto,
              tax: maintenance.tax,
              additionDescription: maintenance.additionDescription,
              ...(maintenance.additionDescription && {
                descriptionToggle: true,
              }),
            };
          })
        : [];
    servicesTableData.value =
      state.groupBy === "nothing" &&
      productComponents.service &&
      productComponents.service.length > 0
        ? productComponents.service.map((service: any) => {
            return {
              type: "service",
              componentId: service?.id ?? "",
              productId: service.productId,
              articleNumber: service.articleNumber,
              name: service.name,
              quantity: service.quantity,
              unit: service?.productUnit?.name, // not coming from backend
              hourlyRate: service.hourlyRate,
              discount: service.discount,
              tax: service.tax,
              taxRate: service.tax,
              totalNetto: service.totalNetto,
              totalRate: service.taxRate, // that of child
              additionDescription: service.additionDescription,
              ...(service.additionDescription && {
                descriptionToggle: true,
              }),
              productCategory: service.productCategory,
              childComponents:
                service.childComponents &&
                service.childComponents.length > 0 &&
                service.childComponents.map((childService) => {
                  return {
                    type: "service",
                    componentId: childService?.id ?? "",
                    productId: childService.productId,
                    articleNumber: childService.articleNumber,
                    name: childService.name,
                    quantity: childService.quantity,
                    unit: childService?.productUnit?.name, // not coming from backend
                    hourlyRate: childService.hourlyRate,
                    discount: childService.discount,
                    tax: childService.tax,
                    taxRate: childService.tax,
                    totalNetto: childService.totalNetto,
                    totalRate: childService.taxRate, // that of child
                    productCategory: childService.productCategory,
                  };
                }),
            };
          })
        : [];

    // servicesTableDataByCategory.value =
    //   (state.groupBy === "category" &&
    //   productComponents.service &&
    //   productComponents.service.length > 0) ?
    //   productComponents.service.map((serviceCategory) => {
    //     return {
    //       // ...serviceCategory,
    //       type: "service",
    //       name: serviceCategory.productCategory.name,
    //       products: serviceCategory.products,
    //       productIds: serviceCategory.productIds,
    //       productCategoryId: serviceCategory.productCategory.id,
    //       quantity: serviceCategory.quantity,
    //       unit: serviceCategory.unit,
    //       hourlyRate: serviceCategory.hourlyRate,
    //       discount: serviceCategory.discount,
    //       tax: serviceCategory.tax,
    //       taxRate: serviceCategory.taxRate,
    //       totalNetto: serviceCategory.totalNetto,
    //       bruttoTotal: serviceCategory.totalNetto + serviceCategory.taxRatee,
    //       additiontalDescToggle : serviceCategory.additiontalDescToggle,
    //       ...(serviceCategory.additiontalDescToggle && {
    //         descriptionToggle: true,
    //       })
    //     };
    //   }) : [];

    (function () {
      let convertCategoryToNothing = [];
      if (
        state.groupBy === "category" &&
        productComponents.service &&
        productComponents.service.length > 0
      ) {
        productComponents.service.forEach((serviceCategory) => {
          serviceCategory.productJson.forEach((serviceProd) => {
            // to populate service by nathing case
            convertCategoryToNothing.push(serviceProd);
          });
        });
        servicesTableData.value = convertCategoryToNothing;
      }
    })();

    // this will ultimately populate values in servicesTableData when groupBy change to nothing.
    //  (function () {
    //     let serviceCategoryToNothing = []
    //     if(state.groupBy === "category" && productComponents.service && productComponents.service.length > 0){
    //       productComponents.service.forEach((serviceCategory) => {
    //         // serviceCategory.products.forEach((serviceProd) => { // to populate service by nathing case
    //         // serviceCategoryToNothing.push({
    //         //   ...serviceProd,
    //         //   quantity: 1,
    //         //   taxRate: (serviceProd.tax / 100) * (1 * serviceProd.hourlyRate),
    //         //   totalNetto:
    //         //     1 * serviceProd.hourlyRate -
    //         //     (serviceProd.discount / 100) * (1 * serviceProd.hourlyRate),
    //         //   })
    //         // })
    //         serviceCategory.productJson.forEach((serviceProd) => { // to populate service by nathing case
    //         serviceCategoryToNothing.push(serviceProd)
    //         })
    //       });
    //       servicesTableCategoryForEdit.value = serviceCategoryToNothing
    //     }
    //   })();

    amsTableData.value =
      productComponents.application && productComponents.application.length > 0
        ? productComponents.application.map((application: any) => {
            return {
              type: "application",
              componentId: application?.id ?? "",
              productId: application.productId,
              articleNumber: application.articleNumber,
              name: application.name,
              productSoftware: application.productSoftware,
              quantity: application.quantity ?? 1,
              productUnit: application?.productUnit, // not coming
              hourlyRate: application.hourlyRate,
              discount: application.discount,
              paymentPeriodId: application.paymentPeriodId,
              tax: application.tax,
              totalNetto: application.totalNetto,
              additionDescription: application.additionDescription,
              ...(application.additionDescription && {
                descriptionToggle: true,
              }),
              slaToggle: true,
              slaInfrastructureId: application.slaInfrastructureId,
              slaServiceTimeId: application.slaServiceTimeId,
              slaLevelIncidentId: application.slaLevelIncidentId,
              slaLevelChangeId: application.slaLevelChangeId,
            };
          })
        : [];

    hostingTableData.value =
      productComponents.hosting && productComponents.hosting.length > 0
        ? productComponents.hosting.map((hosting: any) => {
            return {
              type: "hosting",
              componentId: hosting?.id ?? "",
              productId: hosting.productId,
              articleNumber: hosting.articleNumber,
              name: hosting.name,
              productSoftware: hosting.productSoftware,
              quantity: hosting.quantity,
              pricePerPeriod: hosting.pricePerPeriod,
              totalPricePerPeriod: hosting?.totalPricePerPeriod,
              discount: hosting.discount,
              paymentPeriodId: hosting.paymentPeriodId,
              tax: hosting.tax,
              totalNetto: hosting.totalNetto,
              totalRate: hosting.totalRate, // that of child
              additionDescription: hosting.additionDescription,
              ...(hosting.additionDescription && {
                descriptionToggle: true,
              }),

              childComponents:
                hosting.childComponents &&
                hosting.childComponents.length > 0 &&
                hosting.childComponents.map((childHosting) => {
                  return {
                    type: "hosting",
                    componentId: childHosting?.id ?? "",
                    productId: childHosting.productId,
                    articleNumber: childHosting.articleNumber,
                    name: childHosting.name,
                    productSoftware: childHosting.productSoftware,
                    quantity: childHosting.quantity,
                    pricePerPeriod: childHosting.pricePerPeriod,
                    totalPricePerPeriod: childHosting?.totalPricePerPeriod,
                    discount: childHosting.discount,
                    paymentPeriodId: childHosting.paymentPeriodId,
                    tax: childHosting.tax,
                    totalNetto: childHosting.totalNetto,
                    totalRate: childHosting.totalRate, // that of child
                  };
                }),
            };
          })
        : [];

    cloudTableData.value =
      productComponents.cloud && productComponents.cloud.length > 0
        ? productComponents.cloud.map((cloud: any) => {
            return {
              type: "cloud",
              componentId: cloud?.id ?? "",
              productId: cloud.productId,
              articleNumber: cloud.articleNumber,
              name: cloud.name,
              productSoftware: cloud.productSoftware,
              quantity: cloud.quantity,
              duration: cloud.duration,
              salePrice: cloud.salePrice,
              totalPrice: cloud.quantity * cloud.salePrice,
              discount: cloud.discount,
              paymentPeriodId: cloud.paymentPeriodId,
              tax: cloud.tax,
              totalNetto: cloud.totalNetto,
              totalRate: cloud.totalRate, // for child product
              additionDescription: cloud.additionDescription,
              ...(cloud.additionDescription && {
                descriptionToggle: true,
              }),
              childComponents:
                cloud.childComponents &&
                cloud.childComponents.length > 0 &&
                cloud.childComponents.map((childCloud) => {
                  return {
                    type: "cloud",
                    componentId: childCloud?.id ?? "",
                    productId: childCloud.productId,
                    articleNumber: childCloud.articleNumber,
                    name: childCloud.name,
                    productSoftware: childCloud.productSoftware,
                    quantity: childCloud.quantity,
                    duration: childCloud.duration,
                    salePrice: childCloud.salePrice,
                    totalPrice: childCloud.quantity * childCloud.salePrice,
                    discount: childCloud.discount,
                    paymentPeriodId: childCloud.paymentPeriodId,
                    tax: childCloud.tax,
                    totalNetto: childCloud.totalNetto,
                    totalRate: childCloud.totalRate, // for child product
                  };
                }),
            };
          })
        : [];

    optionalSoftwareLicencesTableData.value =
      optionalProductComponents.license &&
      optionalProductComponents.license.length > 0
        ? optionalProductComponents.license.map((licance: any) => {
            return {
              type: "license",
              componentId: licance?.id ?? "",
              productId: licance.productId,
              articleNumber: licance.articleNumber,
              name: licance.name,
              quantity: licance.quantity,
              salePrice: licance.salePrice,
              discount: licance.discount,
              maintenanceRate: licance.maintenanceRate,
              totalNetto: licance.totalNetto,
              tax: licance.tax,
              additionDescription: licance.additionDescription,
              ...(licance.additionDescription && {
                descriptionToggle: true,
              }),
            };
          })
        : [];
    optionalSoftwareMaintenanceTableData.value =
      optionalProductComponents.maintenance &&
      optionalProductComponents.maintenance.length > 0
        ? optionalProductComponents.maintenance.map((maintenance: any) => {
            return {
              type: "maintenance",
              componentId: maintenance?.id ?? "",
              productId: maintenance.productId,
              articleNumber: maintenance.articleNumber,
              name: maintenance.name,
              quantity: maintenance.quantity,
              salePrice: maintenance.salePrice,
              discount: maintenance.discount,
              maintenanceRate: maintenance.maintenanceRate,
              totalNetto: maintenance.totalNetto,
              tax: maintenance.tax,
              additionDescription: maintenance.additionDescription,
              ...(maintenance.additionDescription && {
                descriptionToggle: true,
              }),
            };
          })
        : [];

    optionalServicesTableData.value =
      state.groupBy === "nothing" &&
      optionalProductComponents.service &&
      optionalProductComponents.service.length > 0
        ? optionalProductComponents.service.map((service: any) => {
            return {
              type: "service",
              componentId: service?.id ?? "",
              productId: service.productId,
              articleNumber: service.articleNumber,
              name: service.name,
              quantity: service.quantity,
              unit: service?.productUnit?.name, // not coming from backend
              hourlyRate: service.hourlyRate,
              discount: service.discount,
              tax: service.tax,
              taxRate: service.tax,
              totalNetto: service.totalNetto,
              totalRate: service.taxRate, // that of child
              productCategory: service.productCategory,
            };
          })
        : [];

    // optionalServicesTableDataByCategory.value =
    //   ( state.groupBy === "category" &&
    //   optionalProductComponents.service &&
    //   optionalProductComponents.service.length > 0 ) ?
    //   optionalProductComponents.service.map((serviceCategory) => {
    //     return {
    //       ...serviceCategory,
    //       name: serviceCategory.productCategory.name,
    //     };
    //   }) : [];

    (function () {
      let convertOptionalCategoryToNothing = [];
      if (
        state.groupBy === "category" &&
        optionalProductComponents.service &&
        optionalProductComponents.service.length > 0
      ) {
        optionalProductComponents.service.forEach((serviceCategory) => {
          serviceCategory.productJson.forEach((serviceProd) => {
            convertOptionalCategoryToNothing.push(serviceProd);
          });
        });
        optionalServicesTableData.value = convertOptionalCategoryToNothing;
      }
    })();

    // this will ultimately populate values in optionalServicesTableData when groupBy change to nothing.
    //  (function () {
    //   let optionalServiceCategoryToNothing = []
    //   if(state.groupBy === "category" && optionalProductComponents.service && optionalProductComponents.service.length > 0){
    //     optionalProductComponents.service.forEach((serviceCategory) => {
    //       // optionalServiceCategoryToNothing.push({
    //       //   ...serviceCategory,
    //       //   quantity: 1,
    //       //   taxRate: (serviceCategory.tax / 100) * (1 * serviceCategory.hourlyRate),
    //       //   totalNetto:
    //       //     1 * serviceCategory.hourlyRate -
    //       //     (serviceCategory.discount / 100) * (1 * serviceCategory.hourlyRate),
    //       //   })
    //       serviceCategory.productJson.forEach((serviceProd) => { // to populate service by nathing case
    //       optionalServiceCategoryToNothing.push(serviceProd)
    //       })
    //     });
    //     optionalServicesTableCategoryForEdit.value = optionalServiceCategoryToNothing
    //   }
    // })();
    optionalAmsTableData.value =
      optionalProductComponents.application &&
      optionalProductComponents.application.length > 0
        ? optionalProductComponents.application.map((application: any) => {
            return {
              type: "application",
              componentId: application?.id ?? "",
              productId: application.productId,
              articleNumber: application.articleNumber,
              name: application.name,
              productSoftware: application.productSoftware,
              quantity: application.quantity ?? 1,
              productUnit: application?.productUnit, // not coming
              hourlyRate: application.hourlyRate,
              discount: application.discount,
              paymentPeriodId: application.paymentPeriodId,
              tax: application.tax,
              totalNetto: application.totalNetto,
              slaToggle: true,
              slaInfrastructureId: application.slaInfrastructureId,
              slaServiceTimeId: application.slaServiceTimeId,
              slaLevelIncidentId: application.slaLevelIncidentId,
              slaLevelChangeId: application.slaLevelChangeId,
            };
          })
        : [];

    optionalHostingTableData.value =
      optionalProductComponents.hosting &&
      optionalProductComponents.hosting.length > 0
        ? optionalProductComponents.hosting.map((hosting: any) => {
            return {
              type: "hosting",
              componentId: hosting?.id ?? "",
              productId: hosting.productId,
              articleNumber: hosting.articleNumber,
              name: hosting.name,
              productSoftware: hosting.productSoftware,
              quantity: hosting.quantity,
              pricePerPeriod: hosting.pricePerPeriod,
              totalPricePerPeriod: hosting?.totalPricePerPeriod,
              discount: hosting.discount,
              paymentPeriodId: hosting.paymentPeriodId,
              tax: hosting.tax,
              totalNetto: hosting.totalNetto,
              totalRate: hosting.totalRate, // that of child
            };
          })
        : [];
    optionalCloudTableData.value =
      optionalProductComponents.cloud &&
      optionalProductComponents.cloud.length > 0
        ? optionalProductComponents.cloud.map((cloud: any) => {
            return {
              type: "cloud",
              componentId: cloud?.id ?? "",
              productId: cloud.productId,
              articleNumber: cloud.articleNumber,
              name: cloud.name,
              productSoftware: cloud.productSoftware,
              quantity: cloud.quantity,
              duration: cloud.duration,
              salePrice: cloud.salePrice,
              totalPrice: cloud.quantity * cloud.salePrice,
              discount: cloud.discount,
              paymentPeriodId: cloud.paymentPeriodId,
              tax: cloud.tax,
              totalNetto: cloud.totalNetto,
              totalRate: cloud.totalRate, // for child product
            };
          })
        : [];

    const prodComponents = Object.keys(productComponents);
    const optionalProdComponents = Object.keys(optionalProductComponents);
    const combine = prodComponents.concat(optionalProdComponents);
    const unique = combine.filter((item, pos) => combine.indexOf(item) === pos);
    productType.value = unique;
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
          ? await customerRequest()
          : await leadRequest();
      receiverOptions.value =
        receiverType === "customer"
          ? receiverRes?.data?.customers?.map((rs: any) => {
              return {
                value: rs?.id,
                name: rs?.name,
                companyName: rs?.name,
                companyNumber: rs?.number,
                address: rs?.location?.addressFirst,
                code: rs?.location?.zip,
                city: rs?.location?.city,
                state: rs?.location?.state,
                country: rs?.location?.country?.name,
              };
            })
          : receiverRes?.data?.leads?.map((rs: any) => {
              return {
                value: rs?.id,
                name: rs?.name,
                companyName: rs?.name,
                companyNumber: rs?.number,
                address: rs?.location?.addressFirst,
                code: rs?.location?.zip,
                city: rs?.location?.city,
                state: rs?.location?.state,
                country: rs?.location?.country?.name,
              };
            });
            if(receiverType !== receiverTypePrev && !props.recordId){
                // when receiver type change, set the receiver/customerId to null
                state.customerId = null
            }
      
    } catch (e) {
      console.log(e);
    }
  }
);

// contact person and project will populate on basic of customerId which is receiver
watch(
  () => state.customerId,
  async (customerId) => {
    try {
      if (!customerId) {
        return;
      }
      const resPerson = await getUserListFromComsumerIdRequest({
        limit_start: 0,
        limit_count: 25,
        type: "customer",
        company_id: customerId,
      });
      const resProject = await getProjectsFromComsumerIdRequest({
        companyId: customerId,
      });
      contactPersonOptions.value = resPerson?.data.map((cp: any) => {
        return {
          value: cp.id,
          name: cp.first_name + " " + cp.last_name,
        };
      });

      projectOptions.value = resProject?.data.map((rp: any) => {
        return {
          value: rp.id,
          name: rp.name,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }
);
// set companyDetail object
watch(
  [
    () => state.customerId,
    () => state.contactPersonId,
    () => receiverOptions.value,
  ],
  (
    [customerId, contactPersonId, receiverOptions],
    [] // array containing previous values
  ) => {
    receiverOptions.map((opt) => {
      if (opt.value === customerId) {
        companyDetail.companyName = opt?.companyName;
        companyDetail.companyNumber = opt?.companyNumber;
        companyDetail.address = opt?.address;
        companyDetail.code = opt?.code;
        companyDetail.city = opt?.city;
        companyDetail.state = opt?.state;
        companyDetail.country = opt?.country;
      }
    });
    contactPersonOptions.value.map((opt) => {
      if (opt.value === contactPersonId) {
        companyDetail.contactPerson = opt.companyName;
      }
    });
  }
);
// populate payment terms on basic of termOfPaymentId
watch(
  () => state.termOfPaymentId,
  (termOfPaymentId) => {
    termOfPaymentOptions.value.map((termOption) => {
      if (termOption.value === termOfPaymentId) {
        state.paymentTerm = termOption.name;
        return;
      }
    });
  }
);

onMounted(async function () {
  try {
    const res = await genericListingRequest(routes.TERMS_OF_PAYMENT, {
      all: true,
    });
    termOfPaymentOptions.value = res?.data?.termOfPayments?.map((ts: any) => {
      return { value: ts.id, name: ts.name };
    });
  } catch (e) {
    console.log(e);
  }
});

async function saveOffersHandler(update: boolean) {
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      const logedinUserId = localStorage.getItem("user_id");
      const formData = {
        ...(state.receiverType && { receiverType: state.receiverType }),
        ...(state.customerId && { customerId: state.customerId }),
        ...(state.contactPersonId && {
          contactPersonId: state.contactPersonId,
        }),
        ...(state.termOfPaymentId && {
          termOfPaymentId: state.termOfPaymentId,
        }),
        ...(state.projectId && { projectId: state.projectId }),
        ...(state.offerType && { offerType: state.offerType }),
        ...(state.template && { template: state.template }),
        ...(state.groupBy && { groupBy: state.groupBy }),
        ...(state.expiryDate && { expiryDate: state.expiryDate }),
        ...(state.offerStatus && { offerStatus: state.offerStatus }),

        ...(state.paymentTerm && { paymentTerm: state.paymentTerm }),
        ...(state.coverLetterText && {
          coverLetterText: state.coverLetterText,
        }),
        ...(state.descriptionText && {
          descriptionText: state.descriptionText,
        }),
        createdBy: logedinUserId, // loggedIn user id.
        productComponents: {
          ...(softwareLicencesTableData.value?.length > 0 && {
            license: softwareLicencesTableData.value,
          }),
          ...(softwareMaintenanceTableData.value?.length > 0 && {
            maintenance: softwareMaintenanceTableData.value,
          }),
          ...(state.groupBy === "nothing" &&
            servicesTableData.value?.length > 0 && {
              service: servicesTableData.value,
            }),
          ...(state.groupBy === "category" &&
            servicesTableDataByCategory.value?.length > 0 && {
              service: servicesTableDataByCategory.value,
            }),
          ...(amsTableData.value?.length > 0 && {
            application: amsTableData.value,
          }),
          ...(hostingTableData.value?.length > 0 && {
            hosting: hostingTableData.value,
          }),
          ...(cloudTableData.value?.length > 0 && {
            cloud: cloudTableData.value,
          }),
        },
        optionalProductComponents: {
          ...(optionalSoftwareLicencesTableData.value?.length > 0 && {
            license: optionalSoftwareLicencesTableData.value,
          }),
          ...(optionalSoftwareMaintenanceTableData.value?.length > 0 && {
            maintenance: optionalSoftwareMaintenanceTableData.value,
          }),
          ...(state.groupBy === "nothing" &&
            optionalServicesTableData.value?.length > 0 && {
              service: optionalServicesTableData.value,
            }),
          ...(state.groupBy === "category" &&
            optionalServicesTableDataByCategory.value?.length > 0 && {
              service: optionalServicesTableDataByCategory.value,
            }),
          ...(optionalAmsTableData.value?.length > 0 && {
            application: optionalAmsTableData.value,
          }),
          ...(optionalHostingTableData.value?.length > 0 && {
            hosting: optionalHostingTableData.value,
          }),
          ...(optionalCloudTableData.value?.length > 0 && {
            cloud: optionalCloudTableData.value,
          }),
        },
      };
      const res = (props?.recordId && update) // if copyOffer then create record not update record
        ? await editSaleOfferRequest(formData, props?.recordId)
        : await addSaleOfferRequest(formData);

      Toast.fire({
        title: (props?.recordId && update) ? "Updated" : "Created",
        icon: "success",
      });
      navigateTo("/offers");
      isLoading.value = false;
    } catch (e) {
      console.log(e);
      Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
      isLoading.value = false;
    }
  }
}

function productAdded(product) {
  if (selectedComponentType.value === "licences") {
    product.map((prod) => {
      softwareLicencesTableData.value?.push(prod);
      softwareMaintenanceTableData.value?.push({
        ...prod,
        type: "maintenance",
        totalNetto:
          (prod?.maintenanceRate / 100) *
          (prod?.quantity * (prod?.quantity * prod?.salePrice)),
      });
    });
    return;
  } else if (selectedComponentType.value === "licencesOptional") {
    product.map((prod) => {
      optionalSoftwareLicencesTableData.value?.push(prod);
      optionalSoftwareMaintenanceTableData.value?.push({
        ...prod,
        type: "maintenance",
        totalNetto:
          (prod?.maintenanceRate / 100) *
          (prod?.quantity * (prod?.quantity * prod?.salePrice)),
      });
    });
    return;
  } else if (selectedComponentType.value === "services") {
    product.map((prod) => {
      console.log("service table", servicesTableData.value);
      servicesTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "servicesOptional") {
    product.map((prod) => {
      optionalServicesTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childServices") {
    product.map((prod) => {
      servicesTableData.value[parentComponentIndex.value].childComponents?.push(
        prod
      );
    });
    return;
  } else if (selectedComponentType.value === "ams") {
    product.map((prod) => {
      amsTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "amsOptional") {
    product.map((prod) => {
      optionalAmsTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "hosting") {
    product.map((prod) => {
      hostingTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "hostingOptional") {
    product.map((prod) => {
      optionalHostingTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childHosting") {
    product.map((prod) => {
      hostingTableData.value[parentComponentIndex.value].childComponents?.push(
        prod
      );
    });
    return;
  } else if (selectedComponentType.value === "cloud") {
    product.map((prod) => {
      cloudTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "cloudOptional") {
    product.map((prod) => {
      optionalCloudTableData.value?.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childCloud") {
    product.map((prod) => {
      cloudTableData.value[parentComponentIndex.value].childComponents?.push(
        prod
      );
    });
    return;
  }
}

function additiontalDescToggle({ index, componentType }) {
  if (componentType === "licences") {
    softwareLicencesTableData.value[index].descriptionToggle =
      !softwareLicencesTableData.value[index].descriptionToggle;
    if (!softwareLicencesTableData.value[index].descriptionToggle) {
      // when click on remove desc
      softwareLicencesTableData.value[index].additionDescription = "";
    }
  } else if (componentType === "maintenance") {
    softwareMaintenanceTableData.value[index].descriptionToggle =
      !softwareMaintenanceTableData.value[index].descriptionToggle;
    if (!softwareMaintenanceTableData.value[index].descriptionToggle) {
      // when click on remove desc
      softwareMaintenanceTableData.value[index].additionDescription = "";
    }
  } else if (componentType === "services") {
    servicesTableData.value[index].descriptionToggle =
      !servicesTableData.value[index].descriptionToggle;
    if (!servicesTableData.value[index].descriptionToggle) {
      // when click on remove desc
      servicesTableData.value[index].additionDescription = "";
    }
  } else if (componentType === "servicesByCategory") {
    servicesTableDataByCategory.value[index].descriptionToggle =
      !servicesTableDataByCategory.value[index].descriptionToggle;
    if (!servicesTableDataByCategory.value[index].descriptionToggle) {
      // when click on remove desc
      servicesTableDataByCategory.value[index].additionDescription = "";
    }
  } else if (componentType === "ams") {
    amsTableData.value[index].descriptionToggle =
      !amsTableData.value[index].descriptionToggle;
    if (!amsTableData.value[index].descriptionToggle) {
      // when click on remove desc
      amsTableData.value[index].additionDescription = "";
    }
  } else if (componentType === "hosting") {
    hostingTableData.value[index].descriptionToggle =
      !hostingTableData.value[index].descriptionToggle;
    if (!hostingTableData.value[index].descriptionToggle) {
      // when click on remove desc
      hostingTableData.value[index].additionDescription = "";
    }
  } else if (componentType === "cloud") {
    cloudTableData.value[index].descriptionToggle =
      !cloudTableData.value[index].descriptionToggle;
    if (!cloudTableData.value[index].descriptionToggle) {
      // when click on remove desc
      cloudTableData.value[index].additionDescription = "";
    }
  }
}

function addSlaToggle({ index, componentType }) {
  if (componentType === "ams") {
    amsTableData.value[index].slaToggle = !amsTableData.value[index].slaToggle;
    if (!amsTableData.value[index].slaToggle) {
      // when click on remove desc
      amsTableData.value[index].slaInfrastructureId = "";
      amsTableData.value[index].slaServiceTimeId = "";
      amsTableData.value[index].slaLevelIncidentId = "";
      amsTableData.value[index].slaLevelChangeId = "";
    }
  } else if (componentType === "amsOptional") {
    optionalAmsTableData.value[index].slaToggle =
      !optionalAmsTableData.value[index].slaToggle;
    if (!optionalAmsTableData.value[index].slaToggle) {
      // when click on remove desc
      optionalAmsTableData.value[index].slaInfrastructureId = "";
      optionalAmsTableData.value[index].slaServiceTimeId = "";
      optionalAmsTableData.value[index].slaLevelIncidentId = "";
      optionalAmsTableData.value[index].slaLevelChangeId = "";
    }
  }
}

const calculateTotalNetto = (
  table: any,
  index: number,
  nettoType?: string,
  childComponent?: any
) => {
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
    const discount = (table.value[index].discount / 100) * quantityMultiplyRate;

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
    const discount = (table.value[index].discount / 100) * quantityMultiplyRate;
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
  index,
  componentType,
  changedValue,
  childIndex?: any
) => {
  // QUANTITY
  if (componentType === "licences" && changedValue === "quantity") {
    softwareLicencesTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(softwareLicencesTableData, index);
  } else if (
    componentType === "licencesOptional" &&
    changedValue === "quantity"
  ) {
    optionalSoftwareLicencesTableData.value[index].quantity =
      event.target.value;
    calculateTotalNetto(optionalSoftwareLicencesTableData, index);
  } else if (componentType === "maintenance" && changedValue === "quantity") {
    softwareMaintenanceTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
  } else if (
    componentType === "maintenanceOptional" &&
    changedValue === "quantity"
  ) {
    optionalSoftwareMaintenanceTableData.value[index].quantity =
      event.target.value;
    calculateTotalNetto(
      optionalSoftwareMaintenanceTableData,
      index,
      "maintenance"
    );
  } else if (componentType === "ams" && changedValue === "quantity") {
    amsTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "amsOptional" && changedValue === "quantity") {
    optionalAmsTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(optionalAmsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "quantity") {
    servicesTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
  } else if (
    componentType === "serviceOptional" &&
    changedValue === "quantity"
  ) {
    optionalServicesTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(optionalServicesTableData, index, "service");
  } else if (componentType === "childService" && changedValue === "quantity") {
    servicesTableData.value[index].childComponents[childIndex].quantity =
      event.target.value;
    servicesTableData.value[index].childComponents[childIndex].totalRate =
      servicesTableData.value[index].childComponents[childIndex].quantity *
      servicesTableData.value[index].childComponents[childIndex].hourlyRate;
    calculateTotalNetto(
      servicesTableData,
      index,
      "childService",
      servicesTableData.value[index].childComponents
    );
  } else if (
    componentType === "serviceByCategory" &&
    changedValue === "quantity"
  ) {
    servicesTableDataByCategory.value[index].quantity = event.target.value;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  } else if (
    componentType === "serviceByCategoryOptional" &&
    changedValue === "quantity"
  ) {
    optionalServicesTableDataByCategory.value[index].quantity =
      event.target.value;
    calculateTotalNetto(optionalServicesTableDataByCategory, index, "service");
  } else if (componentType === "hosting" && changedValue === "quantity") {
    hostingTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
  } else if (
    componentType === "hostingOptional" &&
    changedValue === "quantity"
  ) {
    optionalHostingTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(optionalHostingTableData, index, "hosting");
  } else if (componentType === "childHosting" && changedValue === "quantity") {
    hostingTableData.value[index].childComponents[childIndex].quantity =
      event.target.value;
    hostingTableData.value[index].childComponents[childIndex].totalRate =
      hostingTableData.value[index].childComponents[childIndex].quantity *
      hostingTableData.value[index].childComponents[childIndex].pricePerPeriod;
    calculateTotalNetto(
      hostingTableData,
      index,
      "childHosting",
      hostingTableData.value[index].childComponents
    );
  } else if (componentType === "cloud" && changedValue === "quantity") {
    cloudTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
  } else if (componentType === "cloudOptional" && changedValue === "quantity") {
    optionalCloudTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(optionalCloudTableData, index, "cloud");
  } else if (componentType === "childCloud" && changedValue === "quantity") {
    cloudTableData.value[index].childComponents[childIndex].quantity =
      event.target.value;
    cloudTableData.value[index].childComponents[childIndex].totalRate =
      cloudTableData.value[index].childComponents[childIndex].quantity *
      cloudTableData.value[index].childComponents[childIndex].duration *
      cloudTableData.value[index].childComponents[childIndex].salePrice;
    calculateTotalNetto(
      cloudTableData,
      index,
      "childCloud",
      cloudTableData.value[index].childComponents
    );
  }

  /// SALE PRICE
  else if (componentType === "licences" && changedValue === "salePrice") {
    softwareLicencesTableData.value[index].salePrice = event.target.value;
    calculateTotalNetto(softwareLicencesTableData, index);
  } else if (
    componentType === "licencesOptional" &&
    changedValue === "salePrice"
  ) {
    optionalSoftwareLicencesTableData.value[index].salePrice =
      event.target.value;
    calculateTotalNetto(optionalSoftwareLicencesTableData, index);
  } else if (componentType === "cloud" && changedValue === "salePrice") {
    cloudTableData.value[index].salePrice = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
  } else if (
    componentType === "cloudOptional" &&
    changedValue === "salePrice"
  ) {
    optionalCloudTableData.value[index].salePrice = event.target.value;
    calculateTotalNetto(optionalCloudTableData, index, "cloud");
  } else if (componentType === "childCloud" && changedValue === "salePrice") {
    cloudTableData.value[index].childComponents[childIndex].salePrice =
      event.target.value;
    cloudTableData.value[index].childComponents[childIndex].totalRate =
      cloudTableData.value[index].childComponents[childIndex].quantity *
      cloudTableData.value[index].childComponents[childIndex].duration *
      cloudTableData.value[index].childComponents[childIndex].salePrice;
    calculateTotalNetto(
      cloudTableData,
      index,
      "childCloud",
      cloudTableData.value[index].childComponents
    );
  }

  // DISCOUNT
  else if (componentType === "licences" && changedValue === "discount") {
    softwareLicencesTableData.value[index].discount = event.target.value;
    calculateTotalNetto(softwareLicencesTableData, index);
  } else if (
    componentType === "licencesOptional" &&
    changedValue === "discount"
  ) {
    optionalSoftwareLicencesTableData.value[index].discount =
      event.target.value;
    calculateTotalNetto(optionalSoftwareLicencesTableData, index);
  } else if (componentType === "ams" && changedValue === "discount") {
    amsTableData.value[index].discount = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "amsOptional" && changedValue === "discount") {
    optionalAmsTableData.value[index].discount = event.target.value;
    calculateTotalNetto(optionalAmsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "discount") {
    servicesTableData.value[index].discount = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
  } else if (
    componentType === "serviceOptional" &&
    changedValue === "discount"
  ) {
    optionalServicesTableData.value[index].discount = event.target.value;
    calculateTotalNetto(optionalServicesTableData, index, "service");
  } else if (
    componentType === "serviceByCategory" &&
    changedValue === "discount"
  ) {
    servicesTableDataByCategory.value[index].discount = event.target.value;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  } else if (
    componentType === "serviceByCategoryOptional" &&
    changedValue === "discount"
  ) {
    optionalServicesTableDataByCategory.value[index].discount =
      event.target.value;
    calculateTotalNetto(optionalServicesTableDataByCategory, index, "service");
  } else if (componentType === "hosting" && changedValue === "discount") {
    hostingTableData.value[index].discount = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
  } else if (
    componentType === "hostingOptional" &&
    changedValue === "discount"
  ) {
    optionalHostingTableData.value[index].discount = event.target.value;
    calculateTotalNetto(optionalHostingTableData, index, "hosting");
  } else if (componentType === "cloud" && changedValue === "discount") {
    cloudTableData.value[index].discount = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
  } else if (componentType === "cloudOptional" && changedValue === "discount") {
    optionalCloudTableData.value[index].discount = event.target.value;
    calculateTotalNetto(optionalCloudTableData, index, "cloud");
  }

  // MAINTENANCE RATE
  else if (
    componentType === "maintenance" &&
    changedValue === "maintenanceRate"
  ) {
    softwareMaintenanceTableData.value[index].maintenanceRate =
      event.target.value;
    calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
  } else if (
    componentType === "maintenanceOptional" &&
    changedValue === "maintenanceRate"
  ) {
    optionalSoftwareMaintenanceTableData.value[index].maintenanceRate =
      event.target.value;
    calculateTotalNetto(
      optionalSoftwareMaintenanceTableData,
      index,
      "maintenance"
    );
  }
  // HOURLY RATE
  else if (componentType === "ams" && changedValue === "hourlyRate") {
    amsTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "amsOptional" && changedValue === "hourlyRate") {
    optionalAmsTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(optionalAmsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "hourlyRate") {
    servicesTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
  } else if (
    componentType === "serviceOptional" &&
    changedValue === "hourlyRate"
  ) {
    optionalServicesTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(optionalServicesTableData, index, "service");
  } else if (
    componentType === "childService" &&
    changedValue === "hourlyRate"
  ) {
    servicesTableData.value[index].childComponents[childIndex].hourlyRate =
      event.target.value;
    servicesTableData.value[index].childComponents[childIndex].totalRate =
      servicesTableData.value[index].childComponents[childIndex].quantity *
      servicesTableData.value[index].childComponents[childIndex].hourlyRate;
    calculateTotalNetto(
      servicesTableData,
      index,
      "childService",
      servicesTableData.value[index].childComponents
    );
  } else if (
    componentType === "serviceByCategory" &&
    changedValue === "hourlyRate"
  ) {
    servicesTableDataByCategory.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  } else if (
    componentType === "serviceByCategoryOptional" &&
    changedValue === "hourlyRate"
  ) {
    optionalServicesTableDataByCategory.value[index].hourlyRate =
      event.target.value;
    calculateTotalNetto(optionalServicesTableDataByCategory, index, "service");
  }
  // PRICE PER PERIOD
  else if (componentType === "hosting" && changedValue === "pricePerPeriod") {
    hostingTableData.value[index].pricePerPeriod = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
  } else if (
    componentType === "hostingOptional" &&
    changedValue === "pricePerPeriod"
  ) {
    optionalHostingTableData.value[index].pricePerPeriod = event.target.value;
    calculateTotalNetto(optionalHostingTableData, index, "hosting");
  } else if (
    componentType === "childHosting" &&
    changedValue === "pricePerPeriod"
  ) {
    hostingTableData.value[index].childComponents[childIndex].pricePerPeriod =
      event.target.value;
    hostingTableData.value[index].childComponents[childIndex].totalRate =
      hostingTableData.value[index].childComponents[childIndex].quantity *
      hostingTableData.value[index].childComponents[childIndex].pricePerPeriod;
    calculateTotalNetto(
      hostingTableData,
      index,
      "childHosting",
      hostingTableData.value[index].childComponents
    );
  }
  // DURATION
  else if (componentType === "cloud" && changedValue === "duration") {
    cloudTableData.value[index].duration = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
  } else if (componentType === "cloudOptional" && changedValue === "duration") {
    optionalCloudTableData.value[index].duration = event.target.value;
    calculateTotalNetto(optionalCloudTableData, index, "cloud");
  } else if (componentType === "childCloud" && changedValue === "duration") {
    cloudTableData.value[index].childComponents[childIndex].duration =
      event.target.value;
    cloudTableData.value[index].childComponents[childIndex].totalRate =
      cloudTableData.value[index].childComponents[childIndex].quantity *
      cloudTableData.value[index].childComponents[childIndex].duration *
      cloudTableData.value[index].childComponents[childIndex].salePrice;
    calculateTotalNetto(
      cloudTableData,
      index,
      "childCloud",
      cloudTableData.value[index].childComponents
    );
  }
  // TAX
  else if (componentType === "service" && changedValue === "tax") {
    servicesTableData.value[index].tax = event.target.value;
    const quantityMultpilyRate =
      servicesTableData.value[index].quantity *
      servicesTableData.value[index].hourlyRate;
    const discount =
      quantityMultpilyRate -
      (servicesTableData.value[index].discount / 100) * quantityMultpilyRate;
    servicesTableData.value[index].taxRate =
      (servicesTableData.value[index].tax / 100) * discount;
  } else if (componentType === "serviceOptional" && changedValue === "tax") {
    optionalServicesTableData.value[index].tax = event.target.value;
    const quantityMultpilyRate =
      optionalServicesTableData.value[index].quantity *
      optionalServicesTableData.value[index].hourlyRate;
    const discount =
      quantityMultpilyRate -
      (optionalServicesTableData.value[index].discount / 100) *
        quantityMultpilyRate;
    optionalServicesTableData.value[index].taxRate =
      (optionalServicesTableData.value[index].tax / 100) * discount;
  } else if (componentType === "serviceByCategory" && changedValue === "tax") {
    servicesTableDataByCategory.value[index].tax = event.target.value;
    const quantityMultpilyRate =
      servicesTableDataByCategory.value[index].quantity *
      servicesTableDataByCategory.value[index].hourlyRate;
    const discount =
      quantityMultpilyRate -
      (servicesTableDataByCategory.value[index].discount / 100) *
        quantityMultpilyRate;
    servicesTableDataByCategory.value[index].taxRate =
      (servicesTableDataByCategory.value[index].tax / 100) * discount;
  } else if (
    componentType === "serviceByCategoryOptional" &&
    changedValue === "tax"
  ) {
    optionalServicesTableDataByCategory.value[index].tax = event.target.value;
    const quantityMultpilyRate =
      optionalServicesTableDataByCategory.value[index].quantity *
      optionalServicesTableDataByCategory.value[index].hourlyRate;
    const discount =
      quantityMultpilyRate -
      (optionalServicesTableDataByCategory.value[index].discount / 100) *
        quantityMultpilyRate;
    optionalServicesTableDataByCategory.value[index].taxRate =
      (optionalServicesTableDataByCategory.value[index].tax / 100) * discount;
  }
  // TAX RATE
  else if (componentType === "service" && changedValue === "taxRate") {
    servicesTableData.value[index].taxRate = event.target.value;
    servicesTableData.value[index].hourlyRate =
      (servicesTableData.value[index].taxRate * 100) /
      servicesTableData.value[index].tax /
      servicesTableData.value[index].quantity;
    calculateTotalNetto(servicesTableData, index, "service");
  } else if (
    componentType === "serviceOptional" &&
    changedValue === "taxRate"
  ) {
    optionalServicesTableData.value[index].taxRate = event.target.value;
    optionalServicesTableData.value[index].hourlyRate =
      (optionalServicesTableData.value[index].taxRate * 100) /
      optionalServicesTableData.value[index].tax /
      optionalServicesTableData.value[index].quantity;
    calculateTotalNetto(optionalServicesTableData, index, "service");
  } else if (
    componentType === "serviceByCategory" &&
    changedValue === "taxRate"
  ) {
    servicesTableDataByCategory.value[index].taxRate = event.target.value;
    servicesTableDataByCategory.value[index].hourlyRate =
      (servicesTableDataByCategory.value[index].taxRate * 100) /
      servicesTableDataByCategory.value[index].tax /
      servicesTableDataByCategory.value[index].quantity;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  } else if (
    componentType === "serviceByCategoryOptional" &&
    changedValue === "taxRate"
  ) {
    optionalServicesTableDataByCategory.value[index].taxRate =
      event.target.value;
    optionalServicesTableDataByCategory.value[index].hourlyRate =
      (optionalServicesTableDataByCategory.value[index].taxRate * 100) /
      optionalServicesTableDataByCategory.value[index].tax /
      optionalServicesTableDataByCategory.value[index].quantity;
    calculateTotalNetto(optionalServicesTableDataByCategory, index, "service");
  }
};

const calculateSummery = (tableData: any, tableSummery: any) => {
  if (!tableData) {
    return;
  }
  let netto = 0;
  let tax = [];
  let percentageTotal = 0;
  tableData?.map((data: any) => {
    netto = netto + Number(data.totalNetto);
    tax.push(Number(data.tax));
  });
  let finalTax = [...new Set(tax)];
  finalTax.map((fTax) => {
    const percentResult = (fTax / 100) * netto;
    percentageTotal = percentageTotal + percentResult;
  });
  tableSummery.netto = (Math.round(netto * 100) / 100).toFixed(2);
  tableSummery.tax = finalTax;
  tableSummery.total = (
    Math.round((netto + percentageTotal) * 100) / 100
  ).toFixed(2);
};

// watch software licance to calculate summery
watch(
  () => softwareLicencesTableData.value,
  (softwareLicencesData) => {
    calculateSummery(softwareLicencesData, softwareLicencesSummery);
  },
  { deep: true }
);
// watch software maintenance to calculate summery
watch(
  () => softwareMaintenanceTableData.value,
  (softwareMaintenanceData) => {
    calculateSummery(softwareMaintenanceData, softwareMaintenanceSummery);
  },
  { deep: true }
);
// watch services to calculate summery
watch(
  () => servicesTableData.value,
  (serviceTable) => {
    calculateSummery(serviceTable, serviceSummery);
  },
  { deep: true }
);
// watch servicesByCategory to calculate summery
watch(
  () => servicesTableDataByCategory.value,
  (serviceTable) => {
    calculateSummery(serviceTable, serviceSummeryByCategory);
  },
  { deep: true }
);
// watch hosting to calculate summery
watch(
  () => hostingTableData.value,
  (hostingTable) => {
    calculateSummery(hostingTable, hostingSummery);
  },
  { deep: true }
);
// watch cloud to calculate summery
watch(
  () => cloudTableData.value,
  (cloudTable) => {
    calculateSummery(cloudTable, cloudSummery);
  },
  { deep: true }
);
// watch ams to calculate summery
watch(
  () => amsTableData.value,
  (amsTableData) => {
    calculateSummery(amsTableData, amsSummery);
  },
  { deep: true }
);

function addProduct({
  componentType,
  parentIndex,
}: {
  componentType: string;
  parentIndex?: number;
}) {
  selectedComponentType.value = componentType;
  parentComponentIndex.value = parentIndex;
  showModal();
}

// helper function
function calculateCategoryQuantity(products) {
  return products.reduce(
    (accumulator, product) => +accumulator + +product.quantity,
    0
  );
}
// helper function
function unitForCategory(category) {
  let units = Array.from(
    new Set(category.products.map((product) => product.unit))
  );
  return units.length > 1
    ? this.units?.data?.find?.((unit) => unit.id == category.defaultUnit) ??
        units?.[0]
    : units?.[0];
}

// when componentType is service and groupBy is category, then group table for service according to categories.
function createCategories(services) {
  return Array.from(
    new Set(services.map((service, index) => service.productCategory.id))
  ).map((categoryId) => {
    // category object contain category name and id
    const category =
      services.find((service) => service.productCategory.id === categoryId)
        .productCategory ?? {};
    const products = services.filter(
      (service) => service.productCategory.id === category.id
    );
    const quantity = calculateCategoryQuantity(products);
    const unit = unitForCategory({
      ...category,
      products,
    });
    const hourlyRate = products.reduce((accumulator, current) => {
      return +current.hourlyRate > accumulator
        ? +current.hourlyRate
        : accumulator;
    }, 0);
    const totalWithoutDiscount = +hourlyRate * +quantity;
    const discount = products.reduce((accumulator, current) => {
      return +current.discount > accumulator ? +current.discount : accumulator;
    }, 0);
    const discountAmount = (+totalWithoutDiscount * +discount) / 100;
    const totalNetto = +totalWithoutDiscount - +discountAmount;
    const tax = products.reduce((accumulator, current) => {
      return +current.tax > accumulator ? +current.tax : accumulator;
    }, 0);
    const taxRate = (+totalNetto * +tax) / 100;
    return {
      ...category,
      type: "service",
      products: products,
      productIds: products.map((prod) => prod.productId),
      productCategoryId: products[0].productCategory.id,
      quantity: quantity,
      unit: unit,
      hourlyRate: hourlyRate,
      discount: discount,
      tax: tax,
      taxRate: taxRate,
      totalNetto: totalNetto,
      bruttoTotal: +totalNetto + +taxRate,
      descriptionToggle: false,
      additiontalDescToggle: "",
    };
  });
}

// when componentType is service and groupBy is category, then group the services according to categories
watch(
  [
    () => state.groupBy,
    () => servicesTableData.value,
    () => optionalServicesTableData.value,
  ],
  (
    [groupByValue, servicesTableDataValue, optionalServicesTableDataValue],
    [] // array containing previous values
  ) => {
    if (groupByValue === "category" && servicesTableDataValue.length > 0) {
      const serviceByCategory = createCategories(servicesTableDataValue);
      // removing the deplicate values
      servicesTableDataByCategory.value = serviceByCategory.filter(
        (obj, index) => {
          return index === serviceByCategory.findIndex((o) => obj.id === o.id);
        }
      );
    }
    if (
      groupByValue === "category" &&
      optionalServicesTableDataValue.length > 0
    ) {
      const optionalServiceByCategory = createCategories(
        optionalServicesTableDataValue
      );
      // removing the deplicate values
      optionalServicesTableDataByCategory.value =
        optionalServiceByCategory.filter((obj, index) => {
          return (
            index ===
            optionalServiceByCategory.findIndex((o) => obj.id === o.id)
          );
        });
    }
  },
  { deep: true }
);

// TODO: maybe we need this logic
// In edit case when componentType is service and groupBy is category,
// and user shift to groupBy nothing, then populate the servicesTableData and optionalServicesTableData
// watch(
//   [() => state.groupBy, () => servicesTableCategoryForEdit.value, () => optionalServicesTableCategoryForEdit.value],
//   (
//     [groupByValue, servicesTableCategoryForEditValue, optionalServicesTableCategoryForEditValue],
//     []
//   ) => {
//     if (groupByValue === "nothing" && servicesTableCategoryForEditValue.length > 0) {
//       servicesTableData.value = servicesTableCategoryForEditValue
//       servicesTableCategoryForEdit.value = [] // reset to empty array
//       // when groupBY change to category, then above watcher run
//     }
//     if (groupByValue === "nothing" && optionalServicesTableCategoryForEditValue.length > 0) {
//       optionalServicesTableData.value = servicesTableCategoryForEditValue
//       optionalServicesTableCategoryForEdit.value = [] // reset to empty array
//       // when groupBY change to category, then above watcher run
//     }
//   },
//   { deep: true }
// );

// update paymentPeriodId globally
function updatePeriodOfAllProducts(changeState: any, type: any) {
  if (type === "ams") {
    // update all ams products' payment period to global period
    amsTableData.value = amsTableData.value.map((product) => {
      return {
        ...product,
        paymentPeriodId: changeState,
      };
    });
  } else if (type === "hosting") {
    // update all hosting products' payment period to global period
    hostingTableData.value = hostingTableData.value.map((product) => {
      return {
        ...product,
        paymentPeriodId: changeState,
      };
    });
  } else if (type === "cloud") {
    // update all cloud products' payment period to global period
    cloudTableData.value = cloudTableData.value.map((product) => {
      return {
        ...product,
        paymentPeriodId: changeState,
      };
    });
  }
}

const generate = async (documentType) => {
  const payload = {
    type: state.offerType,
    offerType: "offer",
    orderStatus: state.orderStatus,
    offerStatus: state.offerStatus,
    companyId: state.company?.id ?? "", //
    projectId: state.projectId,
    termId: state.term?.id ?? "", //
    receiverType: state.receiverType,
    template: state.template,
    groupedBy: state.groupBy,
    expiryDate: state.expiryDate,
    paymentTerms: state.paymentTerm,
    createdBy: state.createdBy,
    coverLetterText: state.coverLetterText,
    offerDescriptionText: state.descriptionText,
    contactPerson: state.contactPerson?.id ?? "", //
    removeFromStatistics: state.removeFromStatistics,
    plannedStartDate: state.plannedStartDate,
    types: [],
    optionalTypes: [],
  };

  // payload["offerId"] = state.selectedOffer?.id ?? "";
  payload["offerId"] = "";

  payload.types = [
    ...amsTableData.value.map((product) => {
      return {
        id: product.componentId,
        type: "application",
        additionalDescription: product?.additionalDescription ?? "",
        productId: product?.productId ?? product.componentId,
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        hourlyRate: product.hourlyRate,
        // paymentPeriod:
        //     this.periods?.data?.find(
        //         (period) => period.id === product.paymentPeriod
        //     ) ?? product.paymentPeriod,
        paymentPeriod: product.paymentPeriodId,
        productFullDetails: {
          ...product,
          slaInfrastructureId: product?.slaInfrastructureId,
          slaServiceTimeId: product?.slaServiceTimeId,
          slaLevelIncidentId: product?.slaLevelIncidentId ?? "",
          slaLevelChangeId: product?.slaLevelChangeId ?? "",
        },
      };
    }),
    ...hostingTableData.value.map((product) => {
      return {
        id: product.componentId, // the original component id used for updating
        type: "hosting",
        additionalDescription: product?.additionalDescription ?? "",
        productId: product?.productId ?? product.componentId,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        pricePerPeriod: product.pricePerPeriod,
        // paymentPeriod:
        //     this.periods?.data?.find(
        //         (period) => period.id === product.paymentPeriod
        //     ) ?? product.paymentPeriod,
        paymentPeriod: product.paymentPeriodId,
        productFullDetails: { ...product },
        children: (product.childComponents ?? []).map((child) => {
          return {
            ...child,
            id: child.componentId,
            productId: child?.productId ?? child.componentId,
          };
        }),
      };
    }),
    ...cloudTableData.value.map((product) => {
      return {
        id: product.componentId, // the original component id used for updating
        type: "cloud",
        additionalDescription: product?.additionalDescription ?? "",
        productId: product?.productId ?? "",
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        salePrice: product.salePrice,
        paymentPeriod: product.paymentPeriodId,
        // this.periods?.data?.find(
        //     (period) => period.id === product.paymentPeriod
        // ) ?? product.paymentPeriod,
        duration: product.duration,
        productFullDetails: { ...product },
        children: (product.childComponents ?? []).map((child) => {
          return {
            ...child,
            id: child?.componentId,
            productId: child?.productId ?? child?.componentId,
          };
        }),
      };
    }),
    ...softwareLicencesTableData.value.map((product) => {
      return {
        id: product.componentId, // the original component id used for updating
        type: "license",
        additionalDescription: product?.additionalDescription ?? "",
        productId: product?.productId ?? "",
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        maintenanceRate: product.maintenanceRate,
        productFullDetails: { ...product },
      };
    }),
    ...softwareMaintenanceTableData.value.map((product) => {
      return {
        id: product.componentId, // the original component id used for updating
        additionalDescription: product?.additionalDescription ?? "",
        type: "maintenance",
        productId: product?.productId ?? "",
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        maintenanceRate: product.maintenanceRate,
        productFullDetails: { ...product },
      };
    }),
  ];

  payload.optionalTypes = [
    ...optionalAmsTableData.value.map((product) => {
      return {
        id: product.componentId,
        // id:
        //     buttonType === "copy"
        //         ? null
        //         : this.optionalComponentIdsMappedToProductIds[
        //               "ams"
        //           ][product?.productId ?? product?.id],
        type: "application",
        productId: product?.productId ?? "",
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.serviceHours,
        tax: product.tax,
        hourlyRate: product.hourlyRate,
        // paymentPeriod:
        //     this.periods?.data?.find(
        //         (period) => period.id === product.paymentPeriod
        //     ) ?? product.paymentPeriod,
        paymentPeriod: product.paymentPeriodId,
        productFullDetails: {
          ...product,
          slaInfrastructureId: product?.slaInfrastructureId,
          slaServiceTimeId: product?.slaServiceTimeId,
          slaLevelIncidentId: product?.slaLevelIncidentId ?? "",
          slaLevelChangeId: product?.slaLevelChangeId ?? "",
        },
      };
    }),
    ...optionalCloudTableData.value.map((product) => {
      return {
        id: product.componentId,
        // id:
        //     buttonType === "copy"
        //         ? null
        //         : this.optionalComponentIdsMappedToProductIds[
        //               "cloud"
        //           ][product?.productId ?? product?.id],
        type: "cloud",
        productId: product?.productId ?? "",
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        salePrice: product.salePrice,
        paymentPeriod: product.paymentPeriodId,

        // paymentPeriod:
        //     this.periods?.data?.find(
        //         (period) => period.id === product.paymentPeriod
        //     ) ?? product.paymentPeriod,
        duration: product.duration,
        productFullDetails: { ...product },
      };
    }),
    ...optionalHostingTableData.value.map((product) => {
      return {
        id: product.componentId,
        // id:
        //     buttonType === "copy"
        //         ? null
        //         : this.optionalComponentIdsMappedToProductIds[
        //               "hosting"
        //           ][product?.productId ?? product?.id],
        type: "hosting",
        productId: product?.productId ?? "",
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        pricePerPeriod: product.pricePerPeriod,
        paymentPeriod: product.paymentPeriodId,
        // paymentPeriod:
        //     this.periods?.data?.find(
        //         (period) => period.id === product.paymentPeriod
        //     ) ?? product.paymentPeriod,
        productFullDetails: { ...product },
      };
    }),
    ...optionalSoftwareLicencesTableData.value.map((product) => {
      return {
        type: "license",
        id: product.componentId,
        productId: product?.productId ?? "",
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        maintenanceRate: product.maintenanceRate,
        productFullDetails: { ...product },
      };
    }),
    ...optionalSoftwareMaintenanceTableData.value.map((product) => {
      return {
        type: "maintenance",
        id: product.componentId,
        productId: product?.productId ?? "",
        salePrice: product.salePrice,
        discount: product.discount,
        quantity: product.quantity,
        tax: product.tax,
        maintenanceRate: product.maintenanceRate,
        productFullDetails: { ...product },
      };
    }),
  ];

  if (state.groupBy === "nothing") {
    servicesTableData.value.forEach((service) => {
      payload.types.push({
        ...service,
        id: service.componentId,
        // id:
        //   buttonType === "copy"
        //     ? null
        //     : this.optionalComponentIdsMappedToProductIds["services"][
        //         service.id
        //       ],
        additionalDescription: service?.additionalDescription ?? "",
        productId: service?.productId ?? "",
        type: "service",
        children: (service.childComponents ?? []).map((child) => {
          return {
            ...child,
            id: child.componentId,
            productId: child?.productId ?? "",
          };
        }),
      });
    });
    optionalServicesTableData.value.forEach((service) => {
      payload.optionalTypes.push({
        ...service,
        id: service.componentId,
        // id:
        //   buttonType === "copy"
        //     ? null
        //     : this.optionalComponentIdsMappedToProductIds["services"][
        //         service.id
        //       ],
        productId: service?.productId ?? service.componentId,
        type: "service",
      });
    });
  } else {
    servicesTableDataByCategory.value.forEach((category) => {
      payload.types.push({
        ...category,
        type: "service",
        id: category.componentId,
        // id:
        //   buttonType === "copy"
        //     ? null
        //     : this.optionalComponentIdsMappedToProductIds["services"][
        //         category.products?.[0]?.product?.id ??
        //           category.products?.[0]?.id
        //       ],
        additionalDescription: category?.additionalDescription ?? "",
        productFullDetails: category.products,
        productId:
          category.products?.[0]?.product?.id ?? category.products?.[0]?.id,
        productCategoryId: category.id,
        products: category.products.map(
          (product) => product?.product?.id ?? product.id
        ),
      });
    });
    optionalServicesTableDataByCategory.value.forEach((category) => {
      payload.optionalTypes.push({
        ...category,
        type: "service",
        id: category.componentId,
        // id:
        //   buttonType === "copy"
        //     ? null
        //     : this.optionalComponentIdsMappedToProductIds["services"][
        //         category.products?.[0]?.product?.id ??
        //           category.products?.[0]?.id
        //       ],
        productFullDetails: category.products,
        productId:
          category.products?.[0]?.product?.id ?? category.products?.[0]?.id,
        productCategoryId: category.id,
        products: category.products.map(
          (product) => product?.product?.id ?? product.id
        ),
      });
    });
  }
  generateProcessTemplate(payload, documentType);

  // id: offerTemplateId, // of above api call
  // userFirstName: "Marcel",
  // userLastName: "Rupprecht",
  // userPhone: "",
  // company: {
  //   id: "1876f02a-f299-f620-010b-f744ab646b4f",
  //   companyName: companyDetail.companyName,
  //   vatId: "DE320850345",
  //   url: "http://mettner-stahlrohrhandel.de/",
  //   type: "premise",
  //   customerType: "lead",
  //   companyNumber: companyDetail.companyNumber,
  //   state: companyDetail.state,
  //   city: companyDetail.city,
  //   country: companyDetail.country,
  //   address: companyDetail.address,
  //   notes: null,
  //   status: {
  //     id: 1,
  //     name: "Open",
  //     created_at: "2023-06-28T05:36:25.000000Z",
  //     updated_at: "2023-06-28T05:36:25.000000Z",
  //   },
  //   expiryDate: "",
  //   termsOfPayment: 1,
  //   contactReportSources: [],
  //   code: "49219",
  // },
  // offerNumber: "2023-76101",
  // output: "pdf",
  // updatedTime: 1693317676670,
  // offer: "",

  // await invoicePdfGenerationRequest(payload);
};

async function generateProcessTemplate(payload, documentType) {
  // this.$store.commit("isLoading", true);
  // //Get template id by name
  // const templateId = await this.$store.dispatch(
  //     "globalSettings/getTemplateByName",
  //     this.module === "offer"
  //         ? "offerTemplateId"
  //         : "orderConfirmationTemplateId"
  // );

  isLoading.value = true;

  const res = await docSelectedListRequest({ start: 0, count: 25 });
  const offerTemplate = res?.data.find(
    (el: any) => el.key === "offerTemplateId"
  );
  const offerTemplateId = offerTemplate.value;

  //Create template payload and process template
  if (offerTemplateId != "") {
    const templatePayload = {
      ...payload,
      types: payload.types.map((type) => {
        // if groupedBy is set to 'category' then map the 'productFullDetails' array onto 'products'
        if (type.type === "service" && payload.groupedBy === "category") {
          return {
            ...type,
            products: [...type.productFullDetails],
          };
        } else {
          return type;
        }
      }),
      id: offerTemplateId,
      userFirstName: state?.user?.first_name ?? "", //
      userLastName: state?.user?.last_name ?? "",
      userPhone: state?.user?.mobile ?? "",
      company: { ...companyDetail }, // reactive state

      offerNumber: state.offerNumber,
      output: documentType,
      contactPerson:
        (state.contactPerson?.first_name ?? "") +
        " " +
        (state.contactPerson?.last_name ?? ""),
      updatedTime: Date.now(),
      offer: state.selectedOffer,
    };

    const payloadFinal = {
      data: templatePayload,
      filename: `"offer" -` + state.offerNumber + `.${documentType}`,
      documentType: documentType,
    };
    const data = await invoicePdfGenerationRequest(payloadFinal.data);

    // Create a Blob from the data
    const blob = new Blob([data], {
      type: `application/${
        payloadFinal.documentType === "pdf"
          ? "pdf"
          : "vnd.openxmlformats-officedocument.wordprocessingml.document"
      }`,
    });

    // Create a URL for the file
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", payloadFinal.filename);

    // Add the link to the DOM and click it to initiate the download
    document.body.appendChild(link);
    link.click();
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("Configuration") }}</h3>
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
                :textLabel="$t('Reciever Type')"
                :required="true"
                :class="{ 'is-invalid': v$.receiverType.$error }"
              />
              <div v-if="v$.receiverType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.receiverType.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.customerId"
                :options="receiverOptions"
                :key="state.customerId"
                label="name"
                track-by="value"
                :textLabel="$t('Reciever')"
                :required="true"
                :class="{ 'is-invalid': v$.customerId.$error }"
              />
              <div v-if="v$.customerId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.customerId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.contactPersonId"
                :key="state.contactPersonId"
                :options="contactPersonOptions"
                label="name"
                track-by="value"
                :textLabel="$t('Contact Person')"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.termOfPaymentId"
                :options="termOfPaymentOptions"
                :key="state.termOfPaymentId"
                label="name"
                track-by="value"
                :textLabel="$t('Terms of Payment')"
                :required="true"
                :class="{ 'is-invalid': v$.termOfPaymentId.$error }"
              />
              <div v-if="v$.termOfPaymentId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.termOfPaymentId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.projectId"
                :options="projectOptions"
                :key="state.projectId"
                label="name"
                track-by="value"
                :textLabel="$t('Project')"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.offerType"
                :options="offerTypeOptions"
                :key="state.offerType"
                label="name"
                track-by="value"
                :textLabel="$t('Offer Type')"
                :required="true"
                :class="{ 'is-invalid': v$.offerType.$error }"
              />
              <div v-if="v$.offerType.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.offerType.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4" v-if="state.offerType === 'budget_offer'">
            <div class="form-group">
              <elements-multiselect
                v-model="state.template"
                :options="templateOptions"
                :key="state.template"
                label="name"
                track-by="value"
                :textLabel="$t('Template')"
              />
            </div>
          </div>
          <div class="col-lg-4" v-if="state.offerType === 'budget_offer'">
            <div class="form-group">
              <elements-multiselect
                v-model="state.groupBy"
                :options="groupedByOptions"
                :key="state.groupBy"
                label="name"
                track-by="value"
                :textLabel="$t('Grouped by')"
              />
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-input
                v-model="state.expiryDate"
                :key="state.expiryDate"
                :label="$t('Expiry date')"
                :required="true"
                id="group-name"
                :class="{ 'is-invalid': v$.expiryDate.$error }"
                type="date"
              />
              <div v-if="v$.expiryDate.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.expiryDate.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect
                v-model="state.offerStatus"
                :options="statusOptions"
                :key="state.offerStatus"
                label="name"
                track-by="value"
                :textLabel="$t('Status')"
                :required="true"
                :class="{ 'is-invalid': v$.offerStatus.$error }"
              />
              <div v-if="v$.offerStatus.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.offerStatus.required">{{
                  $t("This value is required")
                }}</span>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group textarea">
              <textarea
                v-model="state.paymentTerm"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
              ></textarea>
              <label for="" class="input-label">Payment Terms</label>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <label for="">Components</label>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="license"
                  value="license"
                  v-model="productType"
                />
                <label for="license">Software Licences</label>
              </div>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="license"
                  value="license"
                  v-model="productType"
                />
                <label for="license">Software Maintenance</label>
              </div>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="service"
                  value="service"
                  v-model="productType"
                />
                <label for="service">Services</label>
              </div>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="application"
                  value="application"
                  v-model="productType"
                />
                <label for="application">Application Management Service</label>
              </div>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="hosting"
                  value="hosting"
                  v-model="productType"
                />
                <label for="hosting">Hosting</label>
              </div>
              <div>
                <input
                  class="me-2"
                  type="checkbox"
                  id="cloud"
                  value="cloud"
                  v-model="productType"
                />
                <label for="cloud">Cloud</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card no-header mt-4">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group textarea">
              <textarea
                v-model="state.coverLetterText"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
              ></textarea>
              <label for="" class="input-label">Cover Letter Text</label>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group textarea">
              <textarea
                v-model="state.descriptionText"
                cols="30"
                rows="10"
                class="form-control"
                placeholder="."
              ></textarea>
              <label for="" class="input-label">Offer Description Text</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card w-50 my-4" v-if="companyDetail.companyName">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <h3 class="card-title">{{ $t("Company Details") }}</h3>
      </div>

      <div class="card-body">
        <span>
          {{ companyDetail?.companyName ?? "-" }}
          <div v-if="state.contactPersonId">
            {{ companyDetail?.contactPerson ?? "-" }}
            <br />
          </div>
          <br v-else />
          {{ companyDetail?.address ?? "-" }}
          <br />
          {{ companyDetail.code ?? " - " }}&nbsp;{{ companyDetail.city ?? "-" }}
          <br />
          {{ companyDetail?.state ?? " - " }}
          <br />
          {{ companyDetail?.country ?? " - " }}
        </span>
      </div>
    </div>

    <!-- <div class="my-5 text-gray-500 flex justify-between font-bold">
        <h1 class="secondary-color text-2xl">
            {{$t("DraftOffer Confirmation")}}
        </h1>
        <h6>
          {{ dateFormatter(new Date()) }}
        </h6>
    </div> -->
    <div class="d-flex" style="grid-template-columns: repeat(auto-fit, 500px)">
      <div class="mb-8" style="color: #2957a4">
        <div class="d-flex">
          <b class="mx-4">{{ $t("Customer Nr.") }}</b>
          <p>{{ companyDetail.companyNumber ?? "-" }}</p>
        </div>
        <div class="d-flex">
          <b class="mx-4">{{ $t("Project Nr.") }}</b>
          <p>{{ state?.projectId ?? "-" }}</p>
        </div>
        <div class="d-flex">
          <b class="mx-4"> {{ $t(`${"Offer No"}`) }}</b>
          <p>{{}}</p>
        </div>
      </div>
      <div class="mb-8" style="color: #2957a4">
        <div v-if="state.logedinUserId" class="d-flex">
          <b class="mx-4">{{ $t("Created By") }}:</b>
          <!-- <p>{{ user?.first_name }} {{ user?.last_name }}</p> -->
          <p>{{ state.logedinUserId }}</p>
        </div>
        <div v-if="state.expiryDate" class="d-flex">
          <b class="mx-4">{{ $t("Expiry Date") }}:</b>
          <p>
            {{
              dateFormatter(
                formatDateLite(new Date(state.expiryDate)),
                globalLanguage
              )
            }}
          </p>
        </div>
      </div>
    </div>

    <div v-for="(prodType, index) in productType" :key="index">
      <div v-if="prodType === `license`">
        <offer-and-offer-confirm-software-licanace-maintinance-table
          :softwareLicencesTableData="softwareLicencesTableData"
          :optionalSoftwareLicencesTableData="optionalSoftwareLicencesTableData"
          :softwareMaintenanceTableData="softwareMaintenanceTableData"
          :optionalSoftwareMaintenanceTableData="
            optionalSoftwareMaintenanceTableData
          "
          :softwareLicencesSummery="softwareLicencesSummery"
          :softwareMaintenanceSummery="softwareMaintenanceSummery"
          @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle"
          @calculateProductValue="calculateProductValue"
        />
      </div>

      <div v-if="prodType === `service`">
        <offer-and-offer-confirm-service-table
          :servicesTableData="servicesTableData"
          :servicesTableDataByCategory="servicesTableDataByCategory"
          :optionalServicesTableData="optionalServicesTableData"
          :optionalServicesTableDataByCategory="
            optionalServicesTableDataByCategory
          "
          :groupBy="state.groupBy"
          :serviceSummery="serviceSummery"
          :serviceSummeryByCategory="serviceSummeryByCategory"
          @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle"
          @calculateProductValue="calculateProductValue"
        />
      </div>
      <div v-if="prodType === `application`">
        <offer-and-offer-confirm-ams-table
          :amsTableData="amsTableData"
          :optionalAmsTableData="optionalAmsTableData"
          :globalPeriodAMS="globalPeriodAMS"
          :amsSummery="amsSummery"
          @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle"
          @addSlaToggle="addSlaToggle"
          @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
          @calculateProductValue="calculateProductValue"
        />
      </div>

      <div v-if="prodType === `hosting`">
        <offer-and-offer-confirm-hosting-table
          :hostingTableData="hostingTableData"
          :optionalHostingTableData="optionalHostingTableData"
          :hostingSummery="hostingSummery"
          @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle"
          @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
          @calculateProductValue="calculateProductValue"
        />
      </div>

      <div v-if="prodType === `cloud`">
        <offer-and-offer-confirm-cloud-table
          :cloudTableData="cloudTableData"
          :optionalCloudTableData="optionalCloudTableData"
          :cloudSummery="cloudSummery"
          @addProduct="addProduct"
          @additiontalDescToggle="additiontalDescToggle"
          @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
          @calculateProductValue="calculateProductValue"
        />
      </div>
    </div>

    <offer-and-offer-confirm-add-software-licances-product
      v-if="
        isModalOpen &&
        (selectedComponentType === 'licences' ||
          selectedComponentType === 'licencesOptional')
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @productAdded="productAdded"
    />

    <offer-and-offer-confirm-add-services-product
      v-if="
        isModalOpen &&
        (selectedComponentType === 'services' ||
          selectedComponentType === 'servicesOptional' ||
          selectedComponentType === 'childServices')
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @productAdded="productAdded"
    />

    <offer-and-offer-confirm-add-ams-product
      v-if="
        isModalOpen &&
        (selectedComponentType === 'ams' ||
          selectedComponentType === 'amsOptional')
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @productAdded="productAdded"
    />

    <offer-and-offer-confirm-add-hosting-product
      v-if="
        isModalOpen &&
        (selectedComponentType === 'hosting' ||
          selectedComponentType === 'hostingOptional' ||
          selectedComponentType === 'childHosting')
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @productAdded="productAdded"
    />

    <offer-and-offer-confirm-add-cloud-product
      v-if="
        isModalOpen &&
        (selectedComponentType === 'cloud' ||
          selectedComponentType === 'cloudOptional' ||
          selectedComponentType === 'childCloud')
      "
      :showModal="isModalOpen"
      :hideModal="hideModal"
      @productAdded="productAdded"
    />

    <div
      v-if="props.recordId"
      class="mt-4 d-flex align-items-center justify-content-end"
    >
      <submittal-button
        @click="generate('pdf')"
        :isLoading="isLoading"
        :buttonName="$t('Generate PDF')"
      />
    </div>
    <div
      v-if="props.recordId"
      class="mt-4 d-flex align-items-center justify-content-end"
    >
      <submittal-button
        @click="generate('docx')"
        :isLoading="isLoading"
        :buttonName="$t('Generate Docx')"
      />
    </div>

    <div
      v-if="props.recordId"
      class="mt-4 d-flex align-items-center justify-content-end"
    >
      <submittal-button
        @click="saveOffersHandler(true)"
        :isLoading="isLoading"
        :buttonName="$t('Update')"
      />
    </div>

     <div
      v-if="props.recordId"
      class="mt-4 d-flex align-items-center justify-content-end"
    >
      <submittal-button
        @click="saveOffersHandler()"
        :isLoading="isLoading"
        :buttonName="$t('Copy Offer')"
      />
    </div>

    <div v-else class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button
        @click="saveOffersHandler"
        :isLoading="isLoading"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
</template>

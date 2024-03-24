<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import SoftwareLicenceTable from "./SoftwareLicenceTable.vue";
import SoftwareMaintananceTable from "./SoftwareMaintananceTable.vue";
import ServiceTable from "./ServiceTable.vue";
import AmsTable from "./AmsTable.vue";
import HostingTable from "./HostingTable.vue";
import CloudTable from "./CloudTable.vue";
import AddSoftwareLicancesProduct from "./AddSoftwareLicancesProduct.vue";
import AddSoftwareMaintananceProduct from "./AddSoftwareMaintananceProduct.vue";
import AddServicesProduct from "./AddServicesProduct.vue";
import AddAmsProduct from "./AddAmsProduct.vue";
import AddHostingProduct from "./AddHostingProduct.vue";
import AddCloudProduct from "./AddCloudProduct.vue";
import genericFeatures from "~/composables/generic";
import { useAppStore } from "~/store/app";
import { useLayoutStore } from "~/store/layout";
import {
  getTermsOfPaymentByIdRequest,
  invoiceCreateRequest,
  invoiceShowRequest,
  invoiceUpdateRequest,
  invoicePdfGenerationRequest,
  docSelectedListRequest,
  genericListingRequest,
} from "@/utils/apiRequests";
import { getApiResponse, MethodType } from "~/utils/axiosFunctions";

const appStore = useAppStore();
const runtimeConfig = useRuntimeConfig();
const props = defineProps(["recordId"]);

const { showGenericListing } = genericFeatures();
const { router, Toast } = commonCode(),
  { t } = useI18n(),
  documentTemplates = ref(null),
  offerTemplateId = ref(""),
  isStatus = ref(true),
  isStatusDraft = ref(true),
  state = reactive({
    category: "",
    invoiceType: "",
    dueDate: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
    customerId: "", // receiver
    contactPersonId: "",
    termOfPaymentId: "",
    startDate: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
    endDate: new Date(new Date().getFullYear(), 11, 31)
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "-"),
    invoiceDate: new Date().toJSON().slice(0, 10).replace(/-/g, "-"),
    projectId: null,
    template: "",
    groupBy: "nothing",
    status: "",
    paymentTerm: "",
    paymentPeriod: "",
    customNotesField: "",
    amountWithoutTax: 0.0,
    taxAmount: 0.0,
    totalAmount: 0.0,
    systemId: "",
    recreateAfter: "",
    performanceNumber: "",
  }),
  invoiceStatuses = ref([]),
  customerDetails = reactive({
    id: "",
    name: "",
    address: "",
    zipCode: "",
    city: "",
    number: "",
    state: "",
    country: "",
  }),
  pdfProducts = ref([]),
  termPaymentNo = ref(""),
  termsOfPaymentOptions = ref([]),
  projectOptions = ref([]),
  systemOptions = ref([]),
  servicesTableCategoryForEdit = ref([]),
  categoryOptions = [
    { value: "license", name: "Software License" },
    { value: "maintenance", name: "Software Maintenance" },
    { value: "service", name: "Service" },
    { value: "ams", name: "Application Management Service" },
    { value: "hosting", name: "Hosting" },
    { value: "cloud", name: "Cloud" },
  ],
  invoiceOptions = [
    { value: "invoice-correction", name: "Invoice Correction" },
    { value: "invoice", name: "Invoice" },
    { value: "invoice-storno", name: "Invoice Storno" },
  ],
  recreateOptions = [
    { value: "2W", name: "2 Weeks" },
    { value: "1M", name: "1 Month" },
    { value: "3M", name: "3 Month" },
    { value: "6M", name: "6 Month" },
    { value: "12M", name: "12 Month" },
  ],
  customers = ref([]),
  contactPersons = ref([]),
  isModalOpen = ref(false),
  isLoading = ref(false),
  paymentPeriodOptions = ref([]),
  selectedComponentType = ref(""),
  parentComponentIndex = ref(null); // used when adding childComponents to any parent object


const softwareLicencesTableData = ref([]);

const softwareMaintenanceTableData = ref([]);

const servicesTableData = ref([]);

const servicesTableDataByCategory = ref([]);

const amsTableData = ref([]);

const hostingTableData = ref([]);

const cloudTableData = ref([]);

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

let validationRules = {
  category: { required },
  invoiceType: { required },
  dueDate: { required },
  customerId: { required },
  startDate: { required },
  endDate: { required },
  termOfPaymentId: { required },
  paymentPeriod: { required },
};
let v$ = useVuelidate(validationRules, state);


function hideModal() {
  isModalOpen.value = false;
}
function showModal() {
  isModalOpen.value = true;
}

watch(
  [() => state.groupBy, () => servicesTableCategoryForEdit.value],
  ([groupByValue, servicesTableCategoryForEditValue], []) => {
    if (
      groupByValue === "nothing" &&
      servicesTableCategoryForEditValue.length > 0
    ) {
      servicesTableData.value = servicesTableCategoryForEditValue;
      servicesTableCategoryForEdit.value = []; // reset to empty array
      // when groupBY change to category, then above watcher run
    }
  },
  { deep: true }
);

watch(
  () => state.termOfPaymentId,
  (termOfPaymentId) => {
    state.paymentTerm = "";
    termPaymentNo.value = "";
    if (termOfPaymentId) {
      getTermsOfPaymentByIdRequest(termOfPaymentId).then((response) => {
        termPaymentNo.value = response?.data?.paymentTermNo;
        state.paymentTerm = response?.data?.textOnInvoice;
      });
    }
  }
);

watch(
  () => state.customerId,
  (customerId) => {
    if (!customerId) {
      customerDetails.id = "";
      customerDetails.name = "";
      customerDetails.address = "";
      customerDetails.zipCode = "";
      customerDetails.city = "";
      customerDetails.number = "";
      customerDetails.state = "";
      customerDetails.country = "";
    }
  }
);

watch(
  () => state.status,
  (status) => {
    if (!status) {
      isStatusDraft.value = true
    }
    if (status != 'draft') {
      isStatusDraft.value = false
    }
    else {
      isStatusDraft.value = true
    }
  }
);

const getContactPersons = (val: string) => {
  const matchingCustomer = customers.value.find(
    (customer) => customer.value === val
  );

  if (matchingCustomer) {
    customerDetails.id = matchingCustomer?.value;
    customerDetails.name = matchingCustomer?.text;
    customerDetails.address = matchingCustomer?.addressLine1;
    customerDetails.zipCode = matchingCustomer?.zipCode;
    customerDetails.city = matchingCustomer?.city;
    customerDetails.number = matchingCustomer?.number;
    customerDetails.state = matchingCustomer?.state;
    customerDetails.country = matchingCustomer?.country;
  }

  showGenericListing(routes.PROJECT_DETAIL, {
    customerId: val,
  }).then((response) => {
    projectOptions.value = response?.data?.projects?.map((project: any) => {
      return {
        text: project.name,
        value: project.id,
      };
    });
  });


  showGenericListing(routes.SYSTEM, {
    customerId: val,
  }).then((response) => {
    systemOptions.value = response?.data[0]?.systems?.map((system: any) => {
      return {
        text: system.number,
        value: system.id,
      };
    });
  });

  showGenericListing(runtimeConfig.public.authBaseUrl + routes.LIST_USERS, {
    limit_start: 0,
    limit_count: 100,
    type: "customer",
    company_id: val,
  }).then((response) => {
    contactPersons.value = response?.data?.map((manager: any) => {
      return {
        text: manager.first_name + "  " + manager.last_name,
        value: manager.id,
      };
    });
  });
};

const generate = (documentType: string) => {
  isLoading.value = true;
  if (state.invoiceType == 'invoice-correction') {
    const offerTemplate = documentTemplates.value.find((el) => el.key === "invoiceCorrectionTemplateId");
    offerTemplateId.value = offerTemplate.value;
  }

  if (state.invoiceType == 'invoice') {
    if (isPerformenceRecord) {
      const offerTemplate = documentTemplates.value.find((el) => el.key === "perfRecordTemplateId");
      offerTemplateId.value = offerTemplate.value;
    } else {
      const offerTemplate = documentTemplates.value.find((el) => el.key === "invoiceTemplateId");
      offerTemplateId.value = offerTemplate.value;
    }
  }

  if (state.invoiceType == 'invoice-storno') {
    const offerTemplate = documentTemplates.value.find((el) => el.key === "invoiceStornoTemplateId");
    offerTemplateId.value = offerTemplate.value;
  }

  if (state.category == "license") {
    pdfProducts.value = softwareLicencesTableData.value;
  }

  if (state.category == "maintenance") {
    pdfProducts.value = softwareMaintenanceTableData.value;
  }

  if (state.category == "service" && state.groupBy == "nothing") {
    pdfProducts.value = servicesTableData.value;
  }

  if (state.category == "service" && state.groupBy == "category") {
    pdfProducts.value = servicesTableDataByCategory.value;
  }

  if (state.category == "ams") {
    pdfProducts.value = amsTableData.value;
  }

  if (state.category == "hosting") {
    pdfProducts.value = hostingTableData.value;
  }
  if (state.category == "cloud") {
    pdfProducts.value = cloudTableData.value;
  }
  const payload = {
    products: pdfProducts.value,
    category: state.category,
    contactPerson: state.contactPersonId,
    customNotesFields: state.customNotesField,
    dueDate: state.dueDate,
    endDate: state.endDate,
    groupedBy: state.groupBy,
    customers: customerDetails,
    id: offerTemplateId.value,
    invoiceDate: state.invoiceDate,
    invoiceType: state.invoiceType,
    output: documentType,
    startDate: state.startDate,
    totalAmount: state.totalAmount,
    totalAmountWithoutTax: state.amountWithoutTax,
    totalTaxAmount: state.taxAmount,
    updatedTime: Date.now(),
    categories: [],
  };
  isLoading.value = false;
  invoicePdfGenerationRequest(payload).then((response) => {
    // Get the data from the response
    const data = response.data;

    // Create a Blob from the data
    const blob = new Blob([data], {
      type: `application/${documentType === "pdf"
        ? "pdf"
        : "vnd.openxmlformats-officedocument.wordprocessingml.document"
        }`,
    });

    // Create a URL for the file
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice");

    // Add the link to the DOM and click it to initiate the download
    document.body.appendChild(link);
    link.click();
  });
};

// If from Performance record
const route = useRoute()
const performanceRecords = ref([]);
const performanceId = ref('');
const disableElement = ref(false);
const isPerformenceRecord = ref(false);
const data = ref({});
const productData = ref([]);
const performanceDefaultProduct = ref({});

if (route.query?.performanceRecord) {
  //Disable Dropdown
  disableElement.value = true;

  isPerformenceRecord.value = true;

  performanceId.value = route.query?.performanceRecord;

  // Validate
  const performanceRecordValidations = {
    contactPersonId: { required },
    systemId: { required },
    projectId: { required },
    recreateAfter: { required },
  };

  // Merge the performanceRecordValidations into the existing validationRules
  validationRules = {
    ...validationRules,
    ...performanceRecordValidations
  };

  // Re-create v$ with the updated validationRules
  v$ = useVuelidate(validationRules, state);

  //Select Category
  state.category = categoryOptions.find((item) => item.name === 'Service')?.value;

  //Select Invoice type
  state.invoiceType = invoiceOptions.find((item) => item.name === 'Invoice')?.value;

  const getPerfomanceRecord = async () => {
    //fetch performance record
    let prPayload = {
      showUnapproved: true,
      sortOrder: 'desc',
      company: "",
      selectedIds: [performanceId.value],
    }
    await getApiResponse(routes.PERFORMANCE_RECORD, true, MethodType.get, {}, prPayload).then((response: any) => {
      const { data: { records } } = response;
      performanceRecords.value = records;
      fetchProduct();
    });

    let requestedPerformanceObj = performanceRecords.value.find((item: any) => item.id == performanceId.value);
    //Assign performance number & Comapny
    state.performanceNumber = requestedPerformanceObj?.performanceNumber;
    state.customerId = requestedPerformanceObj?.companyId
    getContactPersons(requestedPerformanceObj?.companyId);

  };

  const fetchProduct = async () => {
    const prodRes = await genericListingRequest(routes.PRODUCT, {
      page: 1,
      perpage: 10,
      type: "service",
    });
    data.value = prodRes?.data;
    productData.value = prodRes.data.products.map((prod: any) => {
      return {
        ...prod,
        quantity: prod.quantity ?? 1,
      };
    });

    const performance = performanceRecords.value.find((item: any) => item.id == performanceId.value);
    performanceDefaultProduct.value = prodRes?.data?.products.find((pro: any) => pro.id === performance.defaultServiceProduct);
    let product = performanceDefaultProduct.value;
    product = { ...product, quantity: product?.quantity ?? 1, }
    servicesTableData.value.push(assignDefaultPerformanceProduct(product));
  }

  const assignDefaultPerformanceProduct = (product: object) => {
    return {
      type: "service",
      productId: product.id,
      articleNumber: product.articleNumber,
      name: product.name,
      quantity: product.quantity,
      unit: product.productUnit.name,
      hourlyRate: product.hourlyRate,
      discount: product.discount,
      tax: product.tax,
      taxRate: (product.tax / 100) * (product.quantity * product.hourlyRate),
      totalNetto:
        product.quantity * product.hourlyRate -
        (product.discount / 100) * (product.quantity * product.hourlyRate),
      totalRate: product.quantity * product.hourlyRate, // that of child
      additionDescription: "",
      descriptionToggle: false,
      productCategory: {
        id: product.productCategory.id,
        name: product.productCategory.name,
      },
      childComponents: [],
    }
  }

  getPerfomanceRecord();
}



async function store() {

  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      isLoading.value = true;
      const loggedinUserId = localStorage.getItem("user_id");
      const formData = {
        ...(state.category && { category: state.category }),
        ...(state.recreateAfter && { recreateAfter: state.recreateAfter }),
        ...(state.invoiceType && { invoiceType: state.invoiceType }),
        ...(state.dueDate && {
          dueDate: state.dueDate,
        }),
        ...(state.customerId && {
          customerId: state.customerId,
        }),
        ...(state.projectId && {
          projectId: state.projectId,
        }),
        ...(state.systemId && {
          systemId: state.systemId,
        }),
        ...(state.contactPersonId && {
          contactPersonId: state.contactPersonId,
        }),
        ...(state.groupBy && { groupBy: state.groupBy }),
        ...(state.startDate && { startDate: state.startDate }),
        ...(state.endDate && { endDate: state.endDate }),
        ...(state.invoiceDate && { invoiceDate: state.invoiceDate }),
        ...(state.paymentTerm && { paymentTerm: state.paymentTerm }),
        ...(state.paymentPeriod && {
          paymentPeriodId: state.paymentPeriod,
        }),
        ...(state.amountWithoutTax && {
          amountWithoutTax: state.amountWithoutTax,
        }),
        ...(state.taxAmount && {
          taxAmount: state.taxAmount,
        }),
        ...(state.totalAmount && {
          totalAmount: state.totalAmount,
        }),
        createdBy: loggedinUserId, // loggedIn user id.
        status: "draft", // always draft when creating
        ...(state.termOfPaymentId && {
          termOfPaymentId: state.termOfPaymentId,
        }),
        ...(state.customNotesField && {
          customNotes: state.customNotesField,
        }),
        ...(state.paymentTerm && {
          paymentTerms: state.paymentTerm,
        }),
        ...(softwareLicencesTableData.value.length > 0 && {
          products: softwareLicencesTableData.value,
        }),
        ...(softwareMaintenanceTableData.value.length > 0 && {
          products: softwareMaintenanceTableData.value,
        }),
        ...(state.groupBy === "nothing" &&
          servicesTableData.value.length > 0 && {
          products: servicesTableData.value,
        }),
        ...(state.groupBy === "category" &&
          servicesTableDataByCategory.value.length > 0 && {
          products: servicesTableDataByCategory.value,
        }),
        ...(amsTableData.value.length > 0 && {
          products: amsTableData.value,
        }),
        ...(hostingTableData.value.length > 0 && {
          products: hostingTableData.value,
        }),
        ...(cloudTableData.value.length > 0 && {
          products: cloudTableData.value,
        }),
        ...(performanceId.value.length > 0 && {
          performanceRecordId: performanceId.value,
        }),
      };
      const res = await invoiceCreateRequest(formData);
      Toast.fire({
        title: "Record created successfully!",
        icon: "success",
      });
      isLoading.value = false;
      navigateTo("/finance/invoices");
    } catch (e) {
      console.log(e);
      Toast.fire({
        title: t("something went wrong"),
        text: t("Error"),
        icon: "error",
      });
      isLoading.value = false;
    }
  }
}

async function update() {
  isStatus.value = true;
  // stop here if form is invalid
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  } else {
    try {
      if (state.status == null) {
        isStatus.value = false;
        return;
      }
      isLoading.value = true;
      const loggedinUserId = localStorage.getItem("user_id");
      const formData = {
        id: props.recordId,
        ...(state.category && { category: state.category }),
        ...(state.recreateAfter && { recreateAfter: state.recreateAfter }),
        ...(state.invoiceType && { invoiceType: state.invoiceType }),
        ...(state.dueDate && {
          dueDate: state.dueDate,
        }),
        ...(state.customerId && {
          customerId: state.customerId,
        }),
        ...(state.contactPersonId && {
          contactPersonId: state.contactPersonId,
        }),
        ...(state.groupBy && { groupBy: state.groupBy }),
        ...(state.startDate && { startDate: state.startDate }),
        ...(state.endDate && { endDate: state.endDate }),
        ...(state.invoiceDate && { invoiceDate: state.invoiceDate }),
        ...(state.paymentTerm && { paymentTerm: state.paymentTerm }),
        ...(state.paymentPeriod && {
          paymentPeriodId: state.paymentPeriod,
        }),
        ...(state.amountWithoutTax && {
          amountWithoutTax: state.amountWithoutTax,
        }),
        ...(state.taxAmount && {
          taxAmount: state.taxAmount,
        }),
        ...(state.totalAmount && {
          totalAmount: state.totalAmount,
        }),
        createdBy: loggedinUserId, // loggedIn user id.
        status: state.status,
        ...(state.termOfPaymentId && {
          termOfPaymentId: state.termOfPaymentId,
        }),
        ...(state.customNotesField && {
          customNotes: state.customNotesField,
        }),
        ...(state.paymentTerm && {
          paymentTerms: state.paymentTerm,
        }),
        ...(softwareLicencesTableData.value.length > 0 && {
          products: softwareLicencesTableData.value,
        }),
        ...(softwareMaintenanceTableData.value.length > 0 && {
          products: softwareMaintenanceTableData.value,
        }),
        ...(state.groupBy === "nothing" &&
          servicesTableData.value.length > 0 && {
          products: servicesTableData.value,
        }),
        ...(state.groupBy === "category" &&
          servicesTableDataByCategory.value.length > 0 && {
          products: servicesTableDataByCategory.value,
        }),
        ...(amsTableData.value.length > 0 && {
          products: amsTableData.value,
        }),
        ...(hostingTableData.value.length > 0 && {
          products: hostingTableData.value,
        }),
        ...(cloudTableData.value.length > 0 && {
          products: cloudTableData.value,
        }),
        ...(performanceId.value != '' && {
          performanceRecordId: performanceId.value,
        }),
      };
      const res = await invoiceUpdateRequest(formData, props.recordId);
      Toast.fire({
        title: "Record updated successfully!",
        icon: "success",
      });
      isLoading.value = false;
      navigateTo("/finance/invoices");
    } catch (e) {
      console.log(e);
      Toast.fire({
        title: t("something went wrong"),
        text: t("Error"),
        icon: "error",
      });
      isLoading.value = false;
    }
  }
}

// update paymentPeriodId globally
function resetValues() {
  softwareLicencesTableData.value = [];

  softwareMaintenanceTableData.value = [];

  servicesTableData.value = [];

  servicesTableDataByCategory.value = [];
  amsTableData.value = [];

  hostingTableData.value = [];

  cloudTableData.value = [];
}

function productAdded(product) {
  console.log('************ product', product);
  if (selectedComponentType.value === "licences") {
    product.map((prod) => {
      softwareLicencesTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "maintainance") {
    product.map((prod) => {
      softwareMaintenanceTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "services") {
    product.map((prod) => {
      servicesTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childServices") {
    product.map((prod) => {
      servicesTableData.value[parentComponentIndex.value].childComponents.push(
        prod
      );
    });
    return;
  } else if (selectedComponentType.value === "ams") {
    product.map((prod) => {
      amsTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "hosting") {
    product.map((prod) => {
      hostingTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childHosting") {
    product.map((prod) => {
      hostingTableData.value[parentComponentIndex.value].childComponents.push(
        prod
      );
    });
    return;
  } else if (selectedComponentType.value === "cloud") {
    product.map((prod) => {
      cloudTableData.value.push(prod);
    });
    return;
  } else if (selectedComponentType.value === "childCloud") {
    product.map((prod) => {
      cloudTableData.value[parentComponentIndex.value].childComponents.push(
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
  } else if (componentType === "maintenance" && changedValue === "quantity") {
    softwareMaintenanceTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
  } else if (componentType === "ams" && changedValue === "quantity") {
    amsTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "quantity") {
    servicesTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
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
  } else if (componentType === "hosting" && changedValue === "quantity") {
    hostingTableData.value[index].quantity = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
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
  } else if (componentType === "cloud" && changedValue === "salePrice") {
    cloudTableData.value[index].salePrice = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
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
  } else if (componentType === "ams" && changedValue === "discount") {
    amsTableData.value[index].discount = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "discount") {
    servicesTableData.value[index].discount = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
  } else if (
    componentType === "serviceByCategory" &&
    changedValue === "discount"
  ) {
    servicesTableDataByCategory.value[index].discount = event.target.value;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  } else if (componentType === "hosting" && changedValue === "discount") {
    hostingTableData.value[index].discount = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
  } else if (componentType === "cloud" && changedValue === "discount") {
    cloudTableData.value[index].discount = event.target.value;
    calculateTotalNetto(cloudTableData, index, "cloud");
  }

  // MAINTENANCE RATE
  else if (
    componentType === "maintenance" &&
    changedValue === "maintenanceRate"
  ) {
    softwareMaintenanceTableData.value[index].maintenanceRate =
      event.target.value;
    calculateTotalNetto(softwareMaintenanceTableData, index, "maintenance");
  }
  // HOURLY RATE
  else if (componentType === "ams" && changedValue === "hourlyRate") {
    amsTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(amsTableData, index, "ams");
  } else if (componentType === "service" && changedValue === "hourlyRate") {
    servicesTableData.value[index].hourlyRate = event.target.value;
    calculateTotalNetto(servicesTableData, index, "service");
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
  }
  // PRICE PER PERIOD
  else if (componentType === "hosting" && changedValue === "pricePerPeriod") {
    hostingTableData.value[index].pricePerPeriod = event.target.value;
    calculateTotalNetto(hostingTableData, index, "hosting");
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
    componentType === "serviceByCategory" &&
    changedValue === "taxRate"
  ) {
    servicesTableDataByCategory.value[index].taxRate = event.target.value;
    servicesTableDataByCategory.value[index].hourlyRate =
      (servicesTableDataByCategory.value[index].taxRate * 100) /
      servicesTableDataByCategory.value[index].tax /
      servicesTableDataByCategory.value[index].quantity;
    calculateTotalNetto(servicesTableDataByCategory, index, "service");
  }
};

const calculateSummary = (tableData: any, tableSummery: any) => {
  let netto = 0;
  let tax = [];
  state.amountWithoutTax = 0.0;
  state.taxAmount = 0.0;
  state.totalAmount = 0.0;
  let percentageTotal = 0;
  if (state.category == "maintenance") {
    tableData?.map((data: any) => {
      netto = parseFloat(netto) + parseFloat(data.totalNetto);
      tax.push(data.tax);
    });
    tableSummery.discountTax = 0;
    const date = new Date();

    tableSummery.discountMonth = date.getMonth();
    tableSummery.netto = (Math.round(netto * 100) / 100).toFixed(2);
    if (tableSummery.discountMonth !== 0) {
      if (tableSummery.netto !== 0)
        tableSummery.discountTax = Math.round(
          parseFloat(tableSummery.netto) *
          (parseFloat(tableSummery.discountMonth) / 12)
        ).toFixed(2);
    }
    tableSummery.nettoTotal = (
      parseFloat(tableSummery.netto) - parseFloat(tableSummery.discountTax)
    ).toFixed(2);
    let finalTax = [...new Set(tax)];
    finalTax.map((fTax) => {
      const percentResult = (fTax / 100) * tableSummery.nettoTotal;
      percentageTotal = percentageTotal + percentResult;
    });

    tableSummery.tax = finalTax;
    tableSummery.total = (
      ((parseFloat(tableSummery.nettoTotal) + parseFloat(percentageTotal)) *
        100) /
      100
    ).toFixed(2);
    state.amountWithoutTax = tableSummery.nettoTotal;

    state.taxAmount = percentageTotal;

    state.totalAmount = tableSummery.total;
  } else {
    tableData?.map((data: any) => {
      netto = parseFloat(netto) + parseFloat(data.totalNetto);
      tax.push(data.tax);
    });
    let finalTax = [...new Set(tax)];
    finalTax.map((fTax) => {
      const percentResult = (fTax / 100) * parseFloat(netto);
      percentageTotal = percentageTotal + percentResult;
    });
    tableSummery.netto = (Math.round(parseFloat(netto) * 100) / 100).toFixed(2);

    tableSummery.tax = finalTax;
    tableSummery.total = (
      Math.round((parseFloat(netto) + parseFloat(percentageTotal)) * 100) / 100
    ).toFixed(2);
    state.amountWithoutTax = tableSummery.netto;
    state.taxAmount = percentageTotal;
    state.totalAmount = tableSummery.total;
  }
};

// watch software licance to calculate summery
watch(
  () => softwareLicencesTableData.value,
  (softwareLicencesData) => {
    calculateSummary(softwareLicencesData, softwareLicencesSummery);
  },
  { deep: true }
);
// watch software maintenance to calculate summery
watch(
  () => softwareMaintenanceTableData.value,
  (softwareMaintinanceData) => {
    calculateSummary(softwareMaintinanceData, softwareMaintenanceSummery);
  },
  { deep: true }
);
watch(
  () => state.status,
  (status) => {
    isStatus.value = true;
  }
);
// watch services to calculate summery
watch(
  () => servicesTableData.value,
  (serviceTable) => {
    calculateSummary(serviceTable, serviceSummery);
  },
  { deep: true }
);
// watch servicesByCategory to calculate summery
watch(
  () => servicesTableDataByCategory.value,
  (serviceTable) => {
    calculateSummary(serviceTable, serviceSummeryByCategory);
  },
  { deep: true }
);
// watch hosting to calculate summery
watch(
  () => hostingTableData.value,
  (hostingTable) => {
    calculateSummary(hostingTable, hostingSummery);
  },
  { deep: true }
);
// watch cloud to calculate summery
watch(
  () => cloudTableData.value,
  (cloudTable) => {
    calculateSummary(cloudTable, cloudSummery);
  },
  { deep: true }
);
// watch ams to calculate summery
watch(
  () => amsTableData.value,
  (amsTableData) => {
    calculateSummary(amsTableData, amsSummery);
  },
  { deep: true }
);

// change software mantinance table on the basic of software licance
watch(
  () => softwareLicencesTableData.value?.length,
  (softwareLicencesLength, softwareLicencesLengthPrev) => {
    if (softwareLicencesLength !== softwareLicencesLengthPrev) {
      const softwareLicense = softwareLicencesTableData.value?.map((sl) => {
        return {
          ...sl,
          type: "license",
          totalNetto:
            (sl?.maintenanceRate / 100) *
            (sl?.quantity * (sl?.quantity * sl?.salePrice)),
        };
      });
      softwareLicencesTableData.value = softwareLicense;
    }
  }
);

// change software mantinance table on the basic of software licance
watch(
  () => softwareMaintenanceTableData.value?.length,
  (softwareLicencesLength, softwareLicencesLengthPrev) => {
    if (softwareLicencesLength !== softwareLicencesLengthPrev) {
      const softwareMaintenanceRate = softwareMaintenanceTableData.value?.map(
        (sl) => {
          return {
            ...sl,
            type: "maintenance",
            totalNetto:
              (sl?.maintenanceRate / 100) *
              (sl?.quantity * (sl?.quantity * sl?.salePrice)),
          };
        }
      );
      softwareMaintenanceTableData.value = softwareMaintenanceRate;
    }
  }
);

function addProduct({ componentType, parentIndex }: { componentType: string; parentIndex?: number; }) {
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
      additiontalDescToggle: ''
    };
  });
}

// when componentType is service and groupBy is category, then group the services according to categories
watch(
  () => state.groupBy,
  (groupByValue) => {
    if (groupByValue === "category") {
      const serviceByCategory = createCategories(servicesTableData.value);

      // removing the deplicate values
      servicesTableDataByCategory.value = serviceByCategory.filter(
        (obj, index) => {
          return index === serviceByCategory.findIndex((o) => obj.id === o.id);
        }
      );
    }
  }
);

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

// For edit case fetch the record
onMounted(async function () {
  try {
    if (!props.recordId) {
      return;
    }
    const layout = useLayoutStore();
    layout.changeLoaderValue(true);

    const document = await docSelectedListRequest({ start: 0, count: 25 });
    documentTemplates.value = document?.data
    const res = await invoiceShowRequest(props.recordId);
    console.log('rssssssssss', res);
    const {
      category,
      invoiceType,
      dueDate,
      paymentTerms,
      groupBy,
      startDate,
      endDate,
      invoiceDate,
      customNotes,
      status,
      performanceRecord,
      recreate_after
    } = res.data;
    // console.log('performanceRecordId', performanceRecordId)
    if (performanceRecord != null) {
      isPerformenceRecord.value = true;
      state.performanceNumber = performanceRecord.performanceNumber;
      performanceId.value = performanceRecord.id;
    }
    state.category = category;
    state.groupBy = groupBy;
    state.invoiceType = invoiceType;
    state.dueDate = dueDate;
    state.startDate = startDate;
    state.endDate = endDate;
    state.invoiceDate = invoiceDate;
    state.recreateAfter = recreate_after;

    state.customerId = res?.data?.customer?.id;
    getContactPersons(state.customerId)
    if (res?.data?.customer) {
      customerDetails.id = state.customerId;
      customerDetails.name = res?.data?.customer?.name;
      customerDetails.address = res?.data?.customer?.location?.addressFirst;
      customerDetails.zipCode = res?.data?.customer?.location?.zip;
      customerDetails.city = res?.data?.customer?.location?.city;
      customerDetails.number = res?.data?.customer?.number;
      customerDetails.state = res?.data?.customer?.location?.state;
      customerDetails.country = res?.data?.customer?.location?.country?.name;
    }

    state.systemId = res?.data?.system?.id
    state.contactPersonId = res?.data?.contactPersonId
    state.paymentTerm = paymentTerms;
    state.projectId = res?.data?.project?.id;

    state.termOfPaymentId = res?.data?.termOfPayment?.id;

    state.customNotesField = customNotes;

    invoiceStatuses.value = res?.data?.invoiceStatuses.map((payment: any) => {
      return {
        text: payment,
        value: payment,
      };
    });
    state.paymentPeriod = res?.data?.paymentPeriod?.id;
    state.status = status;
    if (state.status != 'draft') {
      isStatusDraft.value = false
    }
    if (state.category == "license") {
      softwareLicencesTableData.value = res?.data?.products.map(
        (license: any) => {
          return {
            type: "license",
            productId: license?.product?.id,
            articleNumber: license?.product?.articleNumber,
            name: license?.product?.name,
            quantity: license.quantity,
            salePrice: license.salePrice,
            discount: license.discount,
            maintenanceRate: license.maintenanceRate,
            totalNetto: license.totalNetto,
            tax: license.tax,
            additionDescription: license.additionDescription,
            ...(license.additionDescription && {
              descriptionToggle: true,
            }),
          };
        }
      );
    }

    if (state.category == "maintenance") {
      softwareMaintenanceTableData.value = res?.data?.products.map(
        (maintenance: any) => {
          return {
            type: "maintenance",
            productId: maintenance?.product?.id,
            articleNumber: maintenance?.product?.articleNumber,
            name: maintenance?.product?.name,
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
        }
      );
    }

    if (state.category == "service" && state.groupBy == "nothing") {
      servicesTableData.value = res?.data?.products.map((service: any) => {
        return {
          type: "service",
          productId: service?.product?.id,
          articleNumber: service?.product?.articleNumber,
          name: service?.product?.name,
          quantity: service.quantity,
          unit: service?.product?.productUnit?.name, // not coming from backend
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
                productId: childService.id,
                articleNumber: childService?.product?.articleNumber,
                name: childService?.product?.name,
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
      });
    }

    if (state.category == "service" && state.groupBy == "category") {
      servicesTableDataByCategory.value = res?.data?.products.map(
        (serviceCategory) => {
          return {
            ...serviceCategory,
            name: serviceCategory.productCategory.name,
          };
        }
      );

      (function () {
        let serviceCategoryToNothing = [];
        res?.data?.products.forEach((serviceCategory) => {
          serviceCategory.products.forEach((serviceProd) => {
            // to populate service by nathing case
            serviceCategoryToNothing.push({
              ...serviceProd,
              quantity: 1,
              taxRate: (serviceProd.tax / 100) * (1 * serviceProd.hourlyRate),
              totalNetto:
                1 * serviceProd.hourlyRate -
                (serviceProd.discount / 100) * (1 * serviceProd.hourlyRate),
            });
          });
        });
        servicesTableCategoryForEdit.value = serviceCategoryToNothing;
      })();
    }

    if (state.category == "ams") {
      amsTableData.value = res?.data?.products.map((application: any) => {
        return {
          type: "application",
          productId: application?.product?.id,
          articleNumber: application?.product?.articleNumber,
          name: application?.product?.name,
          productSoftware: application.productSoftware,
          quantity: application.quantity ?? 1,
          productUnit: application?.product?.productUnit, // not coming
          hourlyRate: application.hourlyRate,
          discount: application.discount,
          paymentPeriodId: application.paymentPeriodId,
          tax: application.tax,
          totalNetto: application.totalNetto,
          additionDescription: application.additionDescription,
          ...(application.additionDescription && {
            descriptionToggle: true,
          }),
        };
      });
    }

    if (state.category == "hosting") {
      hostingTableData.value = res?.data?.products.map((hosting: any) => {
        return {
          type: "hosting",
          productId: hosting?.product?.id,
          articleNumber: hosting?.product?.articleNumber,
          name: hosting?.product?.name,
          productSoftware: hosting?.product?.productSoftware,
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
                productId: childHosting?.product?.id,
                articleNumber: childHosting?.product?.articleNumber,
                name: childHosting?.product?.name,
                productSoftware: childHosting?.product?.productSoftware,
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
      });
    }
    if (state.category == "cloud") {
      cloudTableData.value = res?.data?.products.map((cloud: any) => {
        return {
          type: "cloud",
          productId: cloud?.product?.id,
          articleNumber: cloud?.product?.articleNumber,
          name: cloud?.product?.name,
          productSoftware: cloud.product?.productSoftware,
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
                productId: childCloud.id,
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
      });
      layout.changeLoaderValue(false);
    }
    layout.changeLoaderValue(false);
  } catch (e) {
    const layout = useLayoutStore();
    layout.changeLoaderValue(false);
    console.log(e);
  }
});

async function refresh() {

  const layout = useLayoutStore();
  layout.changeLoaderValue(true);
  showGenericListing(routes.COMPANY).then((response: any) => {
    customers.value = response?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id,
        addressLine1: customer.location?.addressLine1,
        zipCode: customer.location?.zip,
        city: customer.location?.city,
        country: customer.location?.country?.name,
        number: customer.number,
        state: customer.location?.state,
      };
    });
  });

  showGenericListing(routes.PRODUCT_PAYMENT_PERIOD).then((response: any) => {
    paymentPeriodOptions.value = response?.data?.paymentPeriods.map(
      (payment: any) => {
        return {
          text: payment.name,
          value: payment.id,
        };
      }
    );
  });

  showGenericListing(routes.TERMS_OF_PAYMENT).then((response: any) => {
    termsOfPaymentOptions.value = response?.data?.termOfPayments.map(
      (payment: any) => {
        return {
          text: payment.name,
          value: payment.id,
        };
      }
    );
  });
  layout.changeLoaderValue(false);
}

refresh();
</script>

<template>
  <div>
    <div class="card">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Configuration") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.category" :key="state.category" :options="categoryOptions" label="name"
                track-by="value" @select="resetValues" :textLabel="$t('Category')" :required="true"
                :class="{ 'is-invalid': v$.category.$error }" />

            </div>
            <div v-if="v$.category.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.category.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.invoiceType" :options="invoiceOptions" label="name" track-by="value"
                :key="state.invoiceType" :textLabel="$t('Invoice Type')" :required="true"
                :class="{ 'is-invalid': v$.invoiceType.$error }" :disabled="disableElement" />

            </div>
            <div v-if="v$.invoiceType.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.invoiceType.required">{{
                $t("This value is required")
              }}</span>
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
                <elements-input v-model="state.dueDate" :label="$t('Due Date')" :required="true" id="dueDate"
                  :class="{ 'is-invalid': v$.dueDate.$error }" type="date" />
              </div>
            </div>
            <div v-if="v$.dueDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.dueDate.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.customerId" :options="customers" label="text" :key="state.customerId"
                @select="getContactPersons" track-by="value" :required="true" :textLabel="$t('Customer')"
                :class="{ 'is-invalid': v$.customerId.$error }" />

            </div>
            <div v-if="v$.customerId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.customerId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <ElementsIcon v-bind:icon="'userIcon'" />
                  </span>
                </div>
                <elements-multiselect v-model="state.contactPersonId" :options="contactPersons"
                  :key="state.contactPersonId" label="text" track-by="value" :textLabel="$t('Contact Person')"
                  :class="{ 'is-invalid': v$?.contactPersonId && v$?.contactPersonId.$error }" />
              </div>
            </div>
            <div v-if="v$?.contactPersonId && v$?.contactPersonId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$?.contactPersonId && v$.contactPersonId.required">{{
                $t("This value is required")
              }}</span>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.systemId" :options="systemOptions" :key="state.systemId" label="text"
                track-by="value" :textLabel="$t('System')"
                :class="{ 'is-invalid': v$?.systemId && v$?.systemId.$error }" />

            </div>
            <div v-if="v$?.systemId && v$?.systemId.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$?.systemId && v$.systemId.required">{{
                $t("This value is required")
              }}</span>
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
                <elements-input v-model="state.startDate" :label="$t('Start Date')" :required="true" id="startDate"
                  :class="{ 'is-invalid': v$.startDate.$error }" type="date" />
              </div>
            </div>
            <div v-if="v$.startDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.startDate.required">{{
                $t("This value is required")
              }}</span>
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
                <elements-input v-model="state.endDate" :label="$t('End Date')" :required="true" id="endDate"
                  :disabled="isStatusDraft == false" :class="{ 'is-invalid': v$.endDate.$error }" type="date" />
              </div>
            </div>
            <div v-if="v$.endDate.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$.endDate.required">{{
                $t("This value is required")
              }}</span>
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
                <elements-input v-model="state.invoiceDate" :disabled="isStatusDraft == false" :label="$t('Invoice Date')"
                  id="invoiceDate" type="date" />
              </div>
            </div>
          </div>

          <div v-if="state.category == 'service'" class="col-lg-4">
            <div class="form-group">
              <label for="">Grouped By</label>
              <div>
                <input class="me-2" type="radio" id="groupBy" value="nothing" v-model="state.groupBy" />
                <label for="software">Nothing</label>
              </div>
              <div>
                <input class="me-2" type="radio" id="groupBy" value="category" v-model="state.groupBy" />
                <label for="software">Category</label>
              </div>
            </div>

          </div>
        </div>
        <div class="col-lg-4">
          <div v-if="props.recordId" class="form-group">
            <elements-multiselect v-model="state.status" :options="invoiceStatuses" :key="state.status" label="text"
              track-by="value" :textLabel="$t('Status')" :class="{ 'is-invalid': !isStatus }" />

          </div>
          <div v-if="!isStatus" class="invalid-feedback">
            <span class="text-danger" v-if="!isStatus">{{
              $t("This value is required")
            }}</span>
          </div>
          <div v-if="state.customerId" class="form-group">
            <elements-multiselect v-model="state.projectId" :options="projectOptions" :key="state.projectId" label="text"
              track-by="value" :textLabel="$t('Project')"
              :class="{ 'is-invalid': v$?.projectId && v$?.projectId.$error }" />

          </div>
          <div v-if="v$?.projectId && v$?.projectId.$error" class="invalid-feedback">
            <span class="text-danger" v-if="v$?.projectId && v$.projectId.required">{{
              $t("This value is required")
            }}</span>
          </div>
          <!-- {{ customerDetails?.name }}
          {{ customerDetails?.zipCode }}
          {{ customerDetails?.city }}
          {{ customerDetails?.country }} -->
        </div>
        <div class="col-lg-4">
          <div v-if="state.customerId && isPerformenceRecord" class="form-group">
            <elements-multiselect v-model="state.recreateAfter" :options="recreateOptions" :key="state.recreateAfter"
              label="name" track-by="value" :textLabel="$t('Recreate After')"
              :class="{ 'is-invalid': v$?.recreateAfter && v$?.recreateAfter.$error }" />
            
          </div>
          <div v-if="v$?.recreateAfter && v$?.recreateAfter.$error" class="invalid-feedback">
              <span class="text-danger" v-if="v$?.recreateAfter && v$.recreateAfter.required">{{
                $t("This value is required")
              }}</span>
            </div>
        </div>
        <div class="col-lg-4">
          <div v-if="state.customerId && isPerformenceRecord" class="form-group">
            <elements-input v-model="state.performanceNumber" :label="$t('Performance Number')"
              :disabled="disableElement" />
          </div>
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Company Details") }}</h3>
        <elements-tooltip />
      </div>
      <div class="card-body pt-3">
        <p>Uli Himmelein Sanitär – Heizung Solartechnik</p>
        <p>Regenwassernutzung</p>
        <p>Marktstraße 27</p>
        <p>71254 Ditzingen</p>
        <p>Baden-Württemberg</p>
        <p>Deutschland</p>
      </div>
    </div>
    <div class="card mt-3 invoice-draft">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Draft Invoice") }} <span>{{$t("(Software Licenses)")}}</span></h3>
        <ElementsTooltip />
      </div>
      <div class="card-body draft-offer mt-3">
        <div class="row">
          <div class="col-lg-4">
            <ul>
              <li>
                <h4>{{ $t("Customer Nr.") }}</h4>
                <p>{{ }}</p>
              </li>
              <li>
                <h4>{{ $t("Project Nr.") }}</h4>
                <p>{{  }}</p>
              </li>
              <li>
                <h4>{{ $t("Invoice No") }}</h4>
                <p>{{}}</p>
              </li>
            </ul>
          </div>
          <div class="col-lg-4">
            <ul>
              <li>
                <h4>{{ $t("Created By") }}</h4>
                <p>{{  }}</p>
              </li>
              <li>
                <h4>{{ $t("Due Date") }}</h4>
                <p> </p>
              </li>
              <li>
                <h4>{{ $t("System number") }}</h4>
                <p> </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-for="(prodType, index) in productType" :key="index"> -->
    <div v-if="state.category === `license`">
      <software-licence-table :softwareLicencesTableData="softwareLicencesTableData"
        :softwareLicencesSummery="softwareLicencesSummery" @addProduct="addProduct"
        @additiontalDescToggle="additiontalDescToggle" @calculateProductValue="calculateProductValue" />
    </div>

    <div v-if="state.category === `maintenance`">
      <software-maintanance-table :softwareMaintenanceTableData="softwareMaintenanceTableData"
        :softwareMaintenanceSummery="softwareMaintenanceSummery" @addProduct="addProduct"
        @additiontalDescToggle="additiontalDescToggle" @calculateProductValue="calculateProductValue" />
    </div>

    <div v-if="state.category === `service`">
      <service-table :servicesTableData="servicesTableData" :servicesTableDataByCategory="servicesTableDataByCategory"
        :groupBy="state.groupBy" :serviceSummery="serviceSummery" :serviceSummeryByCategory="serviceSummeryByCategory"
        @addProduct="addProduct" @additiontalDescToggle="additiontalDescToggle"
        @calculateProductValue="calculateProductValue" :key="performanceDefaultProduct?.length" />
    </div>
    <div v-if="state.category === `ams`">
      <ams-table :amsTableData="amsTableData" :amsSummery="amsSummery" @addProduct="addProduct"
        @additiontalDescToggle="additiontalDescToggle" @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
        @calculateProductValue="calculateProductValue" />
    </div>

    <div v-if="state.category === `hosting`">
      <hosting-table :hostingTableData="hostingTableData" :hostingSummery="hostingSummery" @addProduct="addProduct"
        @additiontalDescToggle="additiontalDescToggle" @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
        @calculateProductValue="calculateProductValue" />
    </div>

    <div v-if="state.category === `cloud`">
      <cloud-table :cloudTableData="cloudTableData" :cloudSummery="cloudSummery" @addProduct="addProduct"
        @additiontalDescToggle="additiontalDescToggle" @updatePeriodOfAllProducts="updatePeriodOfAllProducts"
        @calculateProductValue="calculateProductValue" />
    </div>
    <!-- </div> -->

    <add-software-licances-product v-if="isModalOpen && selectedComponentType === 'licences'" :showModal="isModalOpen"
      :hideModal="hideModal" @productAdded="productAdded" />
    <add-software-maintanance-product v-if="isModalOpen && selectedComponentType === 'maintainance'"
      :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <add-services-product v-if="isModalOpen &&
      (selectedComponentType === 'services' ||
        selectedComponentType === 'childServices')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <add-ams-product v-if="isModalOpen && selectedComponentType === 'ams'" :showModal="isModalOpen" :hideModal="hideModal"
      @productAdded="productAdded" />

    <add-hosting-product v-if="isModalOpen &&
      (selectedComponentType === 'hosting' ||
        selectedComponentType === 'childHosting')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />

    <add-cloud-product v-if="isModalOpen &&
      (selectedComponentType === 'cloud' ||
        selectedComponentType === 'childCloud')
      " :showModal="isModalOpen" :hideModal="hideModal" @productAdded="productAdded" />
    <div class="card mt-3">
      <div class="card-header d-flex">
        <h3 class="card-title me-2">{{ $t("Fill Invoice Details") }}</h3>
        <elements-tooltip/>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <elements-multiselect v-model="state.paymentPeriod" :options="paymentPeriodOptions" label="text"
                :key="state.paymentPeriod" track-by="value" :textLabel="$t('Payment Period')" :required="true"
                :class="{ 'is-invalid': v$.paymentPeriod.$error }" />
              
            </div>
            <div v-if="v$.paymentPeriod.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.paymentPeriod.required">{{
                  $t("This value is required")
                }}</span>
              </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <elements-multiselect v-model="state.termOfPaymentId" :options="termsOfPaymentOptions" label="text"
                :key="state.termOfPaymentId" track-by="value" :textLabel="$t('Term Of Payment')" :required="true"
                :class="{ 'is-invalid': v$.termOfPaymentId.$error }" />
              
            </div>
            <div v-if="v$.termOfPaymentId.$error" class="invalid-feedback">
                <span class="text-danger" v-if="v$.termOfPaymentId.required">{{
                  $t("This value is required")
                }}</span>
              </div>
          </div>
          <div v-if="termPaymentNo" class="col-lg-2">
            <div class="form-group">
              <elements-input v-model="termPaymentNo" id="paymentNo" readonly />
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="form-group textarea">
              <textarea v-model="state.customNotesField" cols="30" rows="10" class="form-control"
                placeholder="."></textarea>
              <label for="" class="input-label">Custom Notes Field</label>
            </div>
          </div>

          <div class="col-lg-6 col-md-6">
            <div class="form-group textarea">
              <textarea v-model="state.paymentTerm" cols="30" rows="10" class="form-control" placeholder="."></textarea>
              <label for="" class="input-label">Payment Terms</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button v-if="props.recordId" @click="generate('pdf')" :icon-name="'saveIcon'" :isLoading="isLoading"
        :buttonName="$t('Generate PDF')" />
    </div>
    <div v-if="props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <submittal-button @click="generate('docx')" :isLoading="isLoading" :icon-name="'saveIcon'" :buttonName="$t('Generate Docx')" />
    </div>
    <div v-if="!props.recordId" class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/finance/invoices')">
        <ElementsIcon v-bind:icon="'cancelIcon'" class="me-2"/>
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button @click="store" :isLoading="isLoading" :icon-name="'saveIcon'" :buttonName="$t('Save and Proceed')" />
    </div>

    <div v-else class="mt-4 d-flex align-items-center justify-content-end">
      <button class="primary-btn me-3" @click="navigateTo('/finance/invoices')">
        <ElementsIcon v-bind:icon="'cancelIcon'" class="me-2"/>
        <span>{{ $t("Cancel") }}</span>
      </button>
      <submittal-button @click="update" :isLoading="isLoading" :icon-name="'updateIcon'" :buttonName="$t('Update')" />
    </div>
  </div>
</template>
<style lang="scss">
.invoice-draft{
  h3{
    span{
      color:#F59630;
    }
  }
}
</style>
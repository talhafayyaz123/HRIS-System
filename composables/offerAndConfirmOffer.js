import { ref, reactive } from "vue";
import commonCode from "~/composables/common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { routes } from "~/utils/apiRoutes";
import {
  addSaleOfferRequest,
  editSaleOfferRequest,
  invoicePdfGenerationRequest,
  docSelectedListRequest,
} from "~/utils/apiRequests";

const { router, Toast } = commonCode();


export default function offerAndConfirmOffer() {
  const state = reactive({
    logedinUserId: localStorage.getItem("user_id"), // NOT FOR API
    offerId: null, //select offer
    receiverType: "",
    customerId: "", // receiver
    contactPersonId: null,
    termOfPaymentId: null,
    projectId: null,
    offerType: "budget_offer",
    template: "",
    groupBy: "nothing",
    expiryDate: "",
    orderStatus: "draft", //
    offerStatus: "",
    offerConfirmationStatus: "draft",
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
  });
  const validationRules = {
    receiverType: { required },
    customerId: { required },
    termOfPaymentId: { required },
    offerType: { required },
    expiryDate: { required },
    offerStatus: { required },
  };
  const v$ = useVuelidate(validationRules, state);
  const isLoading = ref(false);
  const productType = ref([]); // this contains the list of selected component type from checkBoxes
  const optionalProductType = ref([]); // this contains the array of optional selected component type from checkBoxes
  const isModalOpen = ref(false);
  const selectedComponentType = ref("");
  const parentComponentIndex = ref(null); // used when adding childComponents to any parent object

  const companyDetail = reactive({
    companyName: "",
    companyNumber: "",
    contactPerson: "",
    address: "",
    code: "",
    city: "",
    state: "",
    country: "",
  });

  const softwareLicencesTableData = ref([]);
  const optionalSoftwareLicencesTableData = ref([]);

  const softwareMaintenanceTableData = ref([]);
  const optionalSoftwareMaintenanceTableData = ref([]);

  const servicesTableData = ref([]);
  const optionalServicesTableData = ref([]);

  const servicesTableDataByCategory = ref([]);
  const optionalServicesTableDataByCategory = ref([]);

  const amsTableData = ref([]);
  const optionalAmsTableData = ref([]);

  const hostingTableData = ref([]);
  const optionalHostingTableData = ref([]);

  const cloudTableData = ref([]);
  const optionalCloudTableData = ref([]);

  function hideModal() {
    isModalOpen.value = false;
  }
  function showModal() {
    isModalOpen.value = true;
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
      amsTableData.value[index].slaToggle =
        !amsTableData.value[index].slaToggle;
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
    index,
    componentType,
    changedValue,
    childIndex
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
    } else if (
      componentType === "childService" &&
      changedValue === "quantity"
    ) {
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
      calculateTotalNetto(
        optionalServicesTableDataByCategory,
        index,
        "service"
      );
    } else if (componentType === "hosting" && changedValue === "quantity") {
      hostingTableData.value[index].quantity = event.target.value;
      calculateTotalNetto(hostingTableData, index, "hosting");
    } else if (
      componentType === "hostingOptional" &&
      changedValue === "quantity"
    ) {
      optionalHostingTableData.value[index].quantity = event.target.value;
      calculateTotalNetto(optionalHostingTableData, index, "hosting");
    } else if (
      componentType === "childHosting" &&
      changedValue === "quantity"
    ) {
      hostingTableData.value[index].childComponents[childIndex].quantity =
        event.target.value;
      hostingTableData.value[index].childComponents[childIndex].totalRate =
        hostingTableData.value[index].childComponents[childIndex].quantity *
        hostingTableData.value[index].childComponents[childIndex]
          .pricePerPeriod;
      calculateTotalNetto(
        hostingTableData,
        index,
        "childHosting",
        hostingTableData.value[index].childComponents
      );
    } else if (componentType === "cloud" && changedValue === "quantity") {
      cloudTableData.value[index].quantity = event.target.value;
      calculateTotalNetto(cloudTableData, index, "cloud");
    } else if (
      componentType === "cloudOptional" &&
      changedValue === "quantity"
    ) {
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
      calculateTotalNetto(
        optionalServicesTableDataByCategory,
        index,
        "service"
      );
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
    } else if (
      componentType === "cloudOptional" &&
      changedValue === "discount"
    ) {
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
    } else if (
      componentType === "amsOptional" &&
      changedValue === "hourlyRate"
    ) {
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
      calculateTotalNetto(
        optionalServicesTableDataByCategory,
        index,
        "service"
      );
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
        hostingTableData.value[index].childComponents[childIndex]
          .pricePerPeriod;
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
    } else if (
      componentType === "cloudOptional" &&
      changedValue === "duration"
    ) {
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
    } else if (
      componentType === "serviceByCategory" &&
      changedValue === "tax"
    ) {
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
      calculateTotalNetto(
        optionalServicesTableDataByCategory,
        index,
        "service"
      );
    }
  };

  const calculateSummery = (tableData, tableSummery) => {
    if (!tableData) {
      return;
    }
    let netto = 0;
    let tax = [];
    let percentageTotal = 0;
    tableData?.map((data) => {
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
        servicesTableData.value[
          parentComponentIndex.value
        ].childComponents?.push(prod);
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
        hostingTableData.value[
          parentComponentIndex.value
        ].childComponents?.push(prod);
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

  async function saveOffersHandler(recordId, update) {
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
        const res =
          recordId && update // if copyOffer then create record not update record
            ? await editSaleOfferRequest(formData, recordId)
            : await addSaleOfferRequest(formData);

        Toast.fire({
          title: recordId && update ? "Updated" : "Created",
          icon: "success",
        });
        navigateTo("/offers");
        isLoading.value = false;
      } catch (e) {
        console.log(e);
        Toast.fire({ title: "Error!", text: "Error", icon: "error" });
        isLoading.value = false;
      }
    }
  }

  async function fetchAndPopulateOnUpdate(res, recordId) {
    const {
      parentOffer,
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
      offerConfirmationStatus, // for offer confirmation update
      paymentTerm,
      coverLetterText,
      descriptionText,
      productComponents,
      optionalProductComponents,
    } = res.data;
    if (recordId) {
      state.offerId = parentOffer.id; // this has the id which we add while creating confirm offer
    }
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
    state.offerConfirmationStatus = offerConfirmationStatus;
    state.paymentTerm = paymentTerm;
    state.coverLetterText = coverLetterText;
    state.descriptionText = descriptionText;

    softwareLicencesTableData.value =
      productComponents.license && productComponents.license.length > 0
        ? productComponents.license.map((licance) => {
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
        ? productComponents.maintenance.map((maintenance) => {
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
        ? productComponents.service.map((service) => {
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
                service.childComponents.length > 0 ?
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
                }) : [],
            };
          })
        : [];

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
    amsTableData.value =
      productComponents.application && productComponents.application.length > 0
        ? productComponents.application.map((application) => {
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
        ? productComponents.hosting.map((hosting) => {
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
                hosting.childComponents.length > 0 ?
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
                }) : [],
            };
          })
        : [];

    cloudTableData.value =
      productComponents.cloud && productComponents.cloud.length > 0
        ? productComponents.cloud.map((cloud) => {
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
                cloud.childComponents.length > 0 ?
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
                }) : [],
            };
          })
        : [];

    optionalSoftwareLicencesTableData.value =
      optionalProductComponents.license &&
      optionalProductComponents.license.length > 0
        ? optionalProductComponents.license.map((licance) => {
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
        ? optionalProductComponents.maintenance.map((maintenance) => {
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
        ? optionalProductComponents.service.map((service) => {
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
    optionalAmsTableData.value =
      optionalProductComponents.application &&
      optionalProductComponents.application.length > 0
        ? optionalProductComponents.application.map((application) => {
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
        ? optionalProductComponents.hosting.map((hosting) => {
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
        ? optionalProductComponents.cloud.map((cloud) => {
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
    productType.value = prodComponents;
    optionalProductType.value = optionalProdComponents;
  }

  function addProduct({ componentType, parentIndex }) {
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
        return +current.discount > accumulator
          ? +current.discount
          : accumulator;
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

  // update paymentPeriodId globally
  function updatePeriodOfAllProducts(changeState, type) {
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

  // generate pdf and docs
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
          type: "application",
          productId: product?.productId ?? "",
          salePrice: product.salePrice,
          discount: product.discount,
          quantity: product.serviceHours,
          tax: product.tax,
          hourlyRate: product.hourlyRate,
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
          type: "cloud",
          productId: product?.productId ?? "",
          discount: product.discount,
          quantity: product.quantity,
          tax: product.tax,
          salePrice: product.salePrice,
          paymentPeriod: product.paymentPeriodId,
          duration: product.duration,
          productFullDetails: { ...product },
        };
      }),
      ...optionalHostingTableData.value.map((product) => {
        return {
          id: product.componentId,
          type: "hosting",
          productId: product?.productId ?? "",
          discount: product.discount,
          quantity: product.quantity,
          tax: product.tax,
          pricePerPeriod: product.pricePerPeriod,
          paymentPeriod: product.paymentPeriodId,
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
  };

  async function generateProcessTemplate(payload, documentType) {
    isLoading.value = true;

    const res = await docSelectedListRequest({ start: 0, count: 25 });
    const offerTemplate = res?.data.find((el) => el.key === "offerTemplateId");
    const offerTemplateId = offerTemplate.value;

    //Create template payload and process template
    try {
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
        isLoading.value = false;
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
      }
    } catch (e) {
      isLoading.value = false;
      Toast.fire({ title: "Error!", text: "Error", icon: "error" });

      console.log(e);
    }
  }

  return {
    state,
    isModalOpen,
    isLoading,
    productType,
    optionalProductType,
    selectedComponentType,
    parentComponentIndex,
    companyDetail,
    softwareLicencesTableData,
    optionalSoftwareLicencesTableData,
    softwareMaintenanceTableData,
    optionalSoftwareMaintenanceTableData,
    servicesTableData,
    optionalServicesTableData,
    servicesTableDataByCategory,
    optionalServicesTableDataByCategory,
    amsTableData,
    optionalAmsTableData,
    hostingTableData,
    optionalHostingTableData,
    cloudTableData,
    optionalCloudTableData,
    v$, // used for validation

    additiontalDescToggle,
    addSlaToggle,
    calculateTotalNetto,
    calculateProductValue,
    calculateSummery,
    productAdded,
    addProduct,
    hideModal,
    showModal,
    saveOffersHandler, // to create offer
    fetchAndPopulateOnUpdate,
    createCategories,
    updatePeriodOfAllProducts,
    generate,
    generateProcessTemplate,
  };
}

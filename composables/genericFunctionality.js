import { ref } from "vue";
import {
  genericDeleteRequest,
  genericListingRequest,
  specificGetRequest,
  genericStoreRequest,
  genericShowRequest,
  genericUpdateRequest,
  mailServiceRequest,
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
import { useLayoutStore } from "~/store/layout";
const runtimeConfig = useRuntimeConfig();

export default function genericFunctionality() {
  const currentPerPage = ref(10),
    startPerPage = ref(0),
    currentPage = ref(1),
    data = ref({}),
    apiRoute = ref(""),
    isLoading = ref(false),
    submitted = ref(false),
    orderColumn = ref("id"),
    orderDirection = ref("desc"),
    projectId = ref(""),
    userId = ref(""),
    date = ref(""),
    companyId = ref(""),
    customerId = ref(""),
    offerType = ref(""),
    priceListId = ref(""), // these are filters for products list
    type = ref(""),
    status = ref(""),
    categoryId = ref(""),
    softwareId = ref(""),
    search = ref(""),
    { deleteAlert, Toast, router } = commonCode(),
    listingFunc = async (params) => {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      currentPage.value = params?.page;
      currentPerPage.value = params?.perPage;
      
      userId.value = params?.userId ?  params?.userId : userId.value ; 
      date.value = params?.date ? params?.date : date.value ; 
      companyId.value = params?.companyId ? params?.companyId :  companyId.value;
      customerId.value = params?.customerId ? params?.customerId :  customerId.value;
      offerType.value = params?.offerType ? params?.offerType :  offerType.value;
      projectId.value = params?.project_id? params?.project_id :  projectId.value;
      priceListId.value = params?.priceListId?  params?.priceListId :  priceListId.value;
      type.value =params?.type ?  params?.type :  type.value;
      status.value =params?.status ?  params?.status :  status.value;
      categoryId.value = params?.categoryId ?   params?.categoryId :  categoryId.value;
      softwareId.value = params?.softwareId ?   params?.softwareId :  softwareId.value;
      search.value =  params?.search ? params?.search :  search.value;
      await genericListingRequest(apiRoute.value, {
        page: currentPage.value,
        perPage: currentPerPage.value,
        sortBy: orderColumn.value,
        order: orderDirection.value,
        search:search.value,
        companyId: companyId.value,
        customerId: customerId.value,
        offerType: offerType.value,
        projectId: projectId.value,
        userId: userId.value,
        date: date.value ,
        priceListId: priceListId.value, // this and below for product listing filter
        type: type.value,
        status:  status.value,
        categoryId: categoryId.value,
        softwareId: softwareId.value,
      })
        .then((response) => {
          data.value = response.data;
          layout.changeLoaderValue(false);
        })
        .catch((error) => {
          layout.changeLoaderValue(false);
        });
      return true;
    },
    onSortChange = (column, order) => {
      
      orderColumn.value = column;
      orderDirection.value = order;
      listingFunc({
        page: currentPage.value,
        perPage: currentPerPage.value,
        sortBy: orderColumn.value,
        order: orderDirection.value,
        search:search.value,
        companyId: companyId.value,
        customerId: customerId.value,
        offerType: offerType.value,
        projectId: projectId.value,
        userId: userId.value,
        date: date.value ,
        priceListId: priceListId.value, // this and below for product listing filter
        type: type.value,
        status:  status.value,
        categoryId: categoryId.value,
        softwareId: softwareId.value,
      });
    },
    handleSearch = (searchList) => {
      data.value = {};
      search.value = searchList
      listingFunc({
        page: currentPage.value,
        perPage: currentPerPage.value,
        sortBy: orderColumn.value,
        sortOrder: orderDirection.value,
        search: search.value,
        companyId: companyId.value,
        customerId: customerId.value,
        offerType: offerType.value,
        projectId: projectId.value,
        userId: userId.value,
        date: date.value ,
        priceListId: priceListId.value, // this and below for product listing filter
        type: type.value,
        status:  status.value,
        categoryId: categoryId.value,
        softwareId: softwareId.value,
      });
    },
    destroy = async (id, params = {}) => {
      if (id) {
        await deleteAlert().then((result) => {
          if (result.isConfirmed) {
            genericDeleteRequest(apiRoute.value, id)
              .then(async (response) => {
                if (router.params.id) {
                  projectId.value = router.params.id;
                }

                if (params.date) {
                  userId.value = params?.userId;
                  date.value = params?.date;
                }
                Toast.fire({
                  icon: "success",
                  title: "Record deleted successfully!",
                });

                /*
                     this condition only, when selected page record will be deleted and  no record remaining but
                     the actual record remaining for others pages
                    */

                if (currentPage.value > 1) {
                  let recordCheck = data.value?.count - data.value?.perPage;
                  if (recordCheck <= 1)
                    currentPage.value = currentPage.value - 1;
                }

                await listingFunc({
                  page: currentPage.value,
                  perPage: currentPerPage.value,
                  sortBy: orderColumn.value,
                  sortOrder: orderDirection.value,
                  search: "",
                  project_id: projectId.value,
                  userId: userId.value,
                  date: date.value,
                  priceListId: params?.priceListId, // below for product listing filter for delete case
                  type: params.type,
                  status: params?.status,
                  categoryId: params?.categoryId,
                  softwareId: params?.softwareId,
                });
              })
              .catch((error) => {
                if (error && error.response && error.response.data) {
                  Toast.fire({
                    icon: "error",
                    title: error.response.data.message,
                  });
                }
              });
          }
        });
      }
    },
    storeFunc = async (inputData, redirect) => {
    
      try {
        const layout = useLayoutStore();
        layout.changeLoaderValue(true);
        isLoading.value = true;
        genericStoreRequest(apiRoute.value, inputData)
          .then((response) => {
           
            layout.changeLoaderValue(false);
            Toast.fire({
              icon: "success",
              title: "Record created successfully!",
            });
           
            data.value=response;
            if (!!redirect) navigateTo(redirect);
          
          })
          .catch((error) => {
            let errorMessage;
            if (
              !!error?.response?.data?.message
            ) {
              errorMessage = error?.response?.data?.message;
            } else {
              errorMessage = "Something went wrong";
            }
            Toast.fire({ icon: "error", title: errorMessage });
          })
          .finally(() => {
            layout.changeLoaderValue(false);
            isLoading.value = false;
            submitted.value = false;
          });
      } catch (e) {
        console.log("error2");
        console.log(e);
        Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
        isLoading.value = false;
        submitted.value = false;
      }
    },
    updateFunc = async (data, id, redirect) => {
      try {
        const layout = useLayoutStore();
        layout.changeLoaderValue(true);
        isLoading.value = true;
        genericUpdateRequest(apiRoute.value, id, data)
          .then((response) => {
            layout.changeLoaderValue(false);
            Toast.fire({
              icon: "success",
              title: "Record updated successfully!",
            });
            if (!!redirect) navigateTo(redirect);
          })
          .catch((error) => {
            let errorMessage;
            if (
              error?.response?.data?.message ===
              "Time tracker data overlapping for government"
            ) {
              errorMessage = error?.response?.data?.message;
            } else {
              errorMessage = "Something went wrong";
            }
            Toast.fire({ icon: "error", title: errorMessage });
          })
          .finally(() => {
            layout.changeLoaderValue(false);
            isLoading.value = false;
            submitted.value = false;
          });
      } catch (e) {
        Toast.fire({ title: t("Error!"), text: t("Error"), icon: "error" });
        isLoading.value = false;
        submitted.value = false;
      }
    },
    showFunc = async (id) => {
      return await genericShowRequest(apiRoute.value, id);
    },
    specificListingRequest = (params) => {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      specificGetRequest(apiRoute.value, {
        limit_start: params?.limit_start,
        limit_count: params?.limit_count,
        type: params?.type,
      }).then((response) => {
        data.value = response;
      }).finally(() => {
        layout.changeLoaderValue(false);
      });
    },
    mailService = (params) => {
      const layout = useLayoutStore();
      layout.changeLoaderValue(true);
      mailServiceRequest(apiRoute.value, {
        limit_start: params?.limit_start,
        limit_count: params?.limit_count,
        type: params?.type,
      })
        .then((response) => {
          layout.changeLoaderValue(false);
          data.value = response;
        })
        .finally(() => {
          layout.changeLoaderValue(false);
        });
    };

  return {
    currentPerPage,
    startPerPage,
    currentPage,
    orderColumn,
    orderDirection,
    data,
    apiRoute,
    isLoading,
    submitted,
    priceListId,
    type,
    status,
    categoryId,
    softwareId,
    onSortChange,
    listingFunc,
    handleSearch,
    specificListingRequest,
    destroy,
    storeFunc,
    showFunc,
    updateFunc,
    mailService,
  };
}

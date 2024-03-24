import {routes} from "./apiRoutes";
import axios from "axios";
import {
    getApiResponse,
    mailServiceResponse,
    MethodType,
    specificApiResponse,
    nuxtResponsegenericDeleteRequest
} from "./axiosFunctions";
import {
    getApiResponse,
    mailServiceResponse,
    MethodType,
    specificApiResponse,
    nuxtResponsegenericDeleteRequest
} from "./axiosFunctions";

const runtimeConfig = useRuntimeConfig();

//Product Software List
export const ProductSoftwareRequest = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    let url;
    if (!!params)
        url = `${routes.PRODUCT_SOFTWARE}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    else url = `${routes.PRODUCT_SOFTWARE}`;

    return await getApiResponse(url, true, MethodType.get);
};

//Product Unit List
export const productUnitRequest = async (params: {
    page: number;
    perPage: number;
    sortBy: string;
    order: string;
    search: string;
    all?: boolean
}) => {
    const url = `${routes.PRODUCT_UNIT}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};

//Product Unit Create
export const productUnitCreateRequest = async (data: any) => {
    const url = `${routes.PRODUCT_UNIT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Product Unit Show
export const productUnitShowRequest = async (id: any) => {
    const url = `${routes.PRODUCT_UNIT}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Product Unit Update
export const productUnitUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.PRODUCT_UNIT}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Product Unit Delete
export const productUnitDeleteRequest = async (id: any) => {
    const url = `${routes.PRODUCT_UNIT}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Product Version List By Software
export const ProductVersionBySoftwareRequest = async (params?: {
    softwareId?: number;
}) => {
    const url = `${routes.PRODUCT_VERSION}?softwareId=${params?.softwareId}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Product Category Create
export const productCategoryCreateRequest = async (data: any) => {
    const url = `${routes.PRODUCT_CATEGORY}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Product Category Show
export const productCategoryShowRequest = async (id: any) => {
    const url = `${routes.PRODUCT_CATEGORY}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Product Category Update
export const productCategoryUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.PRODUCT_CATEGORY}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Product Category Delete
export const productCategoryDeleteRequest = async (id: any) => {
    const url = `${routes.PRODUCT_CATEGORY}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

// CRUD OPERATION OF OPERATING SYSTEM
// Operating System List
export const operatingSystemRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.OPERATING_SYSTEM}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};

//Operating System Create
export const operatingSystemCreateRequest = async (data: any) => {
    const url = `${routes.OPERATING_SYSTEM}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Operating System Show
export const operatingSystemShowRequest = async (id: any) => {
    const url = `${routes.OPERATING_SYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Operating System Update
export const operatingSystemUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.OPERATING_SYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};


//Database Cloud List
export const databaseCloudRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.DATABASE_CLOUD}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Database Cloud Create
export const databaseCloudCreateRequest = async (data: any) => {
    const url = `${routes.DATABASE_CLOUD}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Database Cloud Show
export const databaseCloudShowRequest = async (id: any) => {
    const url = `${routes.DATABASE_CLOUD}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Database Cloud Update
export const databaseCloudUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.DATABASE_CLOUD}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Database Cloud Delete
export const databaseCloudDeleteRequest = async (id: any) => {
    const url = `${routes.DATABASE_CLOUD}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Distributed Filesystem List
export const distributedFilesystemRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.DISTRIBUTED_FILESYSTEM}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Distributed Filesystem Create
export const distributedFilesystemCreateRequest = async (data: any) => {
    const url = `${routes.DISTRIBUTED_FILESYSTEM}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Distributed Filesystem Show
export const distributedFilesystemShowRequest = async (id: any) => {
    const url = `${routes.DISTRIBUTED_FILESYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Distributed Filesystem Update
export const distributedFilesystemUpdateRequest = async (
    data: any,
    id: any
) => {
    const url = `${routes.DISTRIBUTED_FILESYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Distributed Filesystem Delete
export const distributedFilesystemDeleteRequest = async (id: any) => {
    const url = `${routes.DISTRIBUTED_FILESYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Cloud System List
export const cloudSystemRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.CLOUD_SYSTEM}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Cloud System Create
export const cloudSystemCreateRequest = async (data: any) => {
    const url = `${routes.CLOUD_SYSTEM}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Cloud System Show
export const cloudSystemShowRequest = async (id: any) => {
    const url = `${routes.CLOUD_SYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Cloud System Update
export const cloudSystemUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.CLOUD_SYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Cloud System Delete
export const cloudSystemDeleteRequest = async (id: any) => {
    const url = `${routes.CLOUD_SYSTEM}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Customer License List
export const customerLicenseRequest = async (params: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
    companyId: string
}) => {
    const url = `${routes.CUSTOMER_LICENSE}?page=${params?.page}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}&companyId=${params?.companyId}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Customer License Statistics List
export const customerLicenseStatisticsRequest = async (params: {
    companyId: string
}) => {
    const url = `${routes.CUSTOMER_LICENSE_STATISTICS}?companyId=${params?.companyId}`;
    return await getApiResponse(url, true, MethodType.get);
};


//Customer License Create
export const customerLicenseCreateRequest = async (data: any) => {
    const url = `${routes.CUSTOMER_LICENSE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Customer License Get By Id
export const customerLicenseByIdRequest = async (id: any) => {
    const url = `${routes.CUSTOMER_LICENSE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Customer License Update
export const customerLicenseUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.CUSTOMER_LICENSE}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Customer License Delete
export const customerLicenseDeleteRequest = async (id: any) => {
    const url = `${routes.CUSTOMER_LICENSE}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Product List
export const productByCategoryRequest = async (params: {
    sortBy: string;
    sortOrder: string;
    page: number;
    perPage: number;
    type: string;
    search: string;
}) => {
    const url = `${routes.PRODUCT}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&type=${params?.type}&sortBy=${params?.sortBy}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Supplier List
export const supplierRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.SUPPLIER}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Supplier Create
export const supplierCreateRequest = async (data: any) => {
    const url = `${routes.SUPPLIER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Supplier Show
export const supplierShowRequest = async (id: any) => {
    const url = `${routes.SUPPLIER}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Supplier Update
export const supplierUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.SUPPLIER}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Contact Report List
export const contactReportRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
    customerId: string;
    perPage: number;
}) => {
    const url = `${routes.CONTACT_REPORT}?page=${queryParams?.page}&perPage=${queryParams?.perPage}&search=${queryParams?.search}&sortBy=${queryParams?.sortBy}&order=${queryParams?.sortOrder}&customerId=${queryParams?.customerId}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Contact Report Create
export const contactReportCreateRequest = async (data: any) => {
    const url = `${routes.CONTACT_REPORT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Contact Report File Create
export const contactReportFileCreateRequest = async (data: any) => {
    const url = `${routes.CONTACT_REPORT_FILE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Contact Report Show
export const contactReportShowRequest = async (id: any) => {
    const url = `${routes.CONTACT_REPORT}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Contact Report Update
export const contactReportUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.CONTACT_REPORT}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Contact Report Delete
export const contactReportDeleteRequest = async (id: any) => {
    const url = `${routes.CONTACT_REPORT}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Customer List
export const customerRequest = async (queryParams?: {
    sortBy: string;
    sortOrder: string;
    page: number,
    search: string;
}) => {
    const url = `${routes.COMPANY}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};


//Customer Create
export const customerCreateRequest = async (data: any) => {
    const url = `${routes.COMPANY}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Customer Show
export const customerShowRequest = async (id: any) => {
    const url = `${routes.COMPANY}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Customer Update
export const customerUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.COMPANY}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Product Software List
export const FleetListRequest = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    let url;
    if (!!params)
        url = `${routes.FLEET_LIST}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    else url = `${routes.FLEET_LIST}`;

    return await getApiResponse(url, true, MethodType.get);
};

//Fleet List Create
export const fleetListCreateRequest = async (data: any) => {
    const url = `${routes.FLEET_LIST}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Fleet List Show
export const fleetListShowRequest = async (id: any) => {
    const url = `${routes.FLEET_LIST}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Fleet List Update
export const fleetListUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.FLEET_LIST}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Fleet List Delete
export const fleetListDeleteRequest = async (id: any) => {
    const url = `${routes.FLEET_LIST}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Fleet Document Create
export const fleetDocumentCreateRequest = async (data: any) => {
    const url = `${routes.FLEET_LIST_DOCUMENT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Team Create
export const TeamCreateRequest = async (data: any) => {
    const url = `${routes.TEAM}`;
    return await getApiResponse(url, true, MethodType.post, data);
};


export const departmentShowRequest = async (id: any) => {
    const url = `${routes.DEPARTMENT}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};


export const teamShowRequest = async (id: any) => {
    const url = `${routes.TEAM}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

export const availableTeamsShowRequest = async () => {
    const url = `${routes.AVAILABLE_TEAM}`;
    return await getApiResponse(url, true, MethodType.get);
};


export const DepartmentCreateRequest = async (data: any) => {
    const url = `${routes.DEPARTMENT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const departmentUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.DEPARTMENT}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};


//Team Update
export const teamUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.TEAM}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Lead List
export const leadRequest = async (queryParams?: {
    sortBy: string;
    sortOrder: string;
    page: number,
    search: string;
}) => {
    const url = `${routes.LEAD}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Lead Create
export const leadCreateRequest = async (data: any) => {
    const url = `${routes.LEAD}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Lead Show
export const leadShowRequest = async (id: any) => {
    const url = `${routes.LEAD}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Lead Update
export const leadUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.LEAD}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Lead Delete
export const leadDeleteRequest = async (id: any) => {
    const url = `${routes.LEAD}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Supplier Location Create
export const supplierLocationCreateRequest = async (data: any) => {
    const url = `${routes.SUPPLIER_LOCATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Supplier Location Show
export const supplierLocationShowRequest = async (id: any) => {
    const url = `${routes.SUPPLIER_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};


//Supplier Location Delete
export const supplierLocationDeleteRequest = async (id: any) => {
    const url = `${routes.SUPPLIER_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Customer Location Create
export const customerLocationCreateRequest = async (data: any) => {
    const url = `${routes.CUSTOMER_LOCATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Customer Location Update
export const customerLocationUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.CUSTOMER_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Customer Location Delete
export const customerLocationDeleteRequest = async (id: any) => {
    const url = `${routes.CUSTOMER_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Lead Location Create
export const leadLocationCreateRequest = async (data: any) => {
    const url = `${routes.LEAD_LOCATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Lead Location Update
export const leadLocationUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.LEAD_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Lead Location Delete
export const leadLocationDeleteRequest = async (id: any) => {
    const url = `${routes.LEAD_LOCATION}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//System Host List
export const systemHostRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.SYSTEM_HOST}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//System Host Create
export const systemHostCreateRequest = async (data: any) => {
    const url = `${routes.SYSTEM_HOST}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//System Host Show
export const systemHostShowRequest = async (id: any) => {
    const url = `${routes.SYSTEM_HOST}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//System Host Update
export const systemHostUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.SYSTEM_HOST}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//System Host Delete
export const systemHostDeleteRequest = async (id: any) => {
    const url = `${routes.SYSTEM_HOST}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Form Of Contract List
export const formOfContractRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.FORM_OF_CONTRACT}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Form Of Contract Create
export const formOfContractCreateRequest = async (data: any) => {
    const url = `${routes.FORM_OF_CONTRACT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Form Of Contract Show
export const formOfContractShowRequest = async (id: any) => {
    const url = `${routes.FORM_OF_CONTRACT}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Form Of Contract Update
export const formOfContractUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.FORM_OF_CONTRACT}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Form Of Contract Delete
export const formOfContractDeleteRequest = async (id: any) => {
    const url = `${routes.FORM_OF_CONTRACT}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Expiry Month List
export const expiryMonthRequest = async () => {
    const url = `${routes.EXPIRY_MONTH}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Expiry Mont Create
export const expiryMonthCreateRequest = async (data: any) => {
    const url = `${routes.EXPIRY_MONTH}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Job Level List
export const jobLevelRequest = async (queryParams: {
    sortBy: string;
    sortOrder: string;
    page: number;
    search: string;
}) => {
    const url = `${routes.JOB_LEVEL}`;
    const params = queryParams;
    return await getApiResponse(url, true, MethodType.get, params);
};

//Job Level Create
export const jobLevelCreateRequest = async (data: any) => {
    const url = `${routes.JOB_LEVEL}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Job Level Show
export const jobLevelShowRequest = async (id: any) => {
    const url = `${routes.JOB_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Job Level Update
export const jobLevelUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.JOB_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Job Level Delete
export const jobLevelDeleteRequest = async (id: any) => {
    const url = `${routes.JOB_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Customer Portal News Create
export const customerPortalNewsCreateRequest = async (data: any) => {
    const url = `${routes.CUSTOMER_PORTAL_NEWS}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Customer Portal News Show
export const customerPortalNewsShowRequest = async (id: any) => {
    const url = `${routes.CUSTOMER_PORTAL_NEWS}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Customer Portal News Update
export const customerPortalNewsUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.CUSTOMER_PORTAL_NEWS}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

export const intervalSettingRequest = async () => {
    const url = `${routes.INTERVAL_SETTING}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Interval Settings Create
export const intervalSettingCreateRequest = async (data: any) => {
    const url = `${routes.INTERVAL_SETTING}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Interval Settings Show
export const intervalSettingShowRequest = async (id: any) => {
    const url = `${routes.INTERVAL_SETTING}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Interval Settings Update
export const intervalSettingUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.INTERVAL_SETTING}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// Document Assignment, selected document request
export const docSelectedListRequest = async () => {
    const url = `${routes.DOC_ASSIGNMENT_SELECTED_LIST}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// Document Assignment, list of documents shown in dropdown
export const docListRequest = async (params: {
    start: number;
    count: number;
}) => {
    const url = `${runtimeConfig.public.documentServiceUrl}${routes.DOC_ASSIGNMENT_LIST}?limit_start=${params.start}&imit_count=${params.count}`;
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    return result?.data;
};

// Create Document List Item
export const createorUpdateDocListRequest = async (data: any) => {
    const url = `${runtimeConfig.public.documentServiceUrl}${routes.DOC_LIST_UPLOAD_FILE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Create Document List Item
export const getDocListFilePreviewRequest = async (fileId: any) => {
    const url = `${runtimeConfig.public.documentServiceUrl}${routes.DOC_LIST_FILE_PREVIEW}/${fileId}`;
    return await getApiResponse(url, true, MethodType.get, null, null, undefined, 'blob');
};

// Document Assignment, Save document.
export const saveDocRequest = async (data: any) => {
    const url = `${routes.DOC_ASSIGNMENT_SELECTED_LIST}`;
    const dataObj = {data: data};
    const result = await getApiResponse(url, true, MethodType.post, dataObj);
    return result;
};
// Get Elo Configuration
export const eloConfigRequest = async () => {
    const url = `${routes.ELO_CONFIGURATION}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// Save Elo Configuration
export const saveEloConfigRequest = async (data: any) => {
    const url = `${routes.ELO_CONFIGURATION}`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// Terms of payment list
export const termsOfPaymentRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.TERMS_OF_PAYMENT}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&sortBy=${params?.sortBy}&order=${params?.order}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Create terms of payment
export const createTermsOfPaymentRequest = async (data: any) => {
    const url = `${routes.TERMS_OF_PAYMENT}`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// Get terms of payment by id
export const getTermsOfPaymentByIdRequest = async (id: number) => {
    const url = `${routes.TERMS_OF_PAYMENT}/${id}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// Edit terms of payment
export const editTermsOfPaymentRequest = async (id: number, data: any) => {
    const url = `${routes.TERMS_OF_PAYMENT}/${id}`;
    const result = await getApiResponse(url, true, MethodType.put, data);
    return result;
};

// Delete terms of payment by id
export const deleteTermsOfPaymentRequest = async (id: string) => {
    const url = `${routes.TERMS_OF_PAYMENT}/${id}`;
    const result = await getApiResponse(url, true, MethodType.delete);
    return result;
};


// get departments list
export const departmentListRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.DEPARTMENT}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&sortBy=${params?.sortBy}&order=${params?.order}`;
    return await getApiResponse(url, true, MethodType.get);
};


// CRUD OPERATION OF COUNTRIES
// get countries list
export const countriesListRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.COUNTRY}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&sortBy=${params?.sortBy}&order=${params?.order}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Create countries
export const createCountryRequest = async (data: any) => {
    const url = `${routes.COUNTRY}`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// upload csv for countries
export const uploadCsvCountryRequest = async (data: any) => {
    const url = `${routes.COUNTRY}/csv`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// download csv country template
export const downloadCsvCountryRequest = async () => {
    const url = `${routes.COUNTRY}/template`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// save csv country data
export const saveCountryCsvDataRequest = async (data: any) => {
    const url = `${routes.COUNTRY}/save-csv`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// Get country by id
export const getCountryByIdRequest = async (id: number) => {
    const url = `${routes.COUNTRY}/${id}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// Edit country
export const editCountryRequest = async (id: number, data: any) => {
    const url = `${routes.COUNTRY}/${id}`;
    const result = await getApiResponse(url, true, MethodType.put, data);
    return result;
};

// Delete country by id
export const deleteCountryRequest = async (id: string) => {
    const url = `${routes.COUNTRY}/${id}`;
    const result = await getApiResponse(url, true, MethodType.delete);
    return result;
};

// CRUD OPERATION OF INVOICE TYPE
// get invoice list
export const invoiceListRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.INVOICE_TYPE}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&sortBy=${params?.sortBy}&order=${params?.order}`;
    return await getApiResponse(url, true, MethodType.get);
};
// Create invoice
export const createInvoiceRequest = async (data: any) => {
    const url = `${routes.INVOICE_TYPE}`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// Get invoice by id
export const getInvoiceByIdRequest = async (id: number) => {
    const url = `${routes.INVOICE_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};
// Edit invoice
export const editInvoiceRequest = async (id: number, data: any) => {
    const url = `${routes.INVOICE_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.put, data);
    return result;
};
// Delete invoice by id
export const deleteInvoiceRequest = async (id: string) => {
    const url = `${routes.INVOICE_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.delete);
    return result;
};

// CRUD OPERATION OF REQUEST TYPES
// get request list
export const requestTypeListRequest = async (params?: {
    page: number;
    perPage: number;
    search: string;
    sortBy: string;
    order: string;
}) => {
    const url = `${routes.REQUEST_TYPE}?page=${params?.page}&perPage=${params?.perPage}&search=${params?.search}&sortBy=${params?.sortBy}&order=${params?.order}`;
    return await getApiResponse(url, true, MethodType.get);
};
// Create request
export const createRequestTypeRequest = async (data: any) => {
    const url = `${routes.REQUEST_TYPE}`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};
// Get request by id
export const getRequestTypeByIdRequest = async (id: number) => {
    const url = `${routes.REQUEST_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};
// Edit request
export const editRequestTypeRequest = async (id: number, data: any) => {
    const url = `${routes.REQUEST_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.put, data);
    return result;
};
// Delete request by id
export const deleteRequestTypeRequest = async (id: string) => {
    const url = `${routes.REQUEST_TYPE}/${id}`;
    const result = await getApiResponse(url, true, MethodType.delete);
    return result;
};

// CRUD OPERATION OF Report Category
// get request list
export const requestReportCategoryRequest = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.REPORT_CATEGORY}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};

// CRUD OPERATION OF SLA INFRASTRUCTURE
// list  Sla infrastructure
export const listSlaInfrastructureRequest = async () => {
    const url = `${routes.SLA_INFRASTRUCTURE}`;
    return await getApiResponse(url, true, MethodType.get);
};
// create Sla infrastructure
export const createSlaInfrastructureRequest = async (data: any) => {
    const url = `${routes.SLA_INFRASTRUCTURE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// delete Sla infrastructure
export const deleteSlaInfrastructureRequest = async (id: string) => {
    const url = `${routes.SLA_INFRASTRUCTURE}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};
// get Sla infrastructure by id
export const getSingleSlaInfrastructureRequest = async (id: string) => {
    const url = `${routes.SLA_INFRASTRUCTURE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// update Sla infrastructure
export const updateSlaInfrastructureRequest = async (data: any, id: string) => {
    const url = `${routes.SLA_INFRASTRUCTURE}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// CRUD OPERATION OF SLA SERVICE TIME INFRASTRUCTURE
// list  Sla service time
export const listSlaServiceTimesRequest = async () => {
    const url = `${routes.SLA_SERVICE_TIME}`;
    return await getApiResponse(url, true, MethodType.get);
};
// create Sla service time
export const createSlaServiceTimesRequest = async (data: any) => {
    const url = `${routes.SLA_SERVICE_TIME}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// delete Sla service time
export const deleteSlaServiceTimesRequest = async (id: string) => {
    const url = `${routes.SLA_SERVICE_TIME}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};
// get Sla service time by id
export const getSingleSlaServiceTimesRequest = async (id: string) => {
    const url = `${routes.SLA_SERVICE_TIME}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// update Sla service time
export const updateSlaServiceTimesRequest = async (data: any, id: string) => {
    const url = `${routes.SLA_SERVICE_TIME}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// CRUD OPERATION OF SLA LEVEL
// list  Sla level
export const listSlaLevelRequest = async () => {
    const url = `${routes.SLA_LEVEL}`;
    return await getApiResponse(url, true, MethodType.get);
};
// create Sla level
export const createSlaLevelRequest = async (data: any) => {
    const url = `${routes.SLA_LEVEL}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// delete Sla level
export const deleteSlaLevelRequest = async (id: string) => {
    const url = `${routes.SLA_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};
// get Sla level by id
export const getSingleSlaLevelRequest = async (id: string) => {
    const url = `${routes.SLA_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// update Sla level
export const updateSlaLevelRequest = async (data: any, id: string) => {
    const url = `${routes.SLA_LEVEL}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// CRUD OPERATION OF Contact Report Source
// get request list
export const requestContactReportSourceRequest = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.CONTACT_REPORT_SOURCE}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};

export const requestLeads = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.LEAD}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};


export const teamMembersList = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.EMPLOYEE}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};


export const skillGroupsList = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.SKILL_GROUPS}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};


// CRUD OPERATION OF Lead Status
// get request list
export const requestLeadStatusRequest = async (params?: {
    page: number;
    perPage: number;
    sortOrder: string;
    sortBy: string;
    search: string;
}) => {
    const url = `${routes.LEAD_STATUS}?page=${params?.page}&perPage=${params?.perPage}&sortBy=${params?.sortBy}&sortOrder=${params?.sortOrder}&search=${params?.search}`;
    return await getApiResponse(url, true, MethodType.get);
};

// get request generic list
export const genericListingRequest = async (
    requestUrl: string,
    params?: {
        page: number;
        perPage: number;
        order: string;
        sortBy: string;
        search: string;
        all?: boolean;
        softwareId?: number;
        productSoftwareId?: number;
        priceListId?: number | string;
        type?: string;
        status?: number | string;
        categoryId?: number | string;
    }
) => {
    const url = `${requestUrl}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// Delete generic request  by id
export const genericDeleteRequest = async (requestUrl: string, id: any) => {
    const url = `${requestUrl}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

// show generic record by id or for single record without id
export const genericShowRequest = async (requestUrl: string, id = null) => {
    let url = ''
    if (!!id)
        url = `${requestUrl}/${id}`;
    else
        url = `${requestUrl}`;

    return await getApiResponse(url, true, MethodType.get);
};


// Save generic request..
export const genericStoreRequest = async (requestUrl: string, data: any) => {
    const url = `${requestUrl}`;
    return await getApiResponse(url, true, MethodType.post, data);
};


export const genericUpdateRequest = async (requestUrl: string, id: any, data: any) => {
    const url = `${requestUrl}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// Create employee
export const createEmployeeRequest = async (data: any) => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.CREATE_USER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Update employee
export const updateEmployeeRequest = async (data: any) => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.UPDATE_USER}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// Get employee by id
export const getEmployeeByIdRequest = async (params?: {
    id: string
}) => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.GET_USER_BY_ID}?id=${params?.id}`;
    return await getApiResponse(url, true, MethodType.get);
};

// List employees
export const listEmployeesRequest = async (params?: {
    limit_start: any,
    limit_count: any,
    type: any,
    company_id: any
}) => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.LIST_USERS}?limit_start=${params?.limit_start}&limit_count=${params?.limit_count}&type=${params?.type}&company_id=${params?.company_id}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Delete employee
export const deleteEmployeeRequest = async (data: any) => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.DELETE_USER}`;
    const result = await getApiResponse(url, true, MethodType.delete, data);
    return result;
};

// List roles
export const rolesRequest = async () => {
    const url = `${runtimeConfig.public.authBaseUrl}${routes.LIST_ROLES}`;
    return await getApiResponse(url, true, MethodType.get);
};

// ADD PRODUCT API'S
// add product detail request
export const addProductDetailRequest = async (data: any) => {
    const url = `${routes.PRODUCT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product detai by id
export const getProductDetailByIdRequest = async (id: number) => {
    const url = `${routes.PRODUCT}/${id}`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};
// edit product detai by id
export const editProductDetailRequest = async (id: number, data: any) => {
    const url = `${routes.PRODUCT}/${id}`;
    const result = await getApiResponse(url, true, MethodType.put, data);
    return result;
};
//ADD PRODUCT VERSION
// get product Version
export const getProductVersionDependency = async (params?: { productVersionId?: number }) => {
    const url = `${routes.PRODUCT_DEPENDENCY}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// get product Version
export const addProductDependenciesRequest = async (data: any) => {
    const url = `${routes.PRODUCT_DEPENDENCY}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// ADD PRODUCT INSTALL ROUTINES
export const addProductInstallRoutinesRequest = async (data: any) => {
    const url = `${routes.PRODUCT_INSTALL_ROUTINE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product install routines
export const getProductInstallRoutinesRequest = async (id: any) => {
    const url = `${routes.PRODUCT_INSTALL_ROUTINE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// ADD PRODUCT UNINSTALL ROUTINES
export const addProductUninstallRoutinesRequest = async (data: any) => {
    const url = `${routes.PRODUCT_UNINSTALL_ROUTINE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product uninstall routines
export const getProductUninstallRoutinesRequest = async (id: any) => {
    const url = `${routes.PRODUCT_UNINSTALL_ROUTINE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// ADD PRODUCT CHILDRENS
// get software children
export const getProductSoftwareChildrenRequest = async (params?: { productVersionId?: number, productId?: number }) => {
    const url = `${routes.PRODUCT_CHILDREN}/software`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// get service children
export const getProductServiceChildrenRequest = async (params?: { productVersionId?: number, productId?: number }) => {
    const url = `${routes.PRODUCT_CHILDREN}/service`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// add product Childrens
export const addProductChildrensRequest = async (data: any) => {
    const url = `${routes.PRODUCT_CHILDREN}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// ADD PRODUCT PARAMETERS
export const addProductParametersRequest = async (data: any) => {
    const url = `${routes.PRODUCT_PARAMETERS}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product parameters
export const getProductParametersRequest = async (params?: { versionId?: number }) => {
    const url = `${routes.PRODUCT_PARAMETERS}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// get product parameters
export const convertFileToBaseRequest = async (data: any) => {
    const url = `${routes.CONVERT_FILE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// ADD PRODUCT ADDITIONAL SERVICES
export const addProductAdditionalServicesRequest = async (data: any) => {
    const url = `${routes.PRODUCT_ADDITIONAL_SERVICES}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product additional services
export const getProductAdditionalServicesRequest = async (params?: { versionId?: number }) => {
    const url = `${routes.PRODUCT_ADDITIONAL_SERVICES}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};
// ADD PRODUCT FILES
export const addProductFilesRequest = async (data: any) => {
    const url = `${routes.PRODUCT_FILES}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get product files
export const getProductFilesRequest = async (params?: { versionId?: number }) => {
    const url = `${routes.PRODUCT_FILES}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};

// get call direct Client Apis
export const specificGetRequest = async (
    requestUrl: string,
    params?: {
        limit_start: number;
        limit_count: number;
        type: string;
    }
) => {
    const url = `${requestUrl}?limit_start=${params.limit_start}&limit_count=${params.limit_count}`;
    return await specificApiResponse(url, true, MethodType.get, null);
};

export const specificPostRequest = async (
    requestUrl: string,
    data: any
) => {
    const url = `${requestUrl}`;
    return await specificApiResponse(url, true, MethodType.post, data);
};
export const specificShowRequest = async (
    requestUrl: string,
) => {
    const url = `${requestUrl}`;
    return await specificApiResponse(url, true, MethodType.get);
};
export const specificUpdateRequest = async (
    requestUrl: string,
    data: any
) => {
    const url = `${requestUrl}`;
    return await specificApiResponse(url, true, MethodType.post, data);
};

//Affected Group Create
export const affectedGroupCreateRequest = async (data: any) => {
    const url = `${routes.AFFECTED_GROUP}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.post, data);
};

//Affected Group Show
export const affectedGroupShowRequest = async (id: any) => {
    const url = `${routes.AFFECTED_GROUP}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Affected Group Update
export const affectedGroupUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.AFFECTED_GROUP}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

//Project Status Create
export const projectStatusCreateRequest = async (data: any) => {
    const url = `${routes.PROJECT_STATUS}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.post, data);
};

//Project Status Show
export const projectStatusShowRequest = async (id: any) => {
    const url = `${routes.PROJECT_STATUS}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Project Status Update
export const projectStatusUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.PROJECT_STATUS}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

//Protocol Type Create
export const protocolTypeCreateRequest = async (data: any) => {
    const url = `${routes.PROTOCOL_TYPE}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.post, data);
};

//Protocol Type Show
export const protocolTypeShowRequest = async (id: any) => {
    const url = `${routes.PROTOCOL_TYPE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Protocol Type Update
export const protocolTypeUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.PROTOCOL_TYPE}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

// List Event Name
export const eventNameListRequest = async () => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.LIST_EVENT_NAME}`;
    // return await getApiResponse(url, true, MethodType.get);
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    return result?.data;
};

// Event Name Create
export const eventNameCreateRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.CREATE_EVENT_NAME}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Get Event Name By Id
export const eventNameByIdRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.GET_EVENT_BY_ID}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Event Name Update
export const eventNameUpdateRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.UPDATE_EVENT_NAME}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Event Name Delete
export const eventNameDeleteRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.DELETE_EVENT_NAME}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// add sale offer
export const addSaleOfferRequest = async (data: any) => {
    const url = `${routes.SALE_OFFER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// offer export csv 
export const downloadOfferCsvRequest = async () => {
    const url = `${routes.SALE_OFFER}/download-csv`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};
// offer export latest csv 
export const downloadOfferLatestCsvRequest = async () => {
    const url = `${routes.SALE_OFFER}/download-latest-csv`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// edit sale offer
export const editSaleOfferRequest = async (data: any, id: number) => {
    const url = `${routes.SALE_OFFER}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// get sale offer  by id
export const getSaleOfferRequest = async (id: string) => {
    const url = `${routes.SALE_OFFER}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

// add sale order confirmation
export const addSaleOfferConfirmationRequest = async (data: any) => {
    const url = `${routes.SALE_OFFER_CONFIRMATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// edit sale order confirmation
export const editSaleOfferConfirmationRequest = async (data: any, id: number) => {
    const url = `${routes.SALE_OFFER_CONFIRMATION}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// get sale order confirmation by id
export const getSaleOfferConfirmationRequest = async (id: string) => {
    const url = `${routes.SALE_OFFER_CONFIRMATION}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};


//On Premise Create
export const onPremiseCreateRequest = async (data: any) => {
    const url = `${routes.SYSTEM_ON_PREMISE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//On Premise Show
export const onPremiseShowRequest = async (id: any) => {
    const url = `${routes.SYSTEM_ON_PREMISE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//On Premise Update
export const onPremiseUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.SYSTEM_ON_PREMISE}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

//User Profile Create
export const employeeCreateRequest = async (data: any) => {
    const url = `${routes.EMPLOYEE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};


//User Profile Show
export const employeeShowRequest = async (id: any) => {
    const url = `${routes.EMPLOYEE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//User Profile Update
export const employeeUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.EMPLOYEE}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

//Job Data Create
export const jobDataCreateRequest = async (data: any) => {
    const url = `${routes.JOB_DATA}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Job Data Show
export const jobDataShowRequest = async (id: any) => {
    const url = `${routes.JOB_DATA}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Document and Contract Create
export const documentAndContractCreateRequest = async (data: any) => {
    const url = `${routes.USER_PROFILE_DOCUMENT_CREATE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Document and Contract List
export const documentAndContractRequest = async (params?: {
    employeeId: string
}) => {
    const url = `${routes.USER_PROFILE_DOCUMENT}?employeeId=${params?.employeeId}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Document and Contract Delete
export const documentAndContractDeleteRequest = async (id: any) => {
    const url = `${routes.USER_PROFILE_DOCUMENT}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Compensation And Benefits Create
export const compensationAndBenefitsCreateRequest = async (data: any) => {
    const url = `${routes.COMPENSATION_AND_BENEFITS}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Compensation And Benefits Show
export const compensationAndBenefitsShowRequest = async (id: any) => {
    const url = `${routes.COMPENSATION_AND_BENEFITS}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Fuel Receipt Create
export const fuelReceiptCreateRequest = async (data: any) => {
    const url = `${routes.FUEL_MONITORING}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Fleet Driver Create
export const fleetDriverCreateRequest = async (data: any) => {
    const url = `${routes.FLEET_DRIVER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Get single fleet driver by id
export const getFleetDriverRequest = async (id: any) => {
    const url = `${routes.FLEET_DRIVER}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Get All Fleet Drivers
export const getFleetDriversRequest = async () => {
    const url = `${routes.FLEET_DRIVER}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Driver License Check Create
export const driverLicenseCheckCreateRequest = async (data: any) => {
    const url = `${routes.DRIVER_LICENSE_CHECK}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Illness Leave List
export const illnessLeaveRequest = async (params?: {
    employeeId: string
}) => {
    const url = `${routes.ILLNESS_LEAVE}?employeeId=${params?.employeeId}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Document and Contract Delete
export const illnessLeaveDeleteRequest = async (id: any) => {
    const url = `${routes.ILLNESS_LEAVE}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Compensation And Benefits Create
export const illnessLeaveCreateRequest = async (data: any) => {
    const url = `${routes.ILLNESS_LEAVE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Upload User Profile
export const uploadUserProfileRequest = async (data: any) => {
    const url = `${routes.UPLOAD_USER_PROFILE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// get request My Vacation request list
export const myVacationListRequest = async (
    params?: {
        leaveType: string;
        dateFrom: string;
        dateTo: string;
        employeeId: string;
        status: string;
        search: string
    }
) => {
    return await getApiResponse(routes.VACATION_REQUEST, true, MethodType.get, null, params);
};

// Create Invoice
export const invoiceCreateRequest = async (data: any) => {
    const url = `${routes.INVOICE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Invoice Show
export const invoiceShowRequest = async (id: any) => {
    const url = `${routes.INVOICE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Invoice Update
export const invoiceUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.INVOICE}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

// PDF Generation Invoice
export const invoicePdfGenerationRequest = async (data: any) => {
    const url = `${runtimeConfig.public.documentServiceUrl}${routes.INVOICE_PDF_DOCX_GENERATION}`;
    
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        data,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        responseType: "blob",

    });
    return result.data;
};

// get request generic list
export const vacationApprovalListRequest = async (
    params?: {
        employeeId: Number;
        status: any;
        all: Boolean;
    }
) => {
    console.log(params)
    return await getApiResponse(routes.VACATION_APPROVAL_REQUEST, true, MethodType.get, null, params);
};


//Fleet Driver Create
export const travelExpenseCreateRequest = async (data: any) => {
    const url = `${routes.TRAVEL_EXPENSE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Create Price List
export const priceListCreateRequest = async (data: any) => {
    const url = `${routes.PRICE_LIST}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Price List Show
export const priceListShowRequest = async (id: any) => {
    const url = `${routes.PRICE_LIST}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Price List Update
export const priceListUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.PRICE_LIST}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

// get User List in offer and confirm offer
export const getUserListFromComsumerIdRequest = async (params: {
    limit_start: number;
    limit_count: number;
    type: string;
    company_id: any
}) => {
    const url = `${runtimeConfig.public.listUsersUrl}${'/list-users'}`;
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    return result?.data;
};

// get Projects List in offer and confirm offer
export const getProjectsFromComsumerIdRequest = async (params: {
    companyId: any
}) => {
    const url = `${runtimeConfig.public.listProjectsUrl}${`/project-management/projects`}`;
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    return result?.data;
};

// get request generic list
export const vacationCalendarListing = async (
    params?: {
        leaveType: string | null;
        status: string | null;
        teamId: string | null;
        departmentId: string | null;
        locationId: string | null;
        sortBy: string | null;
        groupBy: string | null;
        userPerPage: Number | null;
        search: string | null
    }, payload: unknown
) => {
    return await getApiResponse(routes.VACATION_CALENDAR, true, MethodType.post, payload, params);
};

// Rule List
export const ruleListRequest = async () => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.RULES_LIST}`;
    // return await getApiResponse(url, true, MethodType.get);
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "GET",
    });
    return result?.data;
};

// Rule Delete
export const ruleDeleteRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.DELETE_RULE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Rule Create
export const ruleCreateRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.CREATE_RULE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Get Rule By Id
export const ruleByIdRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.RULE_BY_ID}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Update Rule
export const updateRuleRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.UPDATE_RULE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Create Workshop Template
export const workshopTemplateCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};


//Workshop Template Update
export const workshopTemplateUpdateRequest = async (data: any, id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE}/${id}`;
    //const dataObj = JSON.stringify({ ...data });
    return await getApiResponse(url, true, MethodType.put, data);
};

// Create Bill for travel expense
export const travelExpenseBillCreateRequest = async (data: any) => {
    const url = `${routes.TRAVEL_EXPENSE_BILL}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Update status for travel expense
export const travelExpenseStatusUpdateRequest = async (data: any) => {
    const url = `${routes.TRAVEL_EXPENSE_UPDATE_STATUS}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Create Bill for travel expense
export const travelExpensePrivateTransportationCreateRequest = async (data: any) => {
    const url = `${routes.TRAVEL_EXPENSE_TRANSPORT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// Create Bill for travel expense
export const travelExpenseDaySpecificationsCreateRequest = async (data: any, travelExpenseId) => {
    const url = `${routes.TRAVEL_EXPENSE_DAY_SPECIFICATIONS}${'/' + travelExpenseId}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// MY TASKS CRUD
export const getMyTasksRequest = async (params?: {
    authUserId?: any,
    status?: any,
    projectId?: any,
    milestoneId?: any
}) => {
    const url = `${routes.MY_TASKS}`;
    return await getApiResponse(url, true, MethodType.get, null, params);
};

export const changeTasksStatusRequest = async (data: any) => {
    const url = `${routes.MY_TASKS_STATUS_UPDATE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const createTasksRequest = async (data: any) => {
    const url = `${routes.MY_TASKS}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
export const getTasksRequest = async (id: any) => {
    const url = `${routes.MY_TASKS}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
export const updateTasksRequest = async (data: any, id: any) => {
    const url = `${routes.MY_TASKS}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

// global setting -> create cip configuration
export const saveCipConfigRequest = async (data: any) => {
    const url = `${routes.CIP_CONFIGURATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

// global setting -> get and show cip configuration
export const getCipConfigRequest = async () => {
    const url = `${routes.CIP_CONFIGURATION}`;
    return await getApiResponse(url, true, MethodType.get);
};

// PRODUCT CSV
// upload csv for countries
export const uploadCsvProductRequest = async (data: any) => {
    const url = `${routes.PRODUCT}/csv`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// download csv product template
export const downloadCsvProductRequest = async () => {
    const url = `${routes.PRODUCT}/template`;
    const result = await getApiResponse(url, true, MethodType.get);
    return result;
};

// save csv product data
export const saveProductCsvDataRequest = async (data: any) => {
    console.log('data', data);
    const url = `${routes.PRODUCT}/save-csv`;
    const result = await getApiResponse(url, true, MethodType.post, data);
    return result;
};

// get mail service direct Client Apis
export const mailServiceRequest = async (
    requestUrl: string,
    params?: {
        limit_start: number;
        limit_count: number;
        type: string;
    }
) => {
    const url = `${requestUrl}`;
    return await mailServiceResponse(url, true, MethodType.get);
};
//mail Service Create
export const mailServiceCreateRequest = async (requestUrl: any, data: any) => {
    const url = `${requestUrl}`;
    return await mailServiceResponse(url, true, MethodType.post, data);
};
//mail Service Show
export const mailServiceShowRequest = async (requestUrl: any) => {
    const url = `${requestUrl}`;
    return await mailServiceResponse(url, true, MethodType.get);
};
//mail Service Update
export const mailServiceUpdateRequest = async (requestUrl: any, data: any) => {
    const url = `${requestUrl}`;
    return await mailServiceResponse(url, true, MethodType.put, data);
};

//Fleet List Delete
export const mailServiceDeleteRequest = async (requestUrl: any, data: any) => {
    const url = `${requestUrl}`;
    return await mailServiceResponse(url, true, MethodType.delete, data);
};
export const apiKeysRequest = async (
    params?: {
        limit_start: number;
        limit_count: number;
        type: string;
    }
) => {
    const url = `${routes.API_KEYS}?limit_start=${params.limit_start}&limit_count=${params.limit_count}`;
    return await getApiResponse(url, true, MethodType.get);
};
export const showApiKeyFunc = async (requestUrl: any) => {
    const url = `${requestUrl}`;
    return await getApiResponse(url, true, MethodType.get);
};

// License Generator Crud
// create
export const createLicenseGeneratorRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.CREATE_LICENSE}`;
    // return await getApiResponse(url, true, MethodType.get);
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        data: data
    });
    return result?.data;
};
//update
export const updateLicenseGeneratorRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.UPDATE_LICENSE}`;
    // return await getApiResponse(url, true, MethodType.get);
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        data: data
    });
    return result?.data;
};
// Delete
export const deleteLicenseGeneratorRequest = async (data: any) => {
    const url = `${runtimeConfig.public.licenseServiceUrl}${routes.DELETE_LICENSE}`;
    // return await getApiResponse(url, true, MethodType.get);
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        data: data
    });
    return result?.data;
};
// list
export const getLicenseGeneratorRequest = async (id: any) => {
    const url = `${routes.LICENSES}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};
// Create Api token in show License Generator.
export const createApiTokenRequest = async (data: any) => {
    const url = `${runtimeConfig.public.authServiceBaseUrl}${routes.CREATE_API_TOKEN}`;
    const token = JSON.parse(localStorage.getItem("token") as any);
    const result = await axios({
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        data: data
    });
    return result?.data;
};

//Workshop Template Row Create
export const workshopTemplateRowCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_ROW}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Workshop Template Row Delete
export const workshopTemplateRowDeleteRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_ROW}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Workshop Template Card Create
export const workshopTemplateCardCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_CARD}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Workshop Template Card Delete
export const workshopTemplateCardDeleteRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_CARD}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Workshop Template Column Create
export const workshopTemplateColumnCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_COLUMN}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Workshop Template Column Create
export const workshopTemplateColumnDeleteRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_COLUMN}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};


//Workshop Template Widget Create
export const workshopTemplateWidgetCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_WIDGET}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Workshop Template Widget Delete
export const workshopTemplateWidgetDeleteRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_WIDGET}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

//Workshop Template File Create
export const workshopTemplateFileCreateRequest = async (data: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_FILE_UPLOAD}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

//Workshop Template File Delete
export const workshopTemplateFileDeleteRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE_FILE_REMOVE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Workshop Template Show
export const workshopTemplateShowRequest = async (id: any) => {
    const url = `${routes.WORKSHOP_TEMPLATE}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Save Mail Template Assignment
export const saveMailTemplateAssignmentRequest = async (data: any) => {
    const url = `${routes.MAIL_TEMPLATE_ASSIGNMENT}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
// Get Mail Template Assignment
export const getMailTemplateAssignmentRequest = async () => {
    const url = `${routes.MAIL_TEMPLATE_ASSIGNMENT}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Sales Dashboard Statistics List
export const salesDashboardStatisticsRequest = async (params: {
    date: string,
    type: string,
    customerId: string
}) => {
    const url = `${routes.SALES_DASHBOARD_STATISTICS}?date=${params?.date}&type=${params?.type}&customerId=${params?.customerId}`;
    return await getApiResponse(url, true, MethodType.get);
};

//Employee Asset List
export const employeeAssetRequest = async (params: {
    userId: string
}) => {
    const url = `${routes.EMPLOYEE_ASSET}?userId=${params?.userId}`;
    return await getApiResponse(url, true, MethodType.get);
};

// Update surveys global settings
export const surveySettingsUpdateRequest = async (data: any, id) => {
    const url = `${routes.SURVEYS_SETTINGS}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

//Survey Template Widget Delete
export const surveyQuestionTemplateWidgetPostRequest = async (data: any) => {
    const url = `${routes.SURVEYS_QUESTION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};
//Survey Template Widget Delete
export const surveyChapterTemplateWidgetPostRequest = async (data: any) => {
    const url = `${routes.SURVEYS_CHAPTER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyStyleConfigurationsPostRequest = async (data: any) => {
    const url = `${routes.STYLE_CONFIGURATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyConfigurationsPostRequest = async (data: any) => {
    const url = `${routes.SURVEY_CONFIGURATION}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyQuestionPutRequest = async (data: any, id) => {
    const url = `${routes.SURVEYS_QUESTION_UPDATE}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

export const surveyChapterPutRequest = async (data: any, id) => {
    const url = `${routes.SURVEYS_CHAPTER_UPDATE}/${id}`;
    return await getApiResponse(url, true, MethodType.put, data);
};

export const surveyShowGetRequest = async (id) => {
    const url = `${routes.SURVEYS}/${id}`;
    return await getApiResponse(url, true, MethodType.get);
};

export const surveyMoveQuestionPostRequest = async (data: any) => {
    const url = `${routes.SURVEYS_QUESTION_MOVE}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyChangeQuestionOrderPostRequest = async (data: any) => {
    const url = `${routes.SURVEYS_QUESTION_CHANGE_ORDER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyChangeChapterOrderPostRequest = async (data: any) => {
    const url = `${routes.SURVEYS_CHAPTER_CHANGE_ORDER}`;
    return await getApiResponse(url, true, MethodType.post, data);
};

export const surveyQuestionDeleteRequest = async (id: any) => {
    const url = `${routes.SURVEYS_QUESTION_DELETE}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

export const surveyChapterDeleteRequest = async (id: any) => {
    const url = `${routes.SURVEYS_CHAPTER_DELETE}/${id}`;
    return await getApiResponse(url, true, MethodType.delete);
};

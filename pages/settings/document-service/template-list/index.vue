<script setup lang="ts">
import moment from "moment";
import { routes } from "~/utils/apiRoutes";
import { onMounted, ref } from "vue";
import commonCode from "~/composables/common";
import {
  deleteSlaInfrastructureRequest,
  docListRequest,
} from "~/utils/apiRequests";
import genericFeatures from "~/composables/generic";
import { getApiResponse, MethodType } from "~/utils/axiosFunctions";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const runtimeConfig = useRuntimeConfig(),
  { t } = useI18n(),
  { showGenericListing } = genericFeatures(),
  { Toast, deleteAlert } = commonCode(),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Document Service",
      active: true,
    },
  ],
  optionalItems = {
    isBtnShow: true,
    btnText: "Create Template",
    path: "/settings/document-service/template-list/create",
  },
  columnConfig = [
    {
      label: "ID",
      field: "id",
    },
    {
      label: "Name",
      field: "name",
    },
    {
      label: "Documents Generated",
      field: "generated_document_count",
    },
    {
      label: "Company",
      field: "company_name",
    },
    {
      label: "Creation Date",
      field: "creation_date",
    },
    {
      label: "Action",
      field: "action",
    },
  ],
  { title } = useTitle("Document Service"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  templateList = ref([]),
  companies = ref([]);

const getCompanyNameFromListing = (id) => {
  const manager = companies.value.find((company) => company.id == id);
  return manager?.name ?? "";
};

const processCompaniesInDocuments = () => {
  templateList.value.forEach((template) => {
    template["company_name"] = getCompanyNameFromListing(template.company_id);
    template["creation_date"] = moment(template.creation_date).format(
      "YYYY-MM-DD"
    );
  });
};

async function deleteDocument(id: any) {
  if (!!id) {
    await deleteAlert().then(async (result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        try {
          const url = `${runtimeConfig.public.documentServiceUrl}/delete-file`;
          const result = await getApiResponse(url, true, MethodType.post, {
            id: id,
          });

          Toast.fire({
            icon: "success",
            title: t("Record deleted successfully!"),
          });

          const res = await docListRequest({ start: 0, count: 1000 });
          templateList.value = res?.data;

          showGenericListing(routes.COMPANY)
            .then((response: any) => {
              companies.value = response?.data?.customers.map(
                (customer: any) => {
                  return {
                    name: customer.name,
                    id: customer.id,
                  };
                }
              );
            })
            .catch((error) => {
              Toast.fire({ icon: "error", title: t("something went wrong!") });
            });
          processCompaniesInDocuments();
        } catch (e) {
          Toast.fire({ icon: "error", title: t("Something went wrong") });
        }
      }
    });
  }
}

onMounted(async function () {
  try {
    const res = await docListRequest({ start: 0, count: 1000 });
    templateList.value = res?.data;

    showGenericListing(routes.COMPANY)
      .then((response: any) => {
        companies.value = response?.data?.customers.map((customer: any) => {
          return {
            name: customer.name,
            id: customer.id,
          };
        });
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: t("something went wrong!") });
      });
    processCompaniesInDocuments();
  } catch (e) {
    Toast.fire({ icon: "error", title: t("Something went wrong") });
  }
});

useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" />
    <Table
      class="doc-table"
      :key="templateList?.length"
      :columns="columns"
      :rows="templateList"
      editPath="/settings/document-service/template-list/edit-"
      showPath="/settings/document-service/template-list/show-"
      @destroy="deleteDocument"
    />
  </div>
</template>

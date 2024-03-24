<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref } from "vue";
import { routes } from "~/utils/apiRoutes";
import genericFunctionality from "~/composables/genericFunctionality";
import commonCode from "~/composables/common";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";
import genericFeatures from "~/composables/generic";


const { fetchListing, showGenericListing } = genericFeatures();
const store = useLayoutStore();
const { t } = useI18n();
const {
  apiRoute,
  currentPerPage,
  currentPage,
  orderDirection,
  orderColumn,
  data,
  listingFunc,
  onSortChange,
  handleSearch,
  destroy,
} = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode();
const breadCrumbsConfig = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Open posts",
    active: true,
  },
];
const optionalItems = {
  searchBar: true,
  isBtnShow: false,
  btnText: "Create Performance Record",
  path: "/finance/open-posts/create",
};

const columnConfig = [
  {
    label: "Invoice number",
    field: "number",
    sortable: true,
  },
  {
    label: "Created At",
    field: "createdAt",
    sortable: true,
  },
  {
    label: "Due Date",
    field: "dueDate",
    sortable: true,
  },
  {
    label: "Invoice Category",
    field: "invoiceType",
    sortable: true,
  },
  {
    label: "Company",
    field: "Customer.customer.name",
    sortable: true,
  },
  {
    label: "Reminder Level",
    field: "reminderLevel",
    sortable: true,
  },
  {
    label: "Netto",
    field: "amountWithoutTax",
    sortable: true,
  },
  {
    label: "Action",
    field: "action",
    sortable: false,
  },
],
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),
  { title } = useTitle("Open posts");
const rows = ref([]);
const customers = ref([]);
const customerId = ref('');
const refresh = () => {
  apiRoute.value = routes.OPEN_POST;
  const param = {
    page: 1,
    perPage: 10,
    sortBy: 'invoiceNumber',
    sortOrder: 'asc',
    search: '',
    customerId: customerId.value ?? ''
  }
  listingFunc(param);
}

const fetchCustomers = () => {
  showGenericListing(routes.COMPANY).then((response: any) => {
    customers.value = response?.data?.customers.map((customer: any) => {
      return {
        text: customer.name,
        value: customer.id,
      };
    });
  });
}

const toggleMailModal = async (invoiceData:any) => {
  
  return
  if (invoiceData.reminderSent) {
    if (
      !confirm("Do you really want to send the reminder again?")
    ) {
      return;
    }
  }
  this.invoiceData = invoiceData; //set invoiceData prop value
  // toggle the MailModal
  this.toggleModal = true;
  try {
    this.processing = true;
    // get the invoice, performanceRecord details
    const response = await this.$store.dispatch(
      "invoices/downloadGeneratedInvoice",
      invoiceData.id
    );
    const invoice = response?.data?.invoice;
    let warningLevelResponse = "";
    let warningLevel = {};
    let templateId = "";
    if (!!invoice?.reminderLevelId) {
      warningLevelResponse = await this.$store.dispatch(
        "invoicereminder/show",
        invoice?.reminderLevelId
      );
      
    } else {
      warningLevelResponse = await this.$store.dispatch(
        "invoicereminder/showByLevelName",
        {
          levelName: invoice?.invoiceStatus,
        }
      );
    }
    warningLevel = warningLevelResponse?.data?.data ?? {};
    templateId =
      warningLevelResponse?.data?.data?.documentTemplateId ?? "";
    let mailTemplateResponse = await this.$store.dispatch(
      "mailTemplates/mailTemplateByModule",
      {
        module: warningLevel?.levelName,
      }
    );
    this.mailTemplate = mailTemplateResponse?.data?.data ?? "";
    // if there is invoice details, then generate the document
    if (invoice) {
      const filename =
        "invoice-reminder-" +
        (invoice.invoiceNumber == null
          ? "draft"
          : invoice.invoiceNumber) +
        ".pdf";
      const invoiceResponse = await this.$store.dispatch(
        "documentService/processTemplateBase64",
        {
          data: {
            ...invoice,
            id: templateId,
            ...warningLevel,
          },
          filename: filename,
          documentType: "pdf",
        }
      );
      // generate and set base64 and filename for invoice prop
      var reader = new FileReader();
      reader.readAsDataURL(invoiceResponse);
      reader.onloadend = () => {
        this.invoice = {
          name: filename,
          base64: reader.result,
        };
      };
    }
  } catch (e) {
    console.log(e);
  } finally {
    this.processing = false;
  }
}


watch(
  () => customerId.value,
  (val) => {
    refresh();
  }
);




refresh();
fetchCustomers();
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" :optionalItems="optionalItems" />
    <div class="row">
      <div class="col-lg-4">
        <div class="form-group">
          <elements-multiselect v-model="customerId" :options="customers" label="text" track-by="value"
            :textLabel="$t('Select customer:')" :required="true" />
        </div>
      </div>
    </div>
    <Table class="doc-table" :key="data?.invoices?.length" :columns="columns" :rows="data?.invoices"
      editPath="/finance/open-posts/edit-" :orderColumn="orderColumn" :orderDirection="orderDirection"
      @onSortChange="onSortChange" @destroy="destroy" uuid=1 :isCustomBody="true">
      <tr v-if="data?.invoices?.length > 0" v-for="(row, index) in data?.invoices" :key="row?.id">
        <td v-if="row.id"> {{ row.id }} </td> <!-- to show serial no -->
        <td v-for="(col) in columns" :key='col.field' v-show="col.field !== 'action'">
          <span>
            {{ row[col.field] }}
          </span>
        </td>

        <td>
          <span class="px-1 cursor-pointer" @click="toggleMailModal(row)">
            <!-- <elements-icon v-bind:icon="'editIcon'"></elements-icon> -->
            Generate Email
          </span>
          |
          <span class="px-1 cursor-pointer" @click="generateDocument(row.id)">
            <!-- <elements-icon v-bind:icon="'editIcon'"></elements-icon> -->
            Generate Document
          </span>
          |
          <span class="px-1 cursor-pointer" @click="navigateTo({ path: `/finance/invoices/edit-${row?.id}` })">
            <elements-icon v-bind:icon="'editIcon'"></elements-icon>Invoice
          </span>
          |
          <span class="px-1 cursor-pointer" @click="navigateTo({ path: `/finance/open-posts/edit-${row?.id}` })">
            <elements-icon v-bind:icon="'editIcon'"></elements-icon>Post
          </span>
        </td>
      </tr>
      <tr v-else>
        <td :colspan="columns?.length" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
      </tr>
    </Table>
  </div>
  <div class="mt-3">
    <Pagination @change="refresh" :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  contactReportRequest,
  contactReportDeleteRequest
} from "~/utils/apiRequests";
import commonCode from "~/composables/common";
const { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  emit = defineEmits(["leadsDone", "backToEmployees"]);
const props = defineProps({
  leadId: {
    type: String,
    default: false,
  }
});
const order = ref("asc");
const column = ref("id");
const items =ref([]); 

const optionalItems = {
  searchBar: true,
  isBtnShow: true,
  btnText: "Create Contact Report",
  path: "/contact-reports/create?customerId="+props.leadId,
};

const prev = () => {
  emit("backToEmployees");
};

const next = () => {
  emit("leadsDone");
};
const contactReports = ref([]);
const columns = ref([
  {
    label: "Report Number",
    field: "number",
    sortable: true,
  },
  {
    label: "Company",
    field: "companyName",
    sortable: true,
  },
  {
    label: "Subject",
    field: "subject",
    sortable: true,
  },
  {
    label: "Priority",
    field: "priority",
    sortable: true,
  },
  {
    label: "Category",
    field: "categoryName",
    sortable: true,
  },
  {
    label: "Initiated by",
    field: "initiatedBy",
    sortable: true,
  },
  {
    label: "Actions",
    field: "action",
    sortable: false,
  },
]);


const refresh = (data) => {
  contactReportRequest({
    page: data,
    perPage: 10,
    sortBy: column.value,
    sortOrder: order.value,
    search: "",
    customerId: props.leadId,
  }).then((response) => {
    contactReports.value = response?.data;
  });
};


async function deleteRecord(id) {
  if (!!id) {
    await deleteAlert().then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        contactReportDeleteRequest(id)
          .then((response) => {
            Toast.fire({
              icon: "success",
              title: t("Record deleted successfully!"),
            });
            refresh(1);
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: t("Something went wrong") });
          });
      }
    });
  }
}

refresh(1);

</script>
<template>
  <div>
    <div>
      <page-header
        :title="title"
        :items="items"
        :optionalItems="optionalItems"
        @watchEvent="handleSearch"
      />
      <div class="row mt-4 product-table">
      <div class="col-12 col-lg-12 col-sm-12">
        <div class="table-responsive mt-3">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>Report Number</th>
                <th>Company</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Initiated By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in contactReports?.contactReports"
                :key="index"
              >
                <td>{{ item?.number }}</td>
                <td>{{ item?.companyName }}</td>
                <td>{{ item?.subject }}</td>
                <td>{{ item?.priority }}</td>
                <td>{{ item?.categoryName }}</td>
                <td>{{ item?.initiatedBy }}</td>
                <td>
                  <nuxt-link :to="`/contact-reports/edit-${item?.id}`"> <i
                    class="mdi mdi-pencil edit-icon"
                  ></i></nuxt-link>
                  
                  <i
                    class="mdi mdi-delete edit-icon"
                    @click.prevent="deleteRecord(item?.id)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3">
        <Pagination
        @change="refresh"
        :totalPages="contactReports?.totalPages"
        :nextPage="contactReports?.nextPageUrl"
        :firstPageUrl="contactReports?.firstPageUrl"
        :lastPageUrl="contactReports?.lastPageUrl"
        :previousPageUrl="contactReports?.previousPageUrl"
        :currentPage="contactReports?.currentPage"
      />
      </div>
    </div>
    </div>
    <div
      class="form-group text-right mt-5 d-flex align-items-center justify-content-between"
    >
      <button class="primary-btn" @click.prevent="prev()">Previous</button>
      <submittal-button
        @click="next()"
        :buttonName="$t('Save and Proceed')"
      />
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import {
  getSaleOfferRequest,
  getSaleOfferConfirmationRequest,
  getLicenseGeneratorRequest,
  createApiTokenRequest
} from "~/utils/apiRequests";
import KeyModal from "./components/KeyModal.vue"
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const { t } = useI18n(),
  { router, Toast } = commonCode(),
  breadCrumbsConfig = [
    {
      text: "Admin Portal",
      to: "/",
    },
    {
      text: "License Generator",
      to: "/licenses",
      active: true,
    },
    {
      text: "Show",
      active: true,
    },
  ];
const id = router.params.id;
const state = reactive({
  name: "",
  company_id: null,
  tenant_id:  null,
  status: "",
  usageStatistics: "",
  rules: null
}),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Show License");
const isLoading = ref(false);
const isModalOpen = ref(false);

const licenseKey = ref("");
const productTableData = ref([]);
const usageStatisticsTableData = ref([]);


  function hideModal() {
    isModalOpen.value = false;
  }
  function showModal() {
    isModalOpen.value = true;
  }


// For edit case fetch the record
onMounted(async function () {
  try {
    if (!id) {
      return;
    }
    const resLicense = await getLicenseGeneratorRequest(id);
    const { name, company, tenant, status, products, config } = resLicense.data;
    state.name = name;
    state.company_id = company;
    state.tenant_id = tenant;
    state.status = status;
    productTableData.value = products;
  } catch (e) {
    console.log(e);
  }
});


        /**
         * hashes the inputString and returns the hashed string
         * @param {inputString} input string to be hashed
         */
        function hashCode(inputString) {
            inputString = inputString + "hashcodefromstringdh112233";
            var hc = "0123456789abcdef";
            function rh(n) {
                var j,
                    s = "";
                for (j = 0; j <= 3; j++)
                    s +=
                        hc.charAt((n >> (j * 8 + 4)) & 0x0f) +
                        hc.charAt((n >> (j * 8)) & 0x0f);
                return s;
            }
            function ad(x, y) {
                var l = (x & 0xffff) + (y & 0xffff);
                var m = (x >> 16) + (y >> 16) + (l >> 16);
                return (m << 16) | (l & 0xffff);
            }
            function rl(n, c) {
                return (n << c) | (n >>> (32 - c));
            }
            function cm(q, a, b, x, s, t) {
                return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
            }
            function ff(a, b, c, d, x, s, t) {
                return cm((b & c) | (~b & d), a, b, x, s, t);
            }
            function gg(a, b, c, d, x, s, t) {
                return cm((b & d) | (c & ~d), a, b, x, s, t);
            }
            function hh(a, b, c, d, x, s, t) {
                return cm(b ^ c ^ d, a, b, x, s, t);
            }
            function ii(a, b, c, d, x, s, t) {
                return cm(c ^ (b | ~d), a, b, x, s, t);
            }
            function sb(x) {
                var i;
                var nblk = ((x.length + 8) >> 6) + 1;
                var blks = new Array(nblk * 16);
                for (i = 0; i < nblk * 16; i++) blks[i] = 0;
                for (i = 0; i < x.length; i++)
                    blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
                blks[i >> 2] |= 0x80 << ((i % 4) * 8);
                blks[nblk * 16 - 2] = x.length * 8;
                return blks;
            }
            var i,
                x = sb("" + inputString),
                a = 1732584193,
                b = -271733879,
                c = -1732584194,
                d = 271733878,
                olda,
                oldb,
                oldc,
                oldd;
            for (i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;
                a = ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = ff(c, d, a, b, x[i + 10], 17, -42063);
                b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = hh(a, b, c, d, x[i + 5], 4, -378558);
                d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = ad(a, olda);
                b = ad(b, oldb);
                c = ad(c, oldc);
                d = ad(d, oldd);
            }
            return rh(a) + rh(b) + rh(c) + rh(d);
        };
        /**
         * hits the create api-key API and creates a licenseKey from the client_id and secret retrieved from the response
         * shows the created license key in the modal
         * and download the license key as a file
         */
         async function generateNewLicense() {
            try {
                isLoading.value= true;
                const payload = {
                    name:
                        (state.company_id?.companyName ?? "") +
                        "-" +
                        state.name,
                    company_id: state.company_id?.id ?? "",
                    tenant_id: state.tenant_id?.id ?? "",
                    // roles: state.rules.map((rule) => rule.role_id),
                    roles: [],
                    status: 1,
                };
                const response = await createApiTokenRequest(payload);
                isLoading.value= true;
                licenseKey.value += response?.data?.jwt ?? "";
                licenseKey.value += ":";
                licenseKey.value += window.btoa(this.form.id);
                licenseKey.value += ":";
                licenseKey.value += window.btoa(this.form.name);
                licenseKey.value += ":";
                licenseKey.value += window.btoa(this.form.company_id?.id ?? "");
                licenseKey.value += ":";
                licenseKey.value += window.btoa(
                    state.company_id?.companyName ?? ""
                );
                let hashed = this.hashCode(licenseKey.value);
                licenseKey.value += ":";
                licenseKey.value += hashed;
                showModal()
                let fileName = `${state.company_id?.companyName ?? ""}-${
                    state.name
                }.lic`;
                let blob = new Blob([licenseKey.value], {
                    type: "text/plain",
                });
                let url = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        };

        useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />

    <div class="card no-header mt-4">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <h5>{{ $t("Name:") }}</h5>
            <p>{{ state.name }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Company:") }}</h5>
            <p>{{ state.company_id }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Tenant:") }}</h5>
            <p>{{ state.tenant_id }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Usage Statistics:") }}</h5>
            <p>{{ state.usageStatistics }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <h3 class="card-title">{{ $t("Products") }}</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive my-2">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("ARTICLE NUMBER") }}</th>
                <th>{{ $t("PRODUCT NAME") }}</th>
                <th>{{ $t("QUANTITY") }}</th>
                <th>{{ $t("PRODUCT PRICE") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="productTableData.length === 0">
                <td>{{ $t("No Records Added") }}</td>
              </tr>
              <tr
                v-else
                v-for="(tableData, index) in productTableData"
                :key="index"
              >
                <td>{{ tableData.articleNumber }}</td>
                <td>{{ tableData.name }}</td>
                <td>
                  <elements-input
                    v-model="tableData.quantity"
                    type="number"
                    :disabled="true"
                  />
                </td>
                <td>
                  {{ Number(tableData.quantity) * Number(tableData.salePrice) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div
        class="card-header d-flex align-items-center justify-content-between"
      >
        <h3 class="card-title">{{ $t("Usage Statistics") }}</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive my-2">
          <table class="doc-table table">
            <thead>
              <tr>
                <th>{{ $t("EVENT NAME") }}</th>
                <th>{{ $t("VALUE") }}</th>
                <th>{{ $t("NEXT RESET") }}</th>
                <th>{{ $t("LAST RESET") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usageStatisticsTableData.length === 0">
                <td>{{ $t("No Records Added") }}</td>
              </tr>
              <tr
                v-else
                v-for="(tableData, index) in usageStatisticsTableData"
                :key="index"
              >
                <!-- <td>{{ tableData.articleNumber }}</td>
              <td>{{ tableData.name }}</td>
              <td>{{ tableData.quantity }}</td>
              <td>{{ tableData.quantity * tableData.salePrice }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="mt-4 d-flex align-items-center justify-content-between">
      <button
        @click="showModal"
        class="px-3 py-2 mx-1 docsHeroColorBlue rounded"
      >
        {{ $t("Show License Key") }}
      </button>

      <submittal-button
        @click="generateNewLicense()"
        :isLoading="isLoading"
        :buttonName="$t('Generate New License')"
      />
    </div>

    <key-modal
        v-if="isModalOpen && licenseKey"
      :showModal="isModalOpen"
      :hideModal="hideModal"
      :licenseKey="licenseKey"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import commonCode from "~/composables/common";
import { getSaleOfferRequest, getSaleOfferConfirmationRequest } from "~/utils/apiRequests";

const { router, Toast } = commonCode();
const { t } = useI18n();

const props = defineProps([
  "offerConfirmation"
]);

const id = router.params.id;

const state = reactive({
  offerNumber: "",
  paymentTerm: "",
  receiverType: "",
  projectId: "",
  offerType: "",
});

const componentSummery = ref([]);
const componentSummeryTotal = {
  netto: null,
  tax: null,
  total: null,
};

const calculateSummery = (tableData: any, componentName?: string) => {
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

  componentSummery.value.push({
    componentName: componentName,
    netto: (Math.round(netto * 100) / 100).toFixed(2),
    tax: finalTax, // tax array
    total: (Math.round((netto + percentageTotal) * 100) / 100).toFixed(2),
  });
};

// For edit case fetch the record
onMounted(async function () {
  try {
    if (!id) {
      return;
    }
    const res =  props.offerConfirmation ? await getSaleOfferConfirmationRequest(id) : await getSaleOfferRequest(id);
    const {
      offerNumber,
      paymentTerm,
      receiverType,
      projectId,
      offerType,
      productComponents,
    } = res.data;

    state.offerNumber = offerNumber;
    state.paymentTerm = paymentTerm;
    state.receiverType = receiverType;
    state.projectId = projectId;
    state.offerType = offerType;

    const componentList = Object.keys(productComponents); // ['licance', maintenance', 'service', ...],

    componentList.map((singleComp: any) => {
      calculateSummery(productComponents[singleComp], singleComp); /// passing singleComp array e.g licance array
    });

    (function () {
      let netto = null;
      let tax = null;
      let total = null;
      componentSummery.value.map((compSummary: any) => {
        netto = netto + Number(compSummary.netto);
        let taxSingle = 0;
        compSummary.tax.map((singleTax) => {
          taxSingle =
            taxSingle + (Number(singleTax) / 100) * Number(compSummary.netto);
        });
        tax = tax + taxSingle;
        total = total + Number(compSummary.total);
      });
      componentSummeryTotal.netto = netto;
      componentSummeryTotal.tax = tax;
      componentSummeryTotal.total = total;
    })();
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>

    <div class="card no-header mt-4">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-3">
            <h5>{{ offerConfirmation ? $t("Order Confirmation  Number:") : $t("Offer Number:") }}</h5>
            <p>{{ state.offerNumber }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Terms:") }}</h5>
            <p>{{ state.paymentTerm }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Receiver Type:") }}</h5>
            <p>{{ state.receiverType }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Project:") }}</h5>
            <p>{{ state.projectId }}</p>
          </div>

          <div class="col-lg-3">
            <h5>{{ $t("Offer Type:") }}</h5>
            <p>{{ state.offerType ? "budget" : "offer" }}</p>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="doc-table table">
          <thead>
            <tr>
              <th>{{ $t("COMPONENT") }}</th>
              <th>{{ $t("NETTO") }}</th>
              <th>{{ $t("TAX") }}</th>
              <th>{{ $t("TOTAL") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(summary, index) in componentSummery" :key="index">
              <td>{{ summary.componentName }}</td>
              <td>{{ summary.netto }}</td>
              <td>
                <div  v-for="(summaryTax, indexTax) in summary.tax" :key="indexTax">
                  MwSt. {{ summaryTax }} % :
                  {{ (summaryTax / 100) * summary.netto }}
                </div>
              </td>
              <td>{{ summary?.total }}</td>
            </tr>
            <tr>
              <td>
                <h4>Total:</h4>
              </td>
              <td>
                {{ componentSummeryTotal.netto }}
              </td>
              <td>
                {{ componentSummeryTotal.tax }}
              </td>
              <td>
                {{ componentSummeryTotal.total }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

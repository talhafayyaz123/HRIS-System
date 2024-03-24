<script setup lang="ts">
import { ref, reactive, computed, provide } from "vue";
import ProductTypeCard from "./components/ProductTypeCard.vue";
import ProductSetup from "./components/ProductSetup.vue";

import SoftwareImage from "@/assets/images/Software.svg";
import ServiceImage from "@/assets/images/Illustrations.svg";
import PauschalImage from "@/assets/images/Pauschal.svg";
import HostingImage from "@/assets/images/Hosting.svg";
import AmsImage from "@/assets/images/AMS.svg";
import CloudImage from "@/assets/images/CloudSoftware.svg";

useHead({
  title: `Create Product`,
});
const title = "Products Created";
const items = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Products",
    to: "/products",
  },
  {
    text: "Create",
    active: true,
  },
];

const showProductType = ref(true);
function setShowProductType() {
  showProductType.value = false;
}
</script>

<template>
  <div>
    <page-header :title="title" :items="items" />
    <div class="product-type" v-if="showProductType">
      <div class="d-flex align-items-center">
        <h2 class="me-2">{{ $t("Choose Product Type") }}</h2>
        <elements-tooltip />
      </div>
      <div class="row mt-3">
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="SoftwareImage" title="Software" tooltip="Select Product Software"
            description="Software products are digital applications or programs that run on computers or other devices and provide specific functions or services, such as ELO or Microsoft Office." />
        </div>
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="ServiceImage" title="Services" tooltip="Select Product Service"
            description="Services are specialized support services that companies receive when planning, implementing and maintaining their IT infrastructure and applications, such as consulting services to optimize business processes." />
        </div>
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="PauschalImage" title="Pauschal" tooltip="Select Product Pauschal"
            description="Flat rate IT offerings are products or services where customers pay a fixed fee to access a specific set of resources or features." />
        </div>
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="HostingImage" title="Hosting" tooltip="Select Product Hosting"
            description=" Hosting services enable companies to store and deploy their applications on our servers, for example in the form of VMs or dedicated servers." />
        </div>
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="AmsImage" title="AMS" tooltip="Select AMS Card"
            description="Application Management Support is a manufacturer service that ensures the continuous monitoring, updating and maintenance of applications to ensure their smooth operation, such as maintenance and troubleshooting in the product." />
        </div>
        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="CloudImage" title="Cloud Software" tooltip="Select Cloud Software Card"
            description="Cloud products offer scalable IT resources and services over the Internet, such as HeroDocGen or ELO in the cloud." />
        </div>

        <div class="col-lg-4 mb-3">
          <product-type-card @setShowProductType="setShowProductType" :image="CloudImage" title="Traveling" tooltip="Select Traveling Card" description="A lump sum is a single payment of money, as opposed to a series
                of payments made over time (such as an annuity). It is a long
                established fact that a reader will be distracted by the
                readable content of a page when looking at its layout." />
        </div>
      </div>
    </div>
    <div v-else>
      <product-setup />
    </div>
  </div>
</template>

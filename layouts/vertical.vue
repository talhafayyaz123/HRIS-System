<script lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref, onMounted , onUpdated } from "vue";
import genericFunctionality from "~/composables/genericFunctionality";


export default defineComponent({
  name: "vertical",
  setup() {
    const store = useLayoutStore();
    const isMenuCondensed = ref(false);
    const {
      isLoading,
    } = genericFunctionality();

    onMounted(function () {
      document.body.removeAttribute("data-layout-mode");
      document.body.removeAttribute("data-sidebar-showuser");
    });

    onUpdated(function () {
      if (isLoading.value === true) {
        document.body.classList.add('hidebgUnion');
      } else {
        document.body.classList.remove('hidebgUnion');
      }
    });

    return {
      store,
      isMenuCondensed,
    };
  },

});
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper" :class="{ 'dark-mode': false }">
    <sidebar :type="store.leftSidebarType" :width="store.layoutWidth" :size="store.leftSidebarSize"
      :menu="store.menuPosition" :topbar="store.topbar" />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
      <img src="@/assets/images/union-bg.svg" alt="watermark" class="union-bg">
      <ElementsIcon v-bind:icon="'productbgIcon'" class="product-bg" />
      <div class="content">
        <topbar />
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

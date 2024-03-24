<script lang="ts">
import { useLayoutStore } from "@/store/layout";
import { onMounted } from "vue";

export default {
  name: "horizontal",
  setup() {
    const store = useLayoutStore();

    onMounted(function () {
      document.body.setAttribute("data-layout-mode", "horizontal");
    });

    function toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    }
    function hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    }
    return {
      store,
    };
  },
};
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper">
    <Topbar />
    <HorizontalNavbar
      :type="store.topbar"
      :width="store.layoutWidth"
      :menu="store.menuPosition"
    />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->
    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <NuxtPage />
        </div>
      </div>
      <!-- content -->
      <Footer />
    </div>
    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->
    <Rightbar />
  </div>
</template>

<script lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref, onMounted } from "vue";

export default {
  name: "Two-column",
  setup() {
    const store = useLayoutStore();
    const isMenuCondensed = ref(false);

    function toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    }
    function hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    }

    // TODO : not using this function but when used, convert it into composition API
    // function toggleMenu() {
    //     this.isMenuCondensed = !this.isMenuCondensed;
    //     if (this.isMenuCondensed)
    //         document.body.setAttribute("data-sidebar-size", "condensed");
    //     else document.body.removeAttribute("data-sidebar-size", "condensed");

    //     if (window.screen.width >= 992) {
    //         this.$router.afterEach((routeTo, routeFrom) => {
    //             document.body.classList.remove("sidebar-enable");
    //         });
    //     } else {
    //         document.body.setAttribute("data-sidebar-size", "default");
    //         document.body.classList.toggle("sidebar-enable");
    //         this.$router.afterEach((routeTo, routeFrom) => {
    //             document.body.classList.remove("sidebar-enable");
    //         });
    //     }
    // },

    onMounted(function () {
      document.body.setAttribute("data-layout-mode", "two-column");
      document.body.setAttribute("data-topbar-color", "light");
      document.body.removeAttribute("data-sidebar-showuser");
    });

    return {
      store,
      isMenuCondensed,
    };
  },
};
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper">
    <Topbar />
    <TwoColumnSidebar />
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
      <div class="content">
        <!-- Start Content-->
        <div class="container-fluid">
          <NuxtPage />
        </div>
      </div>
      <Footer />
    </div>
    <Rightbar />
  </div>
</template>

<script>
import { Menu } from "./menu";
import emitter from "~/utils/eventBus"
/**
 * Sidebar component
 */
export default {

  data() {
    return {
      menuItems: Menu,
      isSidebarCondensed: false,
      searchQuery: "",
    };
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    menu: {
      type: String,
      required: true,
    },
    topbar: {
      type: String,
      required: true,
    },
  },
  // computed: mapState(["layout"]),
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-sidebar-color", "dark");
              break;
            case "light":
              document.body.setAttribute("data-sidebar-color", "light");
              break;
            case "brand":
              document.body.setAttribute("data-sidebar-color", "brand");
              break;
            case "gradient":
              document.body.setAttribute("data-sidebar-color", "gradient");
              break;
            default:
              document.body.setAttribute("data-sidebar-color", "light");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-width", "boxed");
              document.body.setAttribute("data-sidebar-size", "condensed");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-width", "fluid");
              document.body.removeAttribute("data-sidebar-size");
              document.body.removeAttribute("data-layout-width");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
    size: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "default":
              document.body.setAttribute("data-sidebar-size", "default");
              break;
            case "condensed":
              document.body.setAttribute("data-sidebar-size", "condensed");
              break;
            case "compact":
              document.body.setAttribute("data-sidebar-size", "compact");
              break;
            default:
              document.body.setAttribute("data-sidebar-size", "default");
              break;
          }
        }
      },
    },
    menu: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "fixed":
              document.body.setAttribute("data-layout-menu-position", "fixed");
              break;
            case "scrollable":
              document.body.setAttribute(
                "data-layout-menu-position",
                "scrollable"
              );
              break;
            default:
              document.body.setAttribute("data-layout-menu-position", "fixed");
              break;
          }
        }
      },
    },
    topbar: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-topbar-color", "dark");
              break;
            case "light":
              document.body.setAttribute("data-topbar-color", "light");
              break;
            default:
              document.body.setAttribute("data-topbar-color", "dark");
              break;
          }
        }
      },
    },
    isSidebarCondensed(newVal) {
      document.body.classList.toggle('sidebar-condensed', newVal);
    }
  },
  mounted: function () {
    this._activateMenuDropdown();
    this.$router.afterEach((routeTo, routeFrom) => {
      this._activateMenuDropdown();
    });
    // Set up an event listener
    emitter.on('searchQueryGlobally', (receivedValue) => {
      // Handle the received value here
      this.searchQuery = receivedValue;
    });
  },

  methods: {
    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false;
    },
    toggleMenu() {
      this.isSidebarCondensed = !this.isSidebarCondensed;
    },

    _activateMenuDropdown() {
      const resetParent = (el) => {
        el.classList.remove("active");
        var parent = el.parentElement;
        if (parent) {
          parent.classList.remove("menuitem-active");
          const parent2 = parent.parentElement;
          if (parent2) {
            const parent3 = parent2.parentElement;
            if (parent3) {
              parent3.classList.remove("show");
              const parent4 = parent3.parentElement;
              if (parent4) {
                parent4.classList.remove("menuitem-active");
              }
            }
          }
        }
      };
      var links = document.getElementsByClassName("side-nav-link-ref");
      var matchingMenuItem = null;
      const paths = [];
      for (let i = 0; i < links.length; i++) {
        // reset menu
        resetParent(links[i]);
      }
      for (var i = 0; i < links.length; i++) {
        paths.push(links[i]["pathname"]);
      }
      var itemIndex = paths.indexOf(window.location.pathname);
      if (itemIndex === -1) {
        const strIndex = window.location.pathname.lastIndexOf("/");
        const item = window.location.pathname.substr(0, strIndex).toString();
        matchingMenuItem = links[paths.indexOf(item)];
      } else {
        matchingMenuItem = links[itemIndex];
      }

      if (matchingMenuItem) {
        matchingMenuItem.classList.add("active");
        var parent = matchingMenuItem.parentElement;

        /**
         * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
         * We should come up with non hard coded approach
         */
        if (parent) {
          parent.classList.add("menuitem-active");
          const parent2 = parent.parentElement;
          if (parent2) {
            const parent3 = parent2.parentElement;
            if (parent3) {
              parent3.classList.add("show");
              const parent4 = parent3.parentElement;
              if (parent4) {
                parent4.classList.add("menuitem-active");
              }
            }
          }
        }
      }
    },
  },
  computed: {
    filteredMenuItems() {
      const query = this.searchQuery.toLowerCase();
      return this.menuItems.filter((item) => {
        if (item.label.toLowerCase().includes(query)) {
          return true;
        }
        if (item.subItems) {
          // Check if any sub-item matches the query
          return item.subItems.some((subItem) =>
            subItem.label.toLowerCase().includes(query)
          );
        }
        return false;
      });
    },
  },

};
</script>

<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div class="left-side-menu">

    <div class="logo-box">
      <nuxt-link to="/" class="logo logo-light text-center">
        <span class="logo-sm">
          <img src="~/assets/images/only-Hero_white.svg" alt />
        </span>
        <span class="logo-lg">
          <!-- <img src="~/assets/images/docsadmin.png" alt /> -->
          <elements-icon v-bind:icon="'logoIcon'" />
        </span>
      </nuxt-link>
    </div>
    <div class="upper_nav" >
      <ul id="side-menu-upper">
        <li class="menuitems">
          <nuxt-link to="/my-tasks"><elements-icon v-bind:icon="`trueIcon`" /><span>{{ $t("My task") }}</span><span
              class="tasks">16</span></nuxt-link>
        </li>
        <li class="menuitems">
          <nuxt-link to="/self-service"><elements-icon v-bind:icon="`selfServiceIcon`" /><span>{{ $t("Self Service")
          }}</span></nuxt-link>
        </li>
        <li class="menuitems">
          <nuxt-link to="/"><elements-icon v-bind:icon="`iternetIcon`" /><span>{{ $t("Intranet") }}</span></nuxt-link>
        </li>
      </ul>
    </div>
    <!-- <simplebar class="h-100 middle-nav" data-simplebar> -->
    <div class="h-100 middle-nav">
      <!--- Sidemenu -->
      <div id="sidebar-menu">
        <!-- Left Menu Start -->

        <ul class="list-unstyled side-menu" id="side-menu">
          <template v-if="filteredMenuItems.length > 0" v-for="item in filteredMenuItems">
            <li class="menu-title" v-if="item.isTitle" :key="item.id">
              {{ $t(item.label) }}
            </li>
            <li class="menu-item" v-if="!item.isTitle && !item.isLayout" :key="item.id" v-show="true"
              :class="{ dropdown: item.isMenuCollapsed }">
              <!--==========================-->
              <nuxt-link v-show="true" :to="item.link" v-if="!hasItems(item)" class="menu-link">
                <div class="d-flex align-items-center">
                  <div class="menu-icon"><elements-icon v-bind:icon="`${item.icon}`" v-if="item.icon" /></div>
                  <span>{{ $t(item.label) }}</span>
                </div>
                <span :class="`badge badge-pill badge-${item.badge.variant} float-right`" v-if="item.badge">{{
                  $t(item.badge.text) }}</span>
              </nuxt-link>
              <!--==========================-->
              <a v-if="hasItems(item)" href="javascript:void(0);"
                @click="item.isMenuCollapsed = !item.isMenuCollapsed" class="menu-link has-arrow">
                <div class="d-flex align-items-center">
                  <div class="menu-icon">
                    <elements-icon v-bind:icon="`${item.icon}`" v-if="item.icon" />
                  </div>
                  <span>{{ $t(item.label) }}</span>
                </div>
                <span class="menu-arrow" v-if="!item.badge">
                  <elements-icon v-bind:icon="'rightArrowIcon'" />
                </span>
                <span :class="`badge badge-pill badge-${item.badge.variant} float-right`" v-if="item.badge">{{
                  $t(item.badge.text) }}</span>
              </a>

              <div class="collapse" :class="{ show: item.isMenuCollapsed }" id="sidebarTasks">
                <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
                  <li class="menu-item" v-for="(subitem, index) of item.subItems" :key="index">
                    <!--==========================-->
                    <nuxt-link v-show="true" :to="subitem.link" v-if="!hasItems(subitem)" class="menu-link">
                      <div class="d-flex align-items-center">
                        <div class="menu-icon">
                          <elements-icon v-bind:icon="`${subitem.icon}`" v-if="subitem.icon" />
                        </div>
                        <span>{{ $t(subitem.label) }}</span>
                      </div>
                    </nuxt-link>
                    <!--==========================-->
                    <a v-if="hasItems(subitem)" class="menu-link has-arrow" @click="
                      subitem.isMenuCollapsed = !subitem.isMenuCollapsed
                      " href="javascript:void(0);">
                      <div class="d-flex align-items-center">
                        <div class="menu-icon">
                          <elements-icon v-bind:icon="`${subitem.icon}`" v-if="subitem.icon" />
                        </div>
                        <span>{{ $t(subitem.label) }}</span>
                      </div>
                      <span class="menu-arrow">
                        <elements-icon v-bind:icon="'rightArrowIcon'" />
                      </span>
                    </a>

                    <div class="collapse" :class="{ show: subitem.isMenuCollapsed }">
                      <ul v-if="hasItems(subitem)" class="sub-sub-menu" aria-expanded="false">
                        <li class="menu-item" v-for="(subSubitem, index) of subitem.subItems" :key="index">
                          <nuxt-link v-show="true" :to="subSubitem.link" class="menu-link">
                            <div class="d-flex align-items-center">
                              <div class="menu-icon">
                                <elements-icon v-bind:icon="`${subSubitem.icon}`" v-if="subSubitem.icon" />
                              </div>
                              <span>{{ $t(subSubitem.label) }}</span>
                            </div>
                          </nuxt-link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </template>
          <template v-else>
              <div>
                  <h6 class="text-center text-white">{{$t('No matching records found.')}}</h6>
              </div>
          </template>
        </ul>
      </div>
      <!-- End Sidebar -->
      <div class="clearfix"></div>
      <!-- </simplebar> -->
    </div>

    <!-- Sidebar -left -->
    <div class="bottom_nav">
      <a class="button-menu-mobile" @click="toggleMenu">
        <img src="~/assets/images/minimmize-icon.svg" alt="">
      </a>
    </div>
  </div>
  <!-- Left Sidebar End -->
</template>

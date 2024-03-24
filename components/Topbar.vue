<script>
/**
 * Topbar component
 */
import moment from "moment";
import { authService } from "~/helpers/authbackend/auth.service";
import useDebouncedRef from "~/composables/useDebouncedRef";
import emitter from "~/utils/eventBus"
export default {
  data() {
    return {

      isSidebarCondensed: false,
      current_language: this.$i18n.locale,
      text: null,
      flag: null,
      value: null,
      isDarkMode: false,
      showSetting: false,
      searchQueryGlobally: useDebouncedRef('', 800),
    };
  },
  watch: {
    isSidebarCondensed(newVal) {
      document.body.classList.toggle('sidebar-condensed', newVal);
    },
      async searchQueryGlobally(val){
          emitter.emit("searchQueryGlobally", val);
      }
  },
  computed: {
    // ...mapGetters("notificationMessages", ["notificationMessages", "count"]),
    reversedItems() {
      // return this.notificationMessages.slice().reverse();
    },
  },
  methods: {
    openForm() {
      // this.$store.commit('notificationMessages/notificationRead')

      const dropdown = document.getElementById("myForm");
      if (!dropdown.style.display || dropdown.style.display === "none")
        dropdown.style.display = "block";
      else dropdown.style.display = "none";
    },
    closeForm() {
      document.getElementById("myForm").style.display = "none";
    },
    toggleSetting() {
      this.showSetting = !this.showSetting;
    },
    closeSetting() {
      this.showSetting = false;
    },

    /**
     * Toggle menu
     */

    toggleMenu() {
      this.isSidebarCondensed = !this.isSidebarCondensed;
    },

    /**
     * Full screen
     */
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    /**
     * Toggle rightbar
     */
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },

    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    },
    /**
     *  clear all notification form list
     */
    clearAll() {
      window.sessionStorage.removeItem("notificationMessages");
      // this.$store.commit("notificationMessages/notificationMessages", null);
      document.getElementById("myForm").style.display = "none";
    },
    /**
     * Horizontal-toggle menu
     */
    horizonalmenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    /**
     * Logout user
     */
    logoutUser() {
      // this.$store.dispatch("auth/logout");
      authService.logout()
      this.$router.push({
        path: "/login",
      });
    },
    formatTimeAgo(timestamp) {
      return moment(timestamp).fromNow();
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },
  },
};
</script>

<template>
  <!-- Topbar Start -->
  <div class="navbar-custom">
    <div class="top-nav">
      <div class="topnav-left">
        <div class="top-mobile-btn">
          <a class="button-menu-mobile waves-effect waves-light" @click="toggleMenu">
            <i class="fas fa-bars"></i>
          </a>
        </div>
        <div class="search">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fe-search"></i>
              </span>
            </div>
            <input type="search" v-model="searchQueryGlobally" class="form-control" placeholder="Find Something" autocomplete="off" />
          </div>
        </div>
      </div>
      <div class="topnav-right">
        <div class="menu-item">
          <a class="nav-link modes" @click="toggleMode">
            <i class="fe-moon" v-if="isDarkMode"></i>
            <i class="fe-sun" v-else></i>
          </a>
        </div>
        <div class="menu-item">
            <locale/>
        </div>
        <div class="menu-item">
          <a class="nav-link" @click="initFullScreen" data-toggle="fullscreen" href="#">
            <elements-icon v-bind:icon="'expandIcon'" />
          </a>
        </div>
        <div class="menu-item"  >
          <a class="nav-link cursor-pointer" @click="toggleSetting">
            <elements-icon v-bind:icon="'settingIcon'" />
          </a>
        </div>
        <div class="profile-item">
          <div class="dropdown show">
            <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
              <div style="margin-left: 0px" class="nav-user mr-0 d-flex align-items-center">
                <span class="pro-user-name">
                  Admin
                </span>
                <img src="~/assets/images/users/avatar-1.jpg" alt="user-image" class="rounded-circle" />
              </div>
            </a>
            <div class="dropdown-menu">
              <nuxt-link class="dropdown-item" :to="'/profile'">
                <i class="me-2 fas fa-address-card"></i>
                <span>{{ $t('My Profile') }}</span>
              </nuxt-link>
              <nuxt-link v-show="true" class="dropdown-item" :to="'/settings/administration/permissions'">
                <i class="me-2 fas fa-key"></i>
                <span>{{ $t("menuitems.permissions.text") }}</span>
              </nuxt-link>
              <nuxt-link v-show="true" class="dropdown-item" :to="'/settings/administration/users'">
                <i class="fe-user me-2"></i>
                <span>{{ $t("menuitems.users.text") }}</span>
              </nuxt-link>
              <nuxt-link v-show="true" class="dropdown-item" :to="'/settings/administration/roles'">
                <i class="fe-shield me-2 "></i>
                <span>{{ $t("menuitems.roles.text") }}</span>
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <a style="color: red" class="dropdown-item" @click="logoutUser" href="javascript: void(0);">
                <i class="fe-log-out me-2"></i>
                <span>{{ $t("navbar.dropdown.name.list.logout") }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix"></div>
    <!-- <page-header @breadEvent="toggleSetting" class="d-none" /> -->
    <div class="global-setting" :class="{ 'show': showSetting }">
      <GlobalSetting @close-setting="closeSetting" />
    </div>
    <div>
      <!-- <button class="open-button" @click="openForm()">
        <i class="fe-bell noti-icon-dev">
          <sup v-show="count > 0" class="badge-dev badge-danger rounded-circle noti-icon-badge">{{ count ?? "" }}</sup>
        </i>
      </button> -->
      <div class="chat-popup" id="myForm">
        <form class="form-container">
          <div class="bg-dark py-2 px-3 border-top-radius">
            <h5 class="text-white">
              <span class="float-right">
                <a href="javascript:void(0)" @click="closeForm()">
                  <i class="fas fa-times fa-1x text-white"></i>
                </a>
              </span>
              <span class="text-white font-17">{{
                $t("navbar.dropdown.notification.text")
              }}</span>
            </h5>
          </div>

          <!-- <div v-if="notificationMessages.length > 0" class="py-2" style="max-height: 300px; overflow-y: auto"> -->
          <div v-if="false" class="py-2" style="max-height: 300px; overflow-y: auto">
            <a v-for="(message, index) in reversedItems" href="javascript:void(0);" class="dropdown-item notify-item"
              :key="index" :title="message?.title">
              <div class="notify-icon float-left mt-2 tick-icon" :class="message.icon === 'success'
                ? 'bg-success'
                : message.icon === 'warning'
                  ? 'bg-warning'
                  : 'bg-danger'
                ">
                <i v-if="message.icon === 'success'" class="mdi mdi-check-all"></i>
                <i v-else-if="message.icon === 'error'" class="fas fa-times mt-2"></i>
                <i v-else-if="message.icon === 'warning'" class="mdi mdi-alert"></i>
              </div>
              <div>
                <h5 class="notify-details mb-0">
                  {{ message.msg ?? "Notification" }}
                </h5>
                <p class="text-dark mb-0 user-msg">
                  <span>{{ truncateText(message?.title, 50) }}</span><br />
                  <small class="text-muted">{{
                    formatTimeAgo(message?.timestamp) ?? ""
                  }}</small>
                </p>
              </div>
            </a>
          </div>
          <div v-else class="py-3">
            <img class="d-block mx-auto " src="~/assets/images/no-notify-icon1.png" alt="Logo" height="190px"
              width="200px" />
            <p class="text-muted text-center">No Notification Yet!</p>
          </div>
          <!-- <a v-if="notificationMessages.length > 0" href="javascript:void(0);" @click="clearAll"
            class="dropdown-item text-center text-primary border-bottom-radius p-2 notify-item notify-all">
            {{ $t('navbar.dropdown.notification.subtext') }}
            <i class="fi-arrow-right"></i>
          </a> -->
        </form>
      </div>
    </div>
  </div>
  <!-- end Topbar -->
</template>
<style scoped>
/* Track */
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  box-shadow: inset 0 0 5px grey;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  box-shadow: inset 0 0 5px grey;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #999;
}

/* Set the width of the scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
</style>

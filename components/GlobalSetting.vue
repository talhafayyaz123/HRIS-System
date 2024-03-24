<template>
  <div class="main-setting">
    <div class="close-overlay" @click="closeGlobalSetting"></div>
    <div class="settings">
      <div class="close-setting" @click="closeGlobalSetting">
        <img src="@/assets/images/global-setting/global-setting.svg" alt="" />
      </div>
      <div class="setting-border"></div>
      <div class="setting-header">
        <img src="@/assets/images/global-setting/globalname.svg" alt="" />
        <div class="search-setting">
          <input type="text" v-model="searchTerm" placeholder="Search" class="form-control" />
        </div>
      </div>
      <div class="setting-border"></div>
      <div class="setting-accordians">
        <img src="@/assets/images/global-setting/Union.svg" class="union-img" alt="" />
        <div class="accordion" id="setting-accordian">

          <div class="setting-expand">
            <div class="switch">
              <div class="switch-label">{{ $t("Expand All") }}</div>
              <input type="checkbox" id="switch" v-model="expandAll" @change="expandAllAccordions" />
              <label for="switch"></label>
            </div>
          </div>
          <div class="row">
            <div v-if="filteredMenus.length > 0" class="col-md-4" v-for="menu in filteredMenus" :key="menu.id">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <div class="accordion-button" type="button" data-bs-toggle="collapse"
                       :data-bs-target="`#${menu.id}`" aria-expanded="true" :aria-controls="menu.id">
                    <div class="d-flex align-items-center">
                      <div class="icon">
                        <ElementsIcon v-bind:icon="menu.icon" />
                      </div>
                      <span>{{ menu.name }}</span>
                    </div>
                    <elements-icon v-bind:icon="'downArowIcon'" class="arrow" />
                  </div>
                </h2>
                <div class="accordion-collapse collapse show">
                  <div class="accordion-body">
                    <ul class="listing">
                      <li :id="menu.id" v-for="child in menu.children" :key="child.subId">
                        <nuxt-link :to="child.subLink">
                          <i class="fas fa-circle"></i>
                          <span>{{ child.name }}</span>
                        </nuxt-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h4 class="text-center text-white">{{$t('No matching records found.')}}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"

const
    { t } = useI18n(),
    menus = [
      {
        id: 'administration',
        icon: 'AdministrationIcon',
        name: t("Administration"),
        children: [
          {
            subId: 'user',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/users",
            name: t("Users")
          },
          {
            subId: 'roles',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/roles",
            name: t("Roles")
          },
          {
            subId: 'permissions',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/permissions",
            name: t("Permissions")
          },
          {
            subId: 'mail-webhooks',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/mail-webhooks",
            name: t("Mail Webhooks")
          },
          {
            subId: 'mail-templates',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/mail-templates",
            name: t("Mail Templates")
          },
          {
            subId: 'api-keys',
            subIcon: 'fas fa-circle',
            subLink: "/settings/administration/api-keys",
            name: t("Api Keys")
          },

        ],
      },
      {
        id: 'system',
        icon: 'GlobalSystemIcon',
        name: t("System"),
        children: [
          {
            subId: 'hosting-system',
            subIcon: 'fas fa-circle',
            subLink: "/settings/system/hosting-system",
            name: t("Hosting System")
          },
          {
            subId: 'database-cloud',
            subIcon: 'fas fa-circle',
            subLink: "/settings/system/database-cloud",
            name: t("Database Cloud")
          },
          {
            subId: 'distributed-filesystem',
            subIcon: 'fas fa-circle',
            subLink: "/settings/system/distributed-filesystem",
            name: t("Distributed Filesystem")
          },
          {
            subId: 'system-cloud',
            subIcon: 'fas fa-circle',
            subLink: "/settings/system/system-cloud",
            name: t("System Cloud")
          },
          {
            subId: 'operating-system',
            subIcon: 'fas fa-circle',
            subLink: "/settings/system/operating-system",
            name: t("Operating System")
          },
        ],
      },
      {
        id: 'personal-management',
        icon: 'GlobalPersonalManagementIcon',
        name: t("Personal Management"),
        children: [
          {
            subId: 'expiry-month',
            subIcon: 'fas fa-circle',
            subLink: "/settings/personal-management/expiry-month",
            name: t("Expiry Month")
          },
          {
            subId: 'form-of-contract',
            subIcon: 'fas fa-circle',
            subLink: "/settings/personal-management/form-of-contract",
            name: t("Form Of Contract")
          },
          {
            subId: 'job-level',
            subIcon: 'fas fa-circle',
            subLink: "/settings/personal-management/job-level",
            name: t("Job Level")
          },
          {
            subId: 'highest-school-degrees',
            subIcon: 'fas fa-circle',
            subLink: "/settings/personal-management/highest-school-degrees",
            name: t("Highest School Degrees")
          },
          {
            subId: 'highest-education-levels',
            subIcon: 'fas fa-circle',
            subLink: "/settings/personal-management/highest-education-levels",
            name: t("Highest Education Levels")
          }
        ],
      },
      {
        id: 'products',
        icon: 'GlobalProductIcon',
        name: t("Products"),
        children: [
          {
            subId: 'groups',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/groups",
            name: t("Groups")
          },
          {
            subId: 'version',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/version",
            name: t("Versions")
          },
          {
            subId: 'categories',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/categories",
            name: t("Categories")
          },
          {
            subId: 'units',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/units",
            name: t("Units")
          },
          {
            subId: 'software',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/software",
            name: t("Software")
          },
          {
            subId: 'payment-period',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/payment-period",
            name: t("Payment Period")
          },
          {
            subId: 'price-list',
            subIcon: 'fas fa-circle',
            subLink: "/settings/products/price-list",
            name: t("Price List")
          },
        ],
      },
      {
        id: 'global-settings',
        icon: 'GlobalSettingIcon',
        name: t("Global Settings"),
        children: [
          {
            subId: 'document-assignment',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/document-assignment",
            name: t("Document Assignment")
          },
          {
            subId: 'mail-template-assignment',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/mail-template-assignment",
            name: t("Mail Template Assignment")
          },
          {
            subId: 'elo-configuration',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/elo-configuration",
            name: t("Elo Configuration")
          },
          {
            subId: 'terms-of-payment',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/terms-of-payment",
            name: t("Terms of Payment")
          },
          {
            subId: 'countries',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/countries",
            name: t("Countries")
          },
          {
            subId: 'affected-groups',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/affected-groups",
            name: t("Affected Groups")
          },
          {
            subId: 'cip-configuration',
            subIcon: 'fas fa-circle',
            subLink: "/settings/global-settings/cip-configuration",
            name: t("CIP Configuration")
          },

        ],
      },
      {
        id: 'sales',
        icon: 'GlobalSaleIcon',
        name: t("Sales"),
        children: [
          {
            subId: 'report-categories',
            subIcon: 'fas fa-circle',
            subLink: "/settings/sales/report-categories",
            name: t("Report Categories")
          },
          {
            subId: 'contact-report-source',
            subIcon: 'fas fa-circle',
            subLink: "/settings/sales/contact-report-source",
            name: t("Contact Report Source")
          },
          {
            subId: 'lead-status',
            subIcon: 'fas fa-circle',
            subLink: "/settings/sales/lead-status",
            name: t("Lead status")
          }, {
            subId: 'default-cover-letter-text',
            subIcon: 'fas fa-circle',
            subLink: "/settings/sales/default-cover-letter-text",
            name: t("Default Cover Letter Text")
          }, {
            subId: 'default-order-confirmation-cover-letter-text',
            subIcon: 'fas fa-circle',
            subLink: "/settings/sales/default-order-confirmation-cover-letter-text",
            name: t("Default Order Confirmation Cover Letter Text")
          }
        ],
      },
      {
        id: 'travel-expense',
        icon: 'GlobaltravelIcon',
        name: t("Travel Expense"),
        children: [
          {
            subId: 'request-type',
            subIcon: 'fas fa-circle',
            subLink: "/settings/travel-expense/request-type",
            name: t("Request Type")
          },
          {
            subId: 'invoice-type',
            subIcon: 'fas fa-circle',
            subLink: "/settings/travel-expense/invoice-type",
            name: t("Invoice Type")
          }
        ],
      },
      {
        id: 'licensing',
        icon: 'GloballicensingIcon',
        name: t("Licensing"),
        children: [
          {
            subId: 'event-name',
            subIcon: 'fas fa-circle',
            subLink: "/settings/licensing/event-name",
            name: t("Event Name")
          },
          {
            subId: 'rules',
            subIcon: 'fas fa-circle',
            subLink: "/settings/licensing/rules",
            name: t("Rules")
          }

        ],
      },
      {
        id: 'customer-portal',
        icon: 'GlobalcustomerPortalIcon',
        name: t("Customer Portal"),
        children: [
          {
            subId: 'customer-portal-news',
            subIcon: 'fas fa-circle',
            subLink: "/settings/news/customer-portal-news",
            name: t("News")
          },
          {
            subId: 'already-know',
            subIcon: 'fas fa-circle',
            subLink: "/",
            name: t("Already Know")
          }

        ],
      },
      {
        id: 'document-service',
        icon: 'GlobaldocumentserviceIcon',
        name: t("Document Service"),
        children: [
          {
            subId: 'template-list',
            subIcon: 'fas fa-circle',
            subLink: "/settings/document-service/template-list",
            name: t("Template List")
          },
          {
            subId: 'data-source',
            subIcon: 'fas fa-circle',
            subLink: "",
            name: t("Data Sources")
          },
          {
            subId: 'storage-method',
            subIcon: 'fas fa-circle',
            subLink: "",
            name: t("Storage Method")
          },

        ],
      },
      {
        id: 'project-management',
        icon: 'GlobalserviceIcon',
        name: t("Project Management"),
        children: [
          {
            subId: 'project-status',
            subIcon: 'fas fa-circle',
            subLink: "/settings/project-management/project-status",
            name: t("Project Statuses")
          },
          {
            subId: 'protocol-type',
            subIcon: 'fas fa-circle',
            subLink: "/settings/project-management/protocol-type",
            name: t("Protocol Types")
          },
        ],
      },
      {
        id: 'contract-management',
        icon: 'GlobalserviceIcon',
        name: t("Contract Management"),
        children: [
          {
            subId: 'contract-types',
            subIcon: 'fas fa-circle',
            subLink: "/settings/contract-management/contract-types",
            name: t("Contract Types")
          },
          {
            subId: 'attachments',
            subIcon: 'fas fa-circle',
            subLink: "/settings/contract-management/attachments",
            name: t("Attachments")
          },
        ],
      },
      {
        id: 'finance',
        icon: 'financeIcon',
        name: t("Finance"),
        children: [
          {
            subId: 'invoice-reminders',
            subIcon: 'fas fa-circle',
            subLink: "/settings/finance/invoice-reminders",
            name: t("Reminder Levels")
          },
        ],
      },
      {
        id: 'service',
        icon: 'GlobalserviceIcon',
        name: t("Service"),
        children: [
          {
            subId: 'service-level-agreements',
            subIcon: 'fas fa-circle',
            subLink: "/settings/service/service-level-agreements",
            name: t("Service Level Agreements")
          }
        ],
      },
      {
        id: 'fleet-management',
        icon: 'GlobalfleetManagemntIcon',
        name: t("Fleet Management"),
        children: [
          {
            subId: 'interval-setting',
            subIcon: 'fas fa-circle',
            subLink: "/settings/fleet-management/interval-setting",
            name: t("Notification Settings")
          },
        ],
      },
      {
        id: 'dashboard',
        icon: 'dashboardIcon',
        name: t("Dashboard"),
        children: [
          {
            subId: 'consulting-teams',
            subIcon: 'fas fa-circle',
            subLink: "/settings/dashboard/consulting-teams",
            name: t("Consulting Teams")
          },
        ],
      },

    ],
    searchTerm = ref(''), // The search term entered by the user
    searchResults = ref([]), // Results matching the search term

    expandAll = ref(true),
    // openAccordions = ref([]),

    emit = defineEmits(['close-setting']),

    // toggleAccordion = (menuId) => {
    //     if (openAccordions.value.includes(menuId)) {
    //         openAccordions.value = openAccordions.value.filter((id) => id !== menuId);
    //     } else {
    //         openAccordions.value.push(menuId);
    //     }
    // },
    // isAccordionOpen = (menuId) => {
    //     return openAccordions.value.includes(menuId) || expandAll.value;
    // },

    closeGlobalSetting = () => {
      emit("close-setting");
    },
    expandAllAccordions = () => {
      const accordionItems = document.querySelectorAll(".accordion-item");
      accordionItems.forEach((item) => {
        const collapse = item.querySelector(".accordion-collapse");
        const collapsed = item.querySelector(".accordion-button");
        if (collapse) {
          if (expandAll.value) {
            collapse?.classList.add("show");
            collapsed?.classList.remove("collapsed");
          } else {
            collapse?.classList.remove("show");
            collapsed?.classList.add("collapsed");
          }
        }
      });
    },
    filteredMenus = computed(() => {
      const search = searchTerm.value.toLowerCase();

      return menus.filter((menu: { name: string; children: any[]; }) => {

        // Filter main menus
        if (menu.name.toLowerCase().includes(search)) {
          expandAll.value = true;
          const accordionItems = document.querySelectorAll(".accordion-item");
          accordionItems.forEach((item) => {
            const collapse = item.querySelector(".accordion-collapse");
            const collapsed = item.querySelector(".accordion-button");
            if (collapse) {
              if (expandAll.value) {
                collapse?.classList.add("show");
                collapsed?.classList.remove("collapsed");
              } else {
                collapse?.classList.remove("show");
                collapsed?.classList.add("collapsed");
              }
            }
          });
          return true;
        }
        // Filter child menus
        const matchingChildren = menu.children.filter((child) =>
            child.name.toLowerCase().includes(search)
        );
        return matchingChildren.length > 0;
      });

    })

</script>

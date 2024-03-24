<script setup lang="ts">
import { ref, computed, watch } from "vue";
import commonCode from "~/composables/common";
import genericFunctionality from "~/composables/genericFunctionality";
import { specificGetRequest } from "~/utils/apiRequests";
import { useAdministrationStore } from "~/store/administration";
import { routes } from "~/utils/apiRoutes";
import Treeselect from "@tkmam1x/vue3-treeselect";
import Paginate from "vuejs-paginate-next";
import "@tkmam1x/vue3-treeselect/dist/vue3-treeselect.css";
import { v4 as uuidv4 } from "uuid";

import {
  useTranslatedColumns,
  useTranslatedBreadCrumbs,
  useTitle,
} from "~/composables/useTranslated";

const administration = useAdministrationStore();
const {
    apiRoute,
    currentPerPage,
    currentPage,
    data,
    startPerPage,
    specificListingRequest,
    onSortChange,
    handleSearch,
    destroy,
  } = genericFunctionality(),
  { router, Toast, deleteAlert } = commonCode(),
  { t } = useI18n(),
  perPage = ref(10),
  limitStart = ref(1),
  type = ref(0),
  permissionsTree = ref([]),
  permissions = ref([]),
  groups = ref({}),
  showId = ref(0),
  breadCrumbsConfig = [
    {
      text: "Admin portal",
      to: "/",
    },
    {
      text: "Administration",
      to: "/",
    },
    {
      text: "Roles",
      active: true,
    },
  ],
  columnConfig = [
    {
      label: "Name",
      field: "title",
      sortable: false,
    },
    {
      label: "Permissions",
      field: "permissions",
      sortable: false,
    },
    {
      label: "Actions",
      field: "action",
      sortable: false,
    },
  ],

  { title } = useTitle("Roles"),
  { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
  { columns } = useTranslatedColumns(columnConfig),

  optionalItems = {
    searchBar: false,
    isBtnShow: true,
    btnText: "Create Roles",
    path: "/settings/administration/roles/create",
  },
  showPermissions = (id: number) => {
    const treeselectDom = document.querySelector(`.treeselect-${id}`);

    if (treeselectDom) {
      treeselectDom.style.left = "5rem";
      const input = treeselectDom.querySelector(".vue-treeselect__input");
      if (input) {
        input.placeholder = "Search";
      }
    }

    showId.value = showId.value === id ? 0 : id;
  },
  /**
   * triggers when an options is selected from multiselect
   */
  syncPermissions = async (role: any) => {
    await nextTick();
    try {
      // await this.$store.dispatch("roles/update", {
      //     ...role,
      //     permissions: role.permissions,
      //     can_register: role.can_register === true ? 1 : 0,
      //     active: role.active === true ? 1 : 0,
      // });
    } catch (e) {}
  },
  createBasePermissionGroups = () => {
    const distinctPermissions = new Set();
    const permissionsTree = {};

    permissions.value.forEach((permission) => {
      if (typeof permission?.title === "string") {
        const permissionKey = permission.title.split(".")?.[0];
        const permissionName = permission.title.split(".")?.[1];

        if (distinctPermissions.has(permissionKey)) {
          const permissionNode = permissionsTree[permissionKey];
          permissionNode.children.push({
            id: permission.id,
            label: permissionName,
            grouping: permission.grouping,
            description: permission.description,
          });
        } else {
          distinctPermissions.add(permissionKey);
          permissionsTree[permissionKey] = {
            id: uuidv4(), // You may need to import or generate a unique ID
            label: permission.title.split(".")?.[0],
            grouping: permission.grouping,
            description: permission.description,
          };

          if (permission.title.split(".")?.[0] !== permission.title) {
            permissionsTree[permissionKey].children = [
              {
                id: permission.id,
                label: permissionName,
                grouping: permission.grouping,
                description: permission.description,
              },
            ];
          } else {
            permissionsTree[permissionKey].id = permission.id;
          }
        }
      }
    });

    return permissionsTree;
  },
  createGroupsBasedOnGrouping = (permissionsTree) => {
    Object.values(permissionsTree).forEach((permission) => {
      if (!permission.grouping) {
        groups.value[permission.label] = permission;
      } else {
        if (!groups.value[permission.grouping]) {
          groups.value[permission.grouping] = [permission];
        } else {
          groups.value[permission.grouping].push(permission);
        }
      }
    });
  },
  createSectionedGroups = () => {
    let sectionedGroups = [];

    for (let group in groups.value) {
      let keys = group.split("/");
      let parent = null;

      keys.forEach((key, index) => {
        if (index === 0) {
          let foundGroup = sectionedGroups.find(
            (improvedGroup) => improvedGroup.label === key
          );
          if (!foundGroup) {
            if (groups.value[group] instanceof Array) {
              sectionedGroups.push({
                id: uuidv4(), // You may need to import or generate a unique ID
                label: key,
                children: [],
              });
            } else {
              sectionedGroups.push(groups.value[group]);
            }
          }
          parent = sectionedGroups.find(
            (improvedGroup) => improvedGroup.label === key
          );
        } else {
          let foundGroup = parent.children.find((child) => child.label === key);
          if (!foundGroup) {
            parent.children.push({
              id: uuidv4(), // You may need to import or generate a unique ID
              label: key,
              children: [],
            });
          }
          parent = parent.children.find((child) => child.label === key);
        }
      });

      if (groups.value[group] instanceof Array) {
        parent.children = [...parent.children, ...groups.value[group]];
      }
    }

    permissionsTree.value = [...sectionedGroups];
  },

  basePermissionGroups = computed(() => createBasePermissionGroups()),

  callBackFunc = (param: number) => {
      currentPage.value = param
      if(!!currentPage.value && currentPage.value > 1)
          limitStart.value = (currentPage.value - 1) * perPage.value;
      else
          limitStart.value = 1

    specificListingRequest({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    });
  },
  refresh = () => {
    specificListingRequest({
      limit_start: limitStart.value,
      limit_count: perPage.value,
      type: type.value,
    });
  };

// define api url of this crud that's we define in apiRoutes file.
apiRoute.value = routes.LIST_ROLES;
// after page load call this function
refresh();

useHead({
  title: title,
});


watch(
  () => data.value,
  () => {
    permissions.value = data.value.data;
    permissionsTree.value = [];
    if (!!data.value.data) {
      const permissionsTree = createBasePermissionGroups();
      createGroupsBasedOnGrouping(permissionsTree);
      createSectionedGroups();
    }
  }
);

const pageCount = computed(() => {
  const totalRecord = data.value?.count;
  return Math.round(totalRecord / perPage.value);
});
</script>

<template>
  <div>
    <page-header
      :title="title"
      :items="items"
      :optionalItems="optionalItems"
      @watchEvent="handleSearch"
    />
    <Table
      class="doc-table"
      :key="data?.data?.length"
      :columns="columns"
      :not-serial-able="true"
      :remove-serial-able="true"
      :isCustomBody="true"
    >
      <tr v-if="data?.data?.length > 0" v-for="(row, index) in data?.data" :key="row.id">
        <td
          v-for="col in columns"
          :key="col.field"
          v-show="col.field !== 'action'"
        >
          <span v-if="col.field === 'permissions'">
            <button
              class="permission-listing-btn"
              :id="'permission-button-' + row.id"
              @click="showPermissions(row.id)"
            >
              <span>{{ row.id == showId ? "Hide" : "Show" }} Permissions </span>
            </button>
            <div class="permission-tree">
              <treeselect
                :class="row.id == showId ? '' : 'd-none'"
                :ref="`treeselect-${row.id}`"
                :clearable="false"
                @update:modelValue="syncPermissions(row)"
                v-model="row.permissions"
                :multiple="true"
                :options="permissionsTree"
                :placeholder="$t('Search')"
                :alwaysOpen="true"
                :valueConsistsOf="'LEAF_PRIORITY'"
              >
                <template #option-label="props">
                  <p :title="props?.node?.raw?.description ?? ''">
                    {{ props?.node?.raw?.label ?? "" }}
                  </p>
                </template>
              </treeselect>
            </div>
          </span>
          <span v-else>
            {{ row[col.field] }}
          </span>
        </td>
        <td style="width: 130px">
          <ul class="list-inline table-action m-0">
            <li class="list-inline-item ms-1">
              <NuxtLink :title="'Edit'" :to="'/settings/administration/roles/edit-' + row.id">
                <ElementsIcon v-bind:icon="'editIcon'" />
              </NuxtLink>
            </li>
            <li class="list-inline-item ml-1" @click="destroy(row.id)">
              <ElementsIcon v-bind:icon="'deleteIcon'" />
            </li>
          </ul>
        </td>
        <td></td>
      </tr>
      <tr v-else>
        <td :colspan="columns?.length" class="text-sm text-center">
          {{ $t("No Records Added") }}
        </td>
      </tr>
    </Table>
  </div>
  <div
    v-if="data?.count > 0"
    class="mt-3 d-flex align-items-center justify-content-center"
  >
    <div class="page-count mx-3">
      <p><span>Page {{currentPage}} </span> out of {{ pageCount }}</p>
    </div>
    <paginate
      :page-count="pageCount"
      :container-class="'pagination'"
      :prev-text="'<'"
      :next-text="'>'"
      :click-handler="callBackFunc"
    >
    </paginate>
  </div>
</template>

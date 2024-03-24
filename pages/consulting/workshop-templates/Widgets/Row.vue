<template>
  <div :class="[ 'position-relative', showPreview ? '' : 'py-2', ]">
    <!-- 
            on mouseenter we show the toolbar around the row
            similarly we remove the toolbar on mouseleave
         -->
    <div :id="'row-' + id" @mouseenter="addToolbar" @mouseleave="removeToolbar" @click.stop="selectRow"
      :style="{ ...inlineCSS }" :class="[
        'row template-row', showToolbar ? 'toolbar-row' : '',
        selectedWidget?.id == id && selectedWidgetType == 'row'
          ? ''
          : '',
      ]">
      <!-- cross icon used to remove a row, shows when showToolbar is set to true -->
      <!-- <font-awesome-icon
                v-if="showToolbar"
                @click.stop="$emit('removeRow', true)"
                class="cursor-pointer cross text-black self-center absolute remove-row-icon"
                icon="fa-solid fa-xmark"
            /> -->
      <div class="trash-row" v-if="showToolbar" @click.stop="$emit('removeRow', true)">
        <ElementsIcon v-bind:icon="'xIcon'" />
      </div>
      <div class="add-row" v-if="showToolbar" @click="addColumn">
        <ElementsIcon v-bind:icon="'addIcon'" />
      </div>
      <div class="move-row" v-if="showToolbar" @click="selectRow">
        <ElementsIcon v-bind:icon="'moveDragIcon'" />
      </div>
      <!-- <i v-if="showToolbar" @click.stop="$emit('removeRow', true)" class="fe-trash">
      </i> -->
      <!-- plus icon used to add a column to the row, shows when showToolbar is set to true -->
      <!-- <i v-if="showToolbar" @click="addColumn" class="fas fa-plus"> </i> -->
      <!-- <font-awesome-icon
                v-if="showToolbar"
                @click="addColumn"
                class="cursor-pointer cross text-black self-center absolute add-column-icon"
                icon="fa-solid fa-plus"
            /> -->
      <!-- hand pointer icon used to select the row, shows when showToolbar is set to true -->
      <!-- <font-awesome-icon
        v-if="showToolbar"
        @click="selectRow"
        class="cursor-pointer cross text-black self-center absolute select-row-icon"
        icon="fa-solid fa-hand-pointer"
      /> -->
      <!-- <i v-if="showToolbar" @click="selectRow" class="fas fa-hand-pointer"> </i> -->
      <draggable :move="checkMove" class="d-flex gap-1 w-100 p-0" v-model="row.columns" handle=".column-handler" group="columns" item-key="id">
        <!-- The column component is the component that will hold all the widgets -->
        <template #item="{ element: column, index }">
          <Column :column="column" :id="column.id">
            <!-- the toolbar slot contains the actions that can be performed on a column widget -->
            <template #toolbar="{ showToolbar, selectColumn }">
              <div v-if="showToolbar" class="toolbar-column d-flex align-items-center justify-content-between">
                <!-- <font-awesome-icon
                  v-if="showToolbar"
                  @click="removeColumn(index)"
                  class="cursor-pointer cross text-black self-center mr-2"
                  icon="fa-solid fa-xmark"
                /> -->
                <elements-icon v-bind:icon="'xIcon'" v-if="showToolbar" @click="removeColumn(index)"/>
                <!-- <i v-if="showToolbar" @click="removeColumn(index)" class="fe-trash">
                </i> -->
                <!-- <font-awesome-icon
                  @click="selectColumn"
                  class="cursor-pointer cross text-black self-center column-handler"
                  icon="fa-solid fa-hand-pointer"
                /> -->
                <i @click="selectColumn" class="fas fa-hand-pointer"> </i>
              </div>
            </template>
          </Column>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import mainMixin from "../Mixins/mainMixin";
import toolbarMixin from "../Mixins/toolbarMixin";
import rowConfigMixin from "../Mixins/rowConfigMixin";
import Column from "./Column.vue";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";
import { workshopTemplateColumnCreateRequest, workshopTemplateColumnDeleteRequest } from "~/utils/apiRequests";

export default {
  name: "Row",
  mixins: [mainMixin, toolbarMixin, rowConfigMixin],
  emits: ["removeRow"],
  props: {
    row: {
      type: Object,
      default: () => ({
        columns: [],
      }),
    },
  },
  mounted() {
    // give equal width to columns if equallySizedColumns is set to true
    this.sizeColumnsEqually(this.row);
  },
  computed: {
    showPreview() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.showPreview;
    },
    // returns an object of different CSS styles with style name as the key and the user provided value as the value for that style
    inlineCSS() {
      const css = {};
      // traverse over the inlineCSS object and add the styles to css object after transforming some styles
      for (let key in this.row.configuration.inlineCSS) {
        // if the style property is a padding or margin then we must add a suffix of 'px' after the value
        if (key.includes("padding") || key.includes("margin")) {
          css[key] = this.row.configuration.inlineCSS[key] + "px";
          continue;
        }
        css[key] = this.row.configuration.inlineCSS[key];
      }
      return css;
    },
  },
  methods: {
    /**
     * sets the selectedWidget to the selected row
     * prevent row selection if showPreview is true
     */
    selectRow() {
      if (!this.showPreview) {
        const workshop = useWorkshopTemplateStore();
        workshop.setSelectedWidget(this.row);
        workshop.setSelectedWidgetType("row");
      }
    },
    async addColumn() {
      try {
        const column = {
          id: this.uuid(),
          type: "column",
          workshopTemplatesRowId: this.row.id,
          widgets: [],
          // Configuration for the column
          configuration: {
            // styles with non concrete/fixed values must be applied using inline CSS styling
            inlineCSS: {
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              width: 300,
            },
            equallySizedColumns: this.row.configuration.equallySizedColumns,
          },
        };
        // call the workshop templates column create API

        workshopTemplateColumnCreateRequest({
          workshopTemplateRowId: this.row.id,
          configuration: column.configuration,
        })
          .then((response) => {
            column.id = response?.data?.id ?? column.id; // sync the column id with the one received from the response
            this.row.columns = [...this.row.columns, { ...column }];
            // give equal width to columns if equallySizedColumns is set to true
            this.sizeColumnsEqually(this.row);
          })
          .catch((error) => {
            Toast.fire({ icon: "error", title: "Something went wrong..!!" });
          });
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * disables drag if the row only has 1 column
     */
    checkMove() {
      return this.row?.columns?.length > 1 && !this.showPreview;
    },
    /**
     * removes the column from the columns array
     * @param {index} index of the column to be removed
     */
    async removeColumn(index) {
      try {
        // if the row only has one column then stop the user from deleting that column
        if (this.row?.columns?.length > 1) {
          // call the column delete API
          workshopTemplateColumnDeleteRequest(this.row.columns[index]?.id)
          const removedColumn = this.row.columns.splice(index, 1); //splice from the array on the index
          // remove the sliced column from the selectedWidget if the deleted column was the selected one
          if (removedColumn?.[0]?.id == this.selectedWidget?.id) {
            workshop.setSelectedWidget(null);
            workshop.setSelectedWidgetType("");
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  components: {
    Column,
  },
};
</script>

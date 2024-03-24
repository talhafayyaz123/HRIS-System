<template>
  <div>
    <div class="toolbar my-2 rounded">
      <!-- 
                if the showPreview state is set to true then prevent widget icon drag
             -->
      <div
        v-for="widget in widgets"
        :key="'widget-' + widget.id"
        @dragstart="onDragstart($event, widget.type)"
        @dragend="onDragend"
        :draggable="!showPreview"
        class="widget rounded"
      >
        <font-awesome-icon
          class="cursor-pointer cross text-black self-center mr-2 widget-icon"
          :icon="['fa-solid', widget.icon]"
        />
        <p>{{ $t(widget.title) }}</p>
      </div>
    </div>
    <!-- the RemoveWidgetButton component is teleported in the div below -->
    <div id="remove-widget-button"></div>
    <!-- 
            the checkbox below toggles the showPreview state in workshopTemplates
            when showPreview is set to true, then we prevent the user from performing any action in the template editor
            showPreview allows the user to see the created layout as it would appear on the view page for workshop templates
         -->
    <div class="flex">
      <input
        class="self-center mr-1"
        @input="toggleShowPreview"
        type="checkbox"
        name="show-preview"
        id="show-preview"
        :checked="showPreview"
      />
      <label for="show-preview" class="self-center">Show Preview</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";
import { v4 as uuid } from "uuid";

const workshop = useWorkshopTemplateStore();
const widgets = ref([
  {
    id: uuid(),
    type: "heading",
    icon: "fa-heading",
    title: "Heading",
  },
  {
    id: uuid(),
    type: "paragraph",
    icon: "fa-paragraph",
    title: "Paragraph",
  },
  {
    id: uuid(),
    type: "text-input",
    icon: "fa-keyboard",
    title: "Text Input",
  },
  {
    id: uuid(),
    type: "number-input",
    icon: "fa-1",
    title: "Number Input",
  },
  {
    id: uuid(),
    type: "select",
    icon: "fa-chevron-down",
    title: "Select",
  },
  {
    id: uuid(),
    type: "checkbox",
    icon: "fa-square-check",
    title: "Checkbox",
  },
  {
    id: uuid(),
    type: "radio-button",
    icon: "fa-circle-dot",
    title: "Radio Button",
  },
  {
    id: uuid(),
    type: "table",
    icon: "fa-table",
    title: "Table",
  },
  {
    id: uuid(),
    type: "wysiwyg",
    icon: "fa-newspaper",
    title: "WYSIWYG",
  },
]);

const showPreview = computed(function () {
  const workshop = useWorkshopTemplateStore();
  return workshop?.showPreview;
});

function onDragstart(e, type) {
  try {
    workshop.setIsDragging(true);
    e.dataTransfer.setData("text/plain", type);
  } catch (e) {
    console.log(e);
  }
}

function onDragend(event) {
  try {
    workshop.setIsDragging(false);
  } catch (e) {
    console.log(e);
  }
}

function toggleShowPreview(event) {
  workshop.setShowPreview(event.target.checked);
  workshop.setSelectedWidget(null);
  workshop.setSelectedWidgetType("");
}
</script>

<style scoped>
.toolbar {
  min-height: 70px;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  background-color: rgb(241, 241, 241);
  padding: 1rem;
}
.widget {
  background-color: rgba(41, 87, 164, 1);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.widget-icon {
  color: white;
}
</style>

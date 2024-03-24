<template>
  <div>
    <!-- 
            ------------------------------------------------------------------------------------------------------------------------
                                                                    Gear icon
            ------------------------------------------------------------------------------------------------------------------------
            This section holds the code that displays the gear icon which when clicked toggles the configuration card for the selected widget
         -->
    <div
      :style="`right: ${
        configurationToggle ? '21' : '1'
      }%; top: 50%; background: #ed7d31; z-index: 999;`"
      class="fixed card px-3 py-2 bg-white-500 rounded shadow-md cursor-pointer"
      @click="configurationToggle = !configurationToggle"
    >
      <i class="fe-settings"></i>
      <!-- <font-awesome-icon color="#2957a4" icon="fa-solid fa-gear" /> -->
    </div>
    <!-- 
            ------------------------------------------------------------------------------------------------------------------------
                                                                    end section
            ------------------------------------------------------------------------------------------------------------------------
         -->

    <!-- 
            ------------------------------------------------------------------------------------------------------------------------
                                                                Configuration card 
            ------------------------------------------------------------------------------------------------------------------------
            The configuration card body toggled when the gear icon is clicked
          -->
    <div
      v-if="configurationToggle"
      class="widget-configuration fixed bg-white rounded shadow-lg border border-blue-100 toggled-card"
      style="z-index: 999"
    >
      <!-- 
                the name of the selectedWidget type
            -->

      <div class="card-header py-1">
        {{ selectedWidget?.type }}
      </div>
      <!-- 
                shows different configuration options for differnet widget types.
                'reloadConfig' is used to reload the latest configuration when the selectedWidget is changed
             -->
      <div v-if="selectedWidget && reloadConfig" class="px-2 pt-2 pb-40">
        <div v-if="selectedWidget?.type === 'card'">
          <TextInput
            @change="labelInputChanged($event, 'card')"
            :modelValue="selectedWidget.configuration.heading"
            type="text"
            :label="$t('Heading')"
            class="pb-2 w-full"
          />
        </div>

        <div
          class="mb-2"
          v-if="!['row', 'column', 'card'].includes(selectedWidget?.type)"
        >
          <TextInput
            @change="labelInputChanged($event, 'widget')"
            type="text"
            :modelValue="selectedWidget.configuration.label"
            :label="$t('Label')"
            class="pb-2 w-full"
          />
        </div>

        <div
          class="mb-2"
          v-if="
            selectedWidget?.type === 'text-input' ||
            selectedWidget?.type === 'number-input'
          "
        >
          <TextInput
            v-model="selectedWidget.configuration.placeholder"
            type="text"
            :label="$t('Placeholder')"
            class="pb-2 w-full"
          />
        </div>

        <div class="mb-2" v-if="showForAllInputWidgets">
          <TextInput
            v-model="selectedWidget.configuration.name"
            type="text"
            :label="$t('Name')"
            class="pb-2 w-full"
          />
          <!-- variable in the config file which will be replaced with the value of the widget -->
          <div class="mb-2">
            <label class="form-label" :for="id"
              ><span v-if="required" style="color: red">*</span>&nbsp;{{
                $t("Config Variable Name")
              }}:</label
            >
            <input
              @change="setConfigVariableName"
              @input="checkConfigVariableName"
              :value="selectedWidget.configuration.configVariableName"
              class="p-2 w-full form-input"
              type="text"
            />
           
          </div>
          <!-- readonly fields which will display the value as a visual aid for the user, indicating the value which will
                        be replaced in the config file for the above added config variable name
                    -->
          <TextInput
            v-model="selectedWidget.configuration.value"
            type="text"
            :label="$t('Value')"
            :isReadonly="true"
            class="pb-2 w-full"
          />
        </div>
        <!-- 
                    when the selected widget is of 'select', we must give the user the ability to add and remove options
                    of the select input, the section below enables us to do that
                 -->
        <div
          class="flex flex-col mb-2"
          v-if="selectedWidget?.type === 'select'"
        >
          <label>{{ $t("Options") }}:</label>
          <div
            v-for="(option, index) in selectedWidget.configuration.options"
            :key="'option-' + index"
            class="flex gap-1 p-2 mb-2 card rounded shadow relative"
          >
            <font-awesome-icon
              @click="removeOption(index)"
              class="cursor-pointer text-black absolute right-2"
              icon="fa-solid fa-xmark"
            />
            <TextInput
              v-model="option.name"
              type="text"
              :label="$t('Name')"
              class="pb-2 w-1/2"
            />
            <TextInput
              v-model="option.value"
              type="text"
              :label="$t('Value')"
              class="pb-2 w-1/2"
            />
          </div>
          <button
            @click="addOption"
            class="py-2 px-3 mt-2 rounded docsHeroColorBlue"
          >
            {{ $t("Add Option") }}
          </button>
        </div>
        <!-- 
                    when the selected widget is of type 'table', we must give the user the ability to add and remove fields that are part of
                    that table, the section below enables us to do that
                 -->
        <div class="flex flex-col mb-2" v-if="selectedWidget?.type === 'table'">
          <label>{{ $t("Fields") }}:</label>
          <div
            v-for="(field, index) in selectedWidget.configuration.fields"
            :key="'field-' + index"
            class="flex gap-1 p-2 mb-2 card rounded shadow relative"
          >
            <font-awesome-icon
              @click="removeField(index)"
              class="cursor-pointer text-black absolute right-2"
              icon="fa-solid fa-xmark"
            />
            <TextInput
              v-model="field.displayName"
              type="text"
              :label="$t('Display Name')"
              class="pb-2 w-1/2"
            />
            <TextInput
              v-model="field.variableName"
              type="text"
              :label="$t('Variable Name')"
              class="pb-2 w-1/2"
            />
          </div>
          <button
            @click="addField"
            class="py-2 px-3 mt-2 rounded docsHeroColorBlue"
          >
            {{ $t("Add Field") }}
          </button>
        </div>

        <!-- 
                    configuration specific to checkbox
                 -->
        <div class="mb-2" v-if="selectedWidget?.type === 'checkbox'">
          <TextInput
            v-model="selectedWidget.configuration.inputGroupName"
            type="text"
            :label="$t('Input Group Name')"
            class="pb-2 w-full"
          />
        </div>

        <!-- 
                    contains all the configurations for a widget related to styling
                -->
        <StylesConfiguration />

        <!-- 
                    column specific configurations
                 -->
        <div class="mb-2" v-if="selectedWidget?.type === 'column'">
          <TextInput
            :isReadonly="selectedWidget.configuration.equallySizedColumns"
            type="number"
            v-model="selectedWidget.configuration.inlineCSS.width"
            min="50"
            :label="$t('Width')"
            class="pb-2 w-full"
          />
        </div>

        <!-- 
                    row specific configurations
                 -->
        <div class="mb-2" v-if="selectedWidget?.type === 'row'">
          <div class="flex justify-between">
            <label for="equal-columns">{{ $t("Equal Columns") }}</label>
            <input
              @input="sizeColumnsEqually(selectedWidget)"
              :checked="selectedWidget.configuration.equallySizedColumns"
              v-model="selectedWidget.configuration.equallySizedColumns"
              type="checkbox"
              id="equal-columns"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 
        ------------------------------------------------------------------------------------------------------------------------
                                                                end section
        ------------------------------------------------------------------------------------------------------------------------
     -->
</template>

<script>
import TextInput from "@/components/TextInput.vue";
import StylesConfiguration from "./StylesConfiguration.vue";
import rowConfigMixin from "../Mixins/rowConfigMixin";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";

export default {
  name: "WidgetConfiguration",
  mixins: [rowConfigMixin],
  computed: {
    selectedWidget() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.selectedWidget;
    },
    inputConfigurations() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.inputConfigurations;
    },
    showForAllInputWidgets() {
      return [
        "text-input",
        "number-input",
        "checkbox",
        "radio-button",
        "select",
      ].includes(this.selectedWidget?.type);
    },
  },
  data() {
    return {
      configurationToggle: false, // toggles the configuration card
      reloadConfig: false, // reload the config after selectedWidget is changed
    };
  },
  watch: {
    // when the selectedWidget is changed, reload (hide and then show after a little delay)
    // the widget configuration to get the configuration related to the selectedWidget
    async selectedWidget() {
      this.reloadConfig = false;
      await this.$nextTick();
      this.reloadConfig = true;
    },
  },
  methods: {
    /**
     * flattens the 'inputConfigurations' object and returns an object containing the inner most object key/value pairs
     */
    flattenObject() {
      let objectArray = Object.values(this.inputConfigurations["widgets"]);
      let flattenedObject = {};
      objectArray.forEach((obj) => {
        flattenedObject = { ...flattenedObject, ...obj };
      });
      return flattenedObject;
    },
    /**
     * checks if the configVariableName being entered already exists in the inputConfigurations state
     * if it exists then sets an error and warns the user
     * else it resets the errors state object
     * @param {event} input event
     */
    checkConfigVariableName(event) {
      this.selectedWidget.configuration.configVariableName = event.target.value;
    },
    /**
     * sets the configVariableName of the selectedWidget to the value entered by the user from the event
     * if an error exists for configVariableName in the errors state, then resets the configVariableName value. The error object is set in 'checkConfigVariableName' method
     * else it sets configVariableName to the value entered by the user
     * @param {event} change event
     */
    setConfigVariableName(event) {
      console.log(Ievent)
        this.selectedWidget.configuration.configVariableName =
          event.target.value;
      
    },
    /**
     * Updated the value of the label or the heading of the selectedWidget on change event
     * if the value is left empty then it adds a default value to the label or the heading (for widgets other than text-input and number-input)
     * @param {event} the change event
     * @param {type} type of widget, possible values are 'widget' and 'card'
     */
    labelInputChanged(event, type) {
      if (
        !event.target.value &&
        !["text-input", "number-input", "table"].includes(
          this.selectedWidget.type
        )
      ) {
        this.selectedWidget["configuration"][
          type === "card" ? "heading" : "label"
        ] = this.selectedWidget.type;
        return;
      }
      this.selectedWidget["configuration"][
        type === "card" ? "heading" : "label"
      ] = event.target.value;
    },
    /**
     * adds a default option to the options array of the selected widget
     */
    addOption() {
      const option = {
        name: "",
        value: "",
      };
      this.selectedWidget.configuration.options = [
        ...this.selectedWidget.configuration.options,
        { ...option },
      ];
    },
    /**
     * removes the option in the given index from the options array of the selected widget
     * @param {index} index of the option to be removed
     */
    removeOption(index) {
      this.selectedWidget.configuration.options.splice(index, 1);
    },
    /**
     * adds a default field to the fields array of the selected widget
     */
    addField() {
      const field = {
        displayName: "",
        variableName: "",
      };
      this.selectedWidget.configuration.fields = [
        ...this.selectedWidget.configuration.fields,
        { ...field },
      ];
    },
    /**
     * removes the field in the given index from the fields array of the selected widget
     * @param {index} index of the field to be removed
     */
    removeField(index) {
      this.selectedWidget.configuration.fields.splice(index, 1);
    },
  },
  components: {
        TextInput,
        StylesConfiguration,
    },
};
</script>

<style scoped>
.widget-configuration {
  width: 20%;
  right: 1%;
  top: 15%;
  z-index: 1;
  max-height: 100vh;
  min-height: 100vh;
  overflow: auto;
}
.toggled-card::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.toggled-card::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.toggled-card::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 5px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  background-color: rgb(242, 242, 242);
  font-weight: bold;
}
</style>

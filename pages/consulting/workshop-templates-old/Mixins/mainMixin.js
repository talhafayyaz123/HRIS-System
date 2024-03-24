import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";
export default {
  components: {
    draggable,
  },
  computed: {
    // returns true if the selected widget type is among the values from the array
    selectedWidget() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.selectedWidget;
    },
    showPreview() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.showPreview;
    },
    selectedWidgetType() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.selectedWidgetType;
    },
    inputConfigurations() {
      const workshop = useWorkshopTemplateStore();
      return workshop?.inputConfigurations;
    },
    showRemoveWidgetButton() {
      return [
        "heading",
        "paragraph",
        "checkbox",
        "number-input",
        "radio-button",
        "table",
        "text-input",
        "select",
        "wysiwyg",
      ].includes(this.selectedWidget?.type);
    },
  },
  methods: {
    uuid() {
      return uuidv4();
    },
  },
  props: {
    // a unique identifier for the component
    id: {
      type: [String, Number], // can be both string and number
      default: uuidv4(),
    },
  },
};

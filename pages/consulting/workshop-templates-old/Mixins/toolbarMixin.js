import { useWorkshopTemplateStore } from "~/store/workshopTemplate";

export default {
    data() {
        return {
            showToolbar: false, //responsible for toggling the action toolbar in/around the row/column
        };
    },
    computed: {
        showPreview() {
            const workshop = useWorkshopTemplateStore();
            return workshop?.showPreview;
          },
    },
    methods: {
        /**
         * sets showToolbar to true
         * showToolbar shows the toolbar in/around the row/column, contains row/column actions
         */
        addToolbar() {
            // if the showPreview state is set to true then prevent toolbar addition
            if (!this.showPreview) {
                this.showToolbar = true;
            }
        },
        /**
         * sets showToolbar to flase
         * showToolbar shows the toolbar in/around the row/column, contains row/column actions
         */
        removeToolbar() {
            this.showToolbar = false;
        },
    },
};

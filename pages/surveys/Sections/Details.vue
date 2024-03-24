<template>
    <h5
        :style="
            'color: ' +
            stylesConfiguration.productDetails?.cardHeaderTextColor +
            '; background-color: ' +
            stylesConfiguration.productDetails?.cardHeaderBgColor
        "
        class="text-gray-900 text-md leading-tight font-medium card-title pb-2 pt-2 text-center"
    >
        {{ $t("Product Details") }}
    </h5>
    <div
        v-if="$route.name === 'SurveysShow'"
        class="p-2"
        v-html="htmlFromText(selectedQuestion?.productDetails)"
    ></div>
    <QuillTextEditor
        v-if="
            typeof selectedQuestion?.productDetails === 'string' &&
            $route.name !== 'SurveysShow'
        "
        class="w-full"
        :selectedQuestion="selectedQuestion"
        :content="selectedQuestion.productDetails"
        @delta="updateSelectedQuestion($event)"
    />
</template>

<script>
// import QuillTextEditor from "../../../Components/QuillTextEditor.vue";
// import Quill from "quill";

export default {
    components: {
        // QuillTextEditor,
    },
    props: ["selectedQuestionParent", "stylesConfigurationParent"],
    emits: ["selectedQuestionParent"],
    watch: {
        selectedQuestionParent(val) {
            this.selectedQuestion = val;
        },
        stylesConfigurationParent(val) {
            this.stylesConfiguration = val;
        },
    },
    methods: {
        htmlFromText(text) {
            try {
                let article = document.createElement("article");
                let quill = new Quill(article, {
                    readOny: true,
                });
                quill.setContents(JSON.parse(text));
                return quill.root.innerHTML;
            } catch (err) {
                return "";
            }
        },
        updateSelectedQuestion(event) {
            this.selectedQuestion.productDetails = event;
            this.$emit("selectedQuestionParent", this.selectedQuestion);
        },
    },
    mounted() {
        this.selectedQuestion = this.selectedQuestionParent;
        this.stylesConfiguration = this.stylesConfigurationParent;
    },
    data() {
        return {
            selectedQuestion: null,
            stylesConfiguration: {},
        };
    },
};
</script>

<style scoped>
div >>> .ql-container {
    word-break: break-all;
}
</style>

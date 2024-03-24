<template>
    <div :class="$attrs.class">
        <label v-if="label" class="form-label" :for="id"
            ><span v-if="required" style="color: red">*</span>&nbsp;{{
                label
            }}:</label
        >
        <QuillEditor
            v-bind="{ ...$attrs }"
            ref="quillEditor"
            @ready="ready"
            @textChange="textChange"
            :content="contentType"
            :contentType="contentType"
            :options="options"
            :style="{ height: '10rem' }"
        />
        <div v-if="error" class="form-error">{{ $t(error) ?? "" }}</div>
    </div>
</template>

<script>
import { Delta, QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import DragAndDropModule from "quill-drag-and-drop-module";
import { v4 as uuid } from "uuid";
import Quill from "quill";
import ImageResize from "@taoqf/quill-image-resize-module";
import QuillMarkdown from "quilljs-markdown";
// import "quilljs-markdown/dist/quilljs-markdown-common-style.css";
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/QuillMarkdown", QuillMarkdown, true);

export default {
    components: {
        QuillEditor,
    },
    inheritAttrs: true,
    data() {
        return {
            options: {
                debug: "info",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // toggled buttons
                        ["blockquote", "code-block"],

                        [{ header: 1 }, { header: 2 }], // custom button values
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }], // superscript/subscript
                        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                        [{ direction: "rtl" }], // text direction

                        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ["link", "image", "video", "formula"], // add's image support
                        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                        [{ font: [] }],
                        [{ align: [] }],

                        ["clean"], // remove formatting button
                    ],
                    dragAndDrop: {
                        draggables: [
                            {
                                content_type_pattern: "^image/",
                                tag: "img",
                                attr: "src",
                            },
                        ],
                        onDrop: function (file) {
                            return DragAndDropModule.utils
                                .getFileDataUrl(file)
                                .then(function (base64_content) {
                                    return base64_content;
                                })
                                .then(function (response_from_do_something) {
                                    return response_from_do_something;
                                })
                                .catch(function (err) {
                                    return false;
                                });
                        },
                        container: document.getElementById(
                            "#drag-and-drop-container"
                        ),
                    },
                    imageResize: {
                        modules: ["Resize", "DisplaySize", "Toolbar"],
                    },
                    QuillMarkdown: {
                        ignoreTags: ["pre", "strikethrough"], // @option - if you need to ignore some tags.

                        tags: {
                            // @option if you need to change for trigger pattern for some tags.
                            // blockquote: {
                            //     pattern: /^(\|){1,6}\s/g,
                            // },
                            // bold: {
                            //     pattern: /^(\|){1,6}\s/g,
                            // },
                            // italic: {
                            //     pattern: /(\_){1}(.+?)(?:\1){1}/g,
                            // },
                        },
                    },
                },
                placeholder: "Type here...",
                readOnly: false,
                theme: "snow",
            },
        };
    },
    props: {
        required: { type: Boolean, required: false },
        id: {
            type: String,
            default() {
                return `quill-text-editor-${uuid()}`;
            },
        },
        type: {
            type: String,
            default: "text",
        },
        isReadonly: {
            type: Boolean,
            default: false,
        },
        error: String,
        label: String,
        content: { type: String, default: "{}" },
        modelValue: String,
        selectedQuestion: Object,
        contentType: {
            type: String,
            default: "delta",
        },
    },
    emits: ["update:modelValue"],
    watch: {
        selectedQuestion() {
            try {
                this.$refs.quillEditor.setContents(
                    this.contentType === "delta"
                        ? new Delta(JSON.parse(this.content))
                        : this.content
                );
            } catch (e) {
                this.$refs.quillEditor.setContents(
                    this.contentType === "delta"
                        ? new Delta(this.conten ?? "{}")
                        : this.content
                );
            }
        },
    },
    methods: {
        textChange({ delta, oldContents, source }) {
            this.$emit(
                "delta",
                this.contentType === "delta"
                    ? JSON.stringify(this.$refs.quillEditor.getContents())
                    : this.$refs.quillEditor.getContents()
            );
        },
        ready() {
            try {
                this.$refs.quillEditor.setContents(
                    this.contentType === "delta"
                        ? new Delta(JSON.parse(this.content))
                        : this.content
                );
            } catch (e) {
                this.$refs.quillEditor.setContents(
                    this.contentType === "delta"
                        ? new Delta(this.conten ?? "{}")
                        : this.content
                );
            }
        },
    },
};
</script>

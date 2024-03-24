<template>
    <!-- <div class="styles-configurator tabs widget-card mt-3 h-auto">
        <div class="relative tab">
            <div class="widget-card-header">
                <input class="tab-checkbox" type="checkbox" id="styles-configuration-accordion" />
                <label class="tab-label styles-configurator-tab-label" for="styles-configuration-accordion">
                    Styles
                </label>
            </div>
            <div class="tab-content widget-card-body p-2 mt-3">
                <div v-if="showForAllWidgetsExceptRowColumnCard">
                    <div class="mb-4">
                        <SelectInput :label="$t('Italicize')" class="w-100"
                            v-model="selectedWidget.configuration.styleClasses.italicize">
                            <option value="font-italic">Yes</option>
                            <option value="not-italic">No</option>
                        </SelectInput>
                    </div>
                    <div class="mb-4">
                        <SelectInput :label="$t('Font Weight')" class="w-100"
                            v-model="selectedWidget.configuration.styleClasses.fontWeight">
                            <option value="font-thin">{{ $t("Thin") }}</option>
                            <option value="font-extralight">
                                {{ $t("Extralight") }}
                            </option>
                            <option value="font-light">{{ $t("Light") }}</option>
                            <option value="font-normal">{{ $t("Normal") }}</option>
                            <option value="font-medium">{{ $t("Medium") }}</option>
                            <option value="font-semibold">
                                {{ $t("Semibold") }}
                            </option>
                            <option value="font-bold">{{ $t("Bold") }}</option>
                            <option value="font-extrabold">
                                {{ $t("Extrabold") }}
                            </option>
                            <option value="font-black">{{ $t("Black") }}</option>
                        </SelectInput>
                    </div>
                    <div class="mb-4">
                        <SelectInput :label="$t('Text Decoration')" class="w-100" v-model="selectedWidget.configuration.styleClasses.textDecoration
                            ">
                            <option value="underline">{{ $t("Undeline") }}</option>
                            <option value="overline">
                                {{ $t("Overline") }}
                            </option>
                            <option value="line-through">
                                {{ $t("Line Through") }}
                            </option>
                            <option value="no-underline">
                                {{ $t("No Underline") }}
                            </option>
                        </SelectInput>
                    </div>
                    <div class="mb-4">
                        <SelectInput :label="$t('Font Size')" class="w-100"
                            v-model="selectedWidget.configuration.styleClasses.fontSize">
                            <option value="text-xs">{{ $t("Xs") }}</option>
                            <option value="text-sm">
                                {{ $t("Sm") }}
                            </option>
                            <option value="text-base">{{ $t("Base") }}</option>
                            <option value="text-lg">{{ $t("Lg") }}</option>
                            <option value="text-xl">{{ $t("XL") }}</option>
                            <option value="text-2xl">{{ $t("2XL") }}</option>
                            <option value="text-3xl">{{ $t("3XL") }}</option>
                            <option value="text-4xl">
                                {{ $t("4XL") }}
                            </option>
                            <option value="text-5xl">{{ $t("5XL") }}</option>
                            <option value="text-6xl">{{ $t("6XL") }}</option>
                            <option value="text-7xl">{{ $t("7XL") }}</option>
                            <option value="text-8xl">{{ $t("8XL") }}</option>
                            <option value="text-9xl">{{ $t("9XL") }}</option>
                        </SelectInput>
                    </div>
                    <div class="mb-4">
                        <label style="color: #000;">{{ $t("Font Color") }}:</label>
                        <input v-model="selectedWidget.configuration.inlineCSS.color" :label="$t('Font Color')"
                            class="w-100" type="color" />
                    </div>
                </div>
                <div v-if="showForAllWidgetsExceptCard">
                    <div class="">
                        <h4 class="mb-3">Padding:</h4>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingTop
                                " type="number" min="0" :label="$t('Top')" />

                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingRight
                                " type="number" min="0" :label="$t('Right')" />
                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS
                                .paddingBottom
                                " type="number" min="0" :label="$t('Bottom')" />
                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingLeft
                                " type="number" min="0" :label="$t('Left')" />
                        </div>
                    </div>

                    <div class="">
                        <h4 class="mb-3">Margin:</h4>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.marginTop
                                " type="number" min="0" :label="$t('Top')" />

                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.marginRight
                                " type="number" min="0" :label="$t('Right')" />

                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.marginBottom
                                " type="number" min="0" :label="$t('Bottom')" />

                        </div>
                        <div class="mb-4">
                            <TextInput v-model="selectedWidget.configuration.inlineCSS.marginLeft
                                " type="number" min="0" :label="$t('Left')" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="accordion widget-accordian" id="accordionExample">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    <span>{{ $t('Styles') }}</span>
                    <elements-icon v-bind:icon="'downArowIcon'"/>
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <div v-if="showForAllWidgetsExceptRowColumnCard">
                        <div class="mb-4">
                            <SelectInput :label="$t('Italicize')" class="w-100"
                                v-model="selectedWidget.configuration.styleClasses.italicize">
                                <option value="font-italic">{{ $t('Yes') }}</option>
                                <option value="not-italic">{{ $t('No') }}</option>
                            </SelectInput>
                        </div>
                        <div class="mb-4">
                            <SelectInput :label="$t('Font Weight')" class="w-100"
                                v-model="selectedWidget.configuration.styleClasses.fontWeight">
                                <option value="font-thin">{{ $t("Thin") }}</option>
                                <option value="font-extralight">
                                    {{ $t("Extralight") }}
                                </option>
                                <option value="font-light">{{ $t("Light") }}</option>
                                <option value="font-normal">{{ $t("Normal") }}</option>
                                <option value="font-medium">{{ $t("Medium") }}</option>
                                <option value="font-semibold">
                                    {{ $t("Semibold") }}
                                </option>
                                <option value="font-bold">{{ $t("Bold") }}</option>
                                <option value="font-extrabold">
                                    {{ $t("Extrabold") }}
                                </option>
                                <option value="font-black">{{ $t("Black") }}</option>
                            </SelectInput>
                        </div>
                        <div class="mb-4">
                            <SelectInput :label="$t('Text Decoration')" class="w-100" v-model="selectedWidget.configuration.styleClasses.textDecoration
                                ">
                                <option value="underline">{{ $t("Undeline") }}</option>
                                <option value="overline">
                                    {{ $t("Overline") }}
                                </option>
                                <option value="line-through">
                                    {{ $t("Line Through") }}
                                </option>
                                <option value="no-underline">
                                    {{ $t("No Underline") }}
                                </option>
                            </SelectInput>
                        </div>
                        <div class="mb-4">
                            <SelectInput :label="$t('Font Size')" class="w-100"
                                v-model="selectedWidget.configuration.styleClasses.fontSize">
                                <option value="text-xs">{{ $t("Xs") }}</option>
                                <option value="text-sm">
                                    {{ $t("Sm") }}
                                </option>
                                <option value="text-base">{{ $t("Base") }}</option>
                                <option value="text-lg">{{ $t("Lg") }}</option>
                                <option value="text-xl">{{ $t("XL") }}</option>
                                <option value="text-2xl">{{ $t("2XL") }}</option>
                                <option value="text-3xl">{{ $t("3XL") }}</option>
                                <option value="text-4xl">
                                    {{ $t("4XL") }}
                                </option>
                                <option value="text-5xl">{{ $t("5XL") }}</option>
                                <option value="text-6xl">{{ $t("6XL") }}</option>
                                <option value="text-7xl">{{ $t("7XL") }}</option>
                                <option value="text-8xl">{{ $t("8XL") }}</option>
                                <option value="text-9xl">{{ $t("9XL") }}</option>
                            </SelectInput>
                        </div>
                        <div class="mb-4 d-flex align-items-center justify-content-between">
                            <label style="color: #fff;">{{ $t("Font Color") }}:</label>
                            <input v-model="selectedWidget.configuration.inlineCSS.color" :label="$t('Font Color')" class=""
                                type="color" style="width: 50px;" />
                        </div>
                    </div>
                    <div v-if="showForAllWidgetsExceptCard">
                        <div class="widget-card widget-padding">
                            <div class="widget-card-header">
                                <h3>Padding</h3>
                            </div>
                            <div class="widget-card-body mt-2">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="mb-4">
                                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingTop
                                                " type="number" min="0" :label="$t('Top')" />
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="mb-4">
                                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingRight
                                                " type="number" min="0" :label="$t('Right')" />
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="mb-4">
                                            <TextInput v-model="selectedWidget.configuration.inlineCSS
                                                .paddingBottom
                                                " type="number" min="0" :label="$t('Bottom')" />
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        
                                        <div class="mb-4">
                                            <TextInput v-model="selectedWidget.configuration.inlineCSS.paddingLeft
                                                " type="number" min="0" :label="$t('Left')" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="widget-card widget-padding">
                            <div class="widget-card-header">
                                <h3>Margin</h3>
                            </div>
                            <div class="widget-card-body mt-2">
                                <div class="row">
                                    <div class="col-3">
                                        <TextInput v-model="selectedWidget.configuration.inlineCSS.marginTop
                                    " type="number" min="0" :label="$t('Top')" />
                                    </div>
                                    <div class="col-3">
                                        <TextInput v-model="selectedWidget.configuration.inlineCSS.marginRight
                                    " type="number" min="0" :label="$t('Right')" />
                                    </div>
                                    <div class="col-3">
                                        <TextInput v-model="selectedWidget.configuration.inlineCSS.marginBottom
                                    " type="number" min="0" :label="$t('Bottom')" />
                                    </div>
                                    <div class="col-3">
                                        <TextInput v-model="selectedWidget.configuration.inlineCSS.marginLeft
                                    " type="number" min="0" :label="$t('Left')" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import { useWorkshopTemplateStore } from "~/store/workshopTemplate";

export default {
    name: "StylesConfiguration",
    components: {
        TextInput,
        SelectInput,
    },
    computed: {
        selectedWidget() {
            const workshop = useWorkshopTemplateStore();
            return workshop?.selectedWidget;
        },
        showForAllWidgetsExceptRowColumnCard() {
            return [
                "heading",
                "paragraph",
                "text-input",
                "number-input",
                "checkbox",
                "radio-button",
                "select",
                "table",
            ].includes(this.selectedWidget?.type);
        },
        showForAllWidgetsExceptCard() {
            return [
                "heading",
                "paragraph",
                "text-input",
                "number-input",
                "checkbox",
                "radio-button",
                "select",
                "table",
                "column",
                "row",
            ].includes(this.selectedWidget?.type);
        },
    },
};
</script>

<style scoped lang="scss">
.styles-configurator-tab-label::after {
    margin-top: 0px !important;
}

// :checked
input:checked {
    +.tab-label {
        &::after {
            transform: rotate(90deg);
            transform-origin: center;
        }
    }

    ~.tab-content {
        display: block;
        max-height: 100vh;
    }
}

input[class="tab-checkbox"] {
    position: absolute;
    opacity: 0;
    z-index: -1;
}
</style>

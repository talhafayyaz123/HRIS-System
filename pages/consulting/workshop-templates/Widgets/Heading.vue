<template>
    <div>
        <!-- 
            the component below renders the remove widget button in the Toolbar component
         -->
        <RemoveWidgetButton :type="widget.type" :id="id" @removeWidget="$emit('removeWidget', true)" />
        <!-- 
            inlineCSS is an object containing different style properties.
            styleClasses an array of predefined tailwind classes 
         -->
        <label
            @click.stop="selectWidget"
            :style="{ ...inlineCSS }"
            :class="[
                'm-1 self-start',
                selectedWidget?.id == id && selectedWidgetType == widget.type
                    ? 'border-2 border-blue-500'
                    : '',
                ...styleClasses,
            ]"
        >
            {{ widget.configuration.label }}
        </label>

    </div>
</template>

<script>
import mainMixin from "../Mixins/mainMixin";
import widgetMixin from "../Mixins/widgetMixin";

export default {
    name: "Heading",
    mixins: [mainMixin, widgetMixin],
};
</script>

<style scoped>
h1 {
    font-size: large;
}
</style>

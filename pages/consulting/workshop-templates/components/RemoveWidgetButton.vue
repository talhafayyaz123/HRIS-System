<template>
    <!-- 
        we use teleport here because teleport allows us to render the button in the Toolbar component
        but we can easily use the widget remove functionality by staying inside the widget
     -->
    <Teleport v-if="showRemoveWidgetButton &&
        selectedWidget?.id === id &&
        selectedWidgetType === type
        " to="#remove-widget-button">
        <button @click.stop="$emit('removeWidget', true)" class="secondary-btn">
            Remove Widget
        </button>
    </Teleport>
</template>

<script>
import mainMixin from "../Mixins/mainMixin";

export default {
    emits: ["removeWidget"],
    mixins: [mainMixin],
    props: ["type"],
};
</script>

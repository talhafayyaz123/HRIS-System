<script lang="ts">
import { useLayoutStore } from "@/store/layout";
import Vertical from "./vertical.vue";
import Horizontal from "./horizontal.vue";
import Detached from "./detached.vue";
import TwoColumn from "./two-column.vue";
import { onMounted } from "vue";


export default {
  middleware: "lang",
  components: {
    Vertical,
    Horizontal,
    Detached,
    TwoColumn,
  },
  setup() {
    const router = useRouter();
    const store = useLayoutStore();

    onMounted(function () {
      // if (route.value.query.layout) {
      //   store.changeLayoutType(route.value.query.layout as string);
      // }
    });
    return {
      store,
    };
  },
};
</script>

<template>
  <div>
    <!-- Begin page -->
    <Vertical v-if="store.layoutType === 'vertical'" :layout="store.layoutType">
      <NuxtPage />
    </Vertical>
    <!-- END layout-wrapper -->

    <Horizontal
      v-if="store.layoutType === 'horizontal'"
      :layout="store.layoutType"
    >
      <slot />
    </Horizontal>

    <Detached v-if="store.layoutType === 'detached'" :layout="store.layoutType">
      <slot />
    </Detached>

    <TwoColumn
      v-if="store.layoutType === 'two-column'"
      :layout="store.layoutType"
    >
      <slot />
    </TwoColumn>
  </div>
</template>

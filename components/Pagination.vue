<template>
    <div v-if="(data?.count > 0 && data?.count > data?.perPage)" class="mt-3 d-flex align-items-center justify-content-center">
        <div class="page-count mx-3">
            <p><span class="mx-2">{{ $t('Page') }} {{data?.currentPage}} </span> {{ $t('out of')}} {{data?.totalPages}}</p>
        </div>
        <paginate
            :page-count="pageCount"
            :container-class="'pagination'"
            :prev-text="'<'"
            :next-text="'>'"
            :click-handler="linkPress"
        >
        </paginate>
    </div>
</template>

<script setup>
import {computed} from "vue";
import Paginate from "vuejs-paginate-next";

const props  = defineProps({

    data: {
        type: Object,
        default: {
            count: 0,
            totalPages: 1,
            currentPage: 1,
            perPage: 10,
        },
    },
});
const pageCount = computed(() => {
    return props.data?.totalPages
})
const emits = defineEmits(["change"]);
function linkPress(pageNumber) {
    emits("change", pageNumber);
}
</script>

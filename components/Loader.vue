<template>
    <div id="loading" v-if="isLoading">
        <!-- <div class="loader-portlet"> -->
            <!-- <div class="spinner-border text-primary m-2" role="status"></div> -->
            
            <img src="@/assets/images/doc.gif" alt="">
        <!-- </div> -->
    </div>
</template>

<script setup>
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
})
</script>
<style type="text/css" lang="scss">
.st0 {
    fill-rule: evenodd;
    clip-rule: evenodd;
    fill: #38414A;
}
#loading{
    display: flex;
    align-items: center;
    justify-content: center;
    opacity:1;
    &::before{
        // opacity: 0;
    }
    svg{
        width: 70px;
        height: 70px;
    }
    img{
        width: 90px;
    }
}
</style>
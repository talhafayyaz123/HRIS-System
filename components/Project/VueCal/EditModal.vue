<template>
    <div>
        <div
            class="relative z-99999"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            ></div>

            <div class="fixed inset-0 z-99999 overflow-y-auto">
                <div
                    class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
                >
                    <div
                        :style="`width: ${width || '50%'}`"
                        class="relative transform rounded-lg bg-white text-left shadow-xl transition-all"
                    >
                        <div>
                            <div class="container mx-auto px-4 sm:px-8">
                                <div class="py-8">
                                    <div class="flex justify-between">
                                        <div>
                                            <h2
                                                class="text-2xl font-semibold leading-tight"
                                            >
                                                {{ title }}
                                            </h2>
                                            <slot name="warning"></slot>
                                        </div>
                                        <font-awesome-icon
                                            class="cursor-pointer"
                                            @click="$emit('toggleModal', false)"
                                            icon="fa-solid fa-xmark"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <slot name="body"></slot>
                        </div>
                        <div
                            class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                        >
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        width: String,
    },
    components: {},
};
</script>

<style scoped>
.z-99999 {
    z-index: 99999;
}
</style>

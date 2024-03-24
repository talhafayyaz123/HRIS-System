<script setup lang="ts">
import {ref} from "vue"
import {routes} from "~/utils/apiRoutes"
import {getApiResponse, MethodType} from "~/utils/axiosFunctions"
import commonCode from "~/composables/common"

const {t} = useI18n()
const {Toast} = commonCode()
const hovered = ref(false)
const editing = ref(false)
const props = defineProps(["questionProp"])
const question = props.questionProp
const emit = defineEmits(["questionUpdated"])


async function updateQuestion() {
  try {
    const url = `${routes.SURVEYS_QUESTION}/${question.id}`
    await getApiResponse(url, true, MethodType.put, {
      title: question.title
    })
    emit("questionUpdated", question)
    editing.value = false
  } catch (error) {
    Toast.fire({icon: "error", title: t("something went wrong!")})
  }
}

</script>

<template>
  <div class="mb-2">
    <div
        class="text-area"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @click="editing = true"
        v-if="!editing"
    >
      {{ question.title }}
    </div>
    <input
        class="edit-input"
        v-if="editing"
        @keyup.enter="updateQuestion"
        v-model="question.title"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import commonCode from "~/composables/common";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import Questions from "../../components/Survey/Questions";
import {routes} from "~/utils/apiRoutes";
import {getApiResponse, MethodType} from "~/utils/axiosFunctions";
import { useTranslatedColumns, useTranslatedBreadCrumbs, useTitle } from "~/composables/useTranslated";


const {router, Toast} = commonCode(),
    {t} = useI18n(),
    state = reactive({
      isLoading: false,
      submitted: false,
      groupName: "",
    }),
    options = [
      {value: 'batman', name: 'Batman'},
      {value: 'robin', name: 'Robin'},
      {value: 'joker', name: 'Joker'},
    ],
    breadCrumbsConfig = [
      {
        text: "Admin portal",
        to: "/",
      },
      {
        text: "surveys",
        to: "/surveys",
      },
      {
        text: "Create",
        active: true,
      },
    ],
    validationRules = {
      groupName: {required},
      name: {required},
    },
    v$ = useVuelidate(validationRules, state),
    { items } = useTranslatedBreadCrumbs(breadCrumbsConfig),
    { title } = useTitle("Surveys Create");
const questions = reactive([]), question = ref('')

async function addQuestion() {
  try {
    const url = `${routes.SURVEYS_QUESTION}`
    const response = await getApiResponse(url, true, MethodType.post, {
      title: question.value
    })

    if (response?.data) {
      questions.push(response.data)
    }

    question.value = ''
  } catch (error) {
    Toast.fire({icon: "error", title: t("something went wrong!")})
  }
}

function questionUpdated(updatedQuestion) {
  const index = questions.findIndex((question => question.id == updatedQuestion.id))
  if (index) {
    questions[index].value = updatedQuestion.value
  }
}
useHead({
  title: title,
});
</script>

<template>
  <div>
    <page-header :title="title" :items="items"/>
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header text-center">
            <h3 class="card-title">{{ $t('Steps')  }}</h3>
          </div>
          <div class="card-body">

            <div v-for="question in questions">
              <Questions @questionUpdated="questionUpdated" :question-prop="question"/>
            </div>

            <div class="form-group">
              <input type="text" class="form-control" v-model="question">
            </div>

            <div class="row mb-3 mt-3">
              <div class="col-12 text-center mb-2">
                <label for="">{{ $t('Enter Title') }}</label>
              </div>
              <div class="col-md-6">
                <input class="me-2" type="radio">
                <label for="">{{ $t('Question') }}</label>
              </div>
              <div class="col-md-6">
                <input class="me-2" type="radio">
                <label for="">{{ $t('Chapter') }}</label>
              </div>
            </div>
            <button @click="addQuestion" class="secondary-btn w-100">{{ $t('Create') }}</button>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card no-header">
          <div class="card-body">
            <p class="text-center">{{ $t('No Question Selected') }}</p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-7">
            <div class="card">
              <div class="card-header text-center">
                <h3 class="card-title">{{ $t('Product Details') }}</h3>
              </div>
              <div class="card-body">

              </div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="card">
              <div class="card-header text-center">
                <h3 class="card-title">{{ $t('Shopping Cart') }}</h3>
              </div>
              <div class="card-body">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

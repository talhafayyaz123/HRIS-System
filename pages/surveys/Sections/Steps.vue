<template>
  <h5
      :style="
            'color: ' +
            stylesConfiguration.steps?.cardHeaderTextColor +
            '; background-color: ' +
            stylesConfiguration.steps?.cardHeaderBgColor
        "
      class="text-gray-900 text-md leading-tight card-title font-medium pb-2 pt-2 text-center"
  >
    {{ $t("Steps") }}
  </h5>
  <draggable
      class="steps-container"
      :disabled="$route.name === 'SurveysShow'"
      :clone="cloneQuestion"
      :list="steps"
      @change="onQuestionChange"
      group="questions"
      item-key="id"
      :style="`${
            minimizeStepsParent
                ? `max-height: ${
                      $route.name === 'SurveysShow' ? '20' : '10'
                  }rem;`
                : ''
        } overflow: auto`"
  >
    <template #item="{ element: step, index: stepIndex }">
      <div
          :id="'step-' + step?.value?.id"
          class="px-3 py-2 cursor-pointer"
      >
        <div
            :class="[
                        'relative',
                        selectedQuestion?.id == step?.value?.id
                            ? 'font-bold'
                            : '',
                    ]"
            v-if="step.type === 'question'"
            @click="
                        selectedQuestion = step.value;
                        $emit('selectedQuestionParent', selectedQuestion);
                    "
        >
          <div class="question" v-if="toEdit !== step.id">
            <p>{{ step.value.title }}</p>
            <ElementsIcon
                v-bind:icon="'editIcon'"
                v-if="$route.name !== 'SurveysShow'"
                @click="editQuestion(stepIndex)"
                class="cursor-pointer pencil top-4 hidden"
                icon="fa-solid fa-pencil"
            />
            <ElementsIcon
                v-bind:icon="'deleteIcon'"
                v-if="$route.name !== 'SurveysShow'"
                @click="removeQuestion(stepIndex)"
                class="cursor-pointer cross top-4 hidden"
                icon="fa-solid fa-xmark"
            />
          </div>
          <elements-input
              v-else
              @keypress.enter="updateQuestion(stepIndex)"
              v-model="nameTemp"
              class="edit-input border w-full"
              type="text"
          />
        </div>
        <div class="relative" v-else-if="step.type === 'chapter'">
          <div class="chapter" v-if="toEdit !== step.id">
            <h1 class="title">{{ step.value.title }}</h1>
            <ElementsIcon
                v-bind:icon="'editIcon'"
                v-if="$route.name !== 'SurveysShow'"
                @click="editQuestion(stepIndex)"
                class="cursor-pointer pencil top-4 hidden"
                icon="fa-solid fa-pencil"
            />
            <ElementsIcon
                v-bind:icon="'deleteIcon'"
                v-if="$route.name !== 'SurveysShow'"
                @click="removeQuestion(stepIndex)"
                class="cursor-pointer cross top-4 hidden"
                icon="fa-solid fa-xmark"
            />
          </div>
          <elements-input
              v-else
              @keypress.enter="updateQuestion(stepIndex)"
              v-model="nameTemp"
              class="edit-input border w-full"
              type="text"
          />
          <ul class="chapter">
            <draggable
                class="pt-2"
                :disabled="$route.name === 'SurveysShow'"
                @change="
                                onChapterQuestionChange($event, step, stepIndex)
                            "
                :clone="cloneChapterQuestion"
                :list="step.value.questions ?? []"
                group="questions"
                item-key="id"
            >
              <template
                  #item="{
                                    element: question,
                                    index: questionIndex,
                                }"
              >
                <li
                    @click="
                                        selectedQuestion = question.value;
                                        $emit(
                                            'selectedQuestionParent',
                                            selectedQuestion
                                        );
                                    "
                    :class="[
                                        'relative',
                                        selectedQuestion?.id ==
                                        question?.value?.id
                                            ? 'font-bold'
                                            : '',
                                    ]"
                >
                  <div
                      :id="'step-' + question?.value?.id"
                      v-if="toEdit !== question?.value?.id"
                      class="question"
                  >
                                        <span
                                        >{{ question?.value?.title }}
                                        </span>
                    <ElementsIcon
                        v-bind:icon="'editIcon'"
                        v-if="$route.name !== 'SurveysShow'"
                        @click="
                                                editQuestion(
                                                    stepIndex,
                                                    questionIndex
                                                )
                                            "
                        class="cursor-pointer pencil top-4 hidden"
                        icon="fa-solid fa-pencil"
                    />
                    <ElementsIcon
                        v-bind:icon="'deleteIcon'"
                        v-if="$route.name !== 'SurveysShow'"
                        @click="
                                                removeQuestion(
                                                    stepIndex,
                                                    questionIndex
                                                )
                                            "
                        class="cursor-pointer cross top-4 hidden"
                        icon="fa-solid fa-xmark"
                    />
                  </div>
                  <elements-input
                      v-else
                      @keypress.enter="
                                            updateQuestion(
                                                stepIndex,
                                                questionIndex
                                            )
                                        "
                      v-model="nameTemp"
                      class="edit-input border w-full"
                      type="text"
                  />
                </li>
              </template>
            </draggable>
            <li
                v-if="$route.name !== 'SurveysShow'"
                class="question-title-input"
            >
              <elements-input
                  ref="chapterQuestionInput"
                  class="form-input"
                  @keypress.enter="
                                    addQuestionToChapter(step.value, $event)
                                "
                  label=""
                  :placeholder="$t('Enter Question Title')"
                  type="text"
              />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </draggable>
  <p v-if="!steps.length" class="text-center mt-2 text-gray-400">
    {{ $t("No Questions/Chapters") }}
  </p>
  <div v-if="$route.name !== 'SurveysShow'" class="px-2 mt-5">
    <elements-input
        v-model="title"
        label=""
        :placeholder="$t('Enter Title')"
        type="text"
    />
    <div class="grid grid-cols-2 gap-2 mt-2">
      <div>
        <input
            class="self-center"
            @input="selectType('question')"
            name="type"
            id="question"
            type="radio"
            :checked="type === 'question'"
        />
        <label class="ml-1" for="question">{{ $t("Question") }}</label>
      </div>
      <div>
        <input
            class="self-center"
            @input="selectType('chapter')"
            name="type"
            id="chapter"
            type="radio"
            :checked="type === 'chapter'"
        />
        <label class="ml-1" for="chapter"> {{ $t("Chapter") }} </label>
      </div>
    </div>
    <div class="grid grid-cols-1 mt-2">
      <button
          type="button"
          class="docsHeroLayoutColor py-2 inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
          @click="
                    type === 'question' ? createQuestion() : createChapter()
                "
      >
        {{ $t("Create") }}
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {v4 as uuidv4} from "uuid";
import {mapWritableState} from 'pinia'
import {useSurveysStore} from "~/store/surveys";
import {
  surveyMoveQuestionPostRequest,
  surveyQuestionDeleteRequest,
  surveyChapterDeleteRequest,
  surveyChangeQuestionOrderPostRequest,
  surveyChangeChapterOrderPostRequest,
  surveyChapterTemplateWidgetPostRequest,
  surveyQuestionTemplateWidgetPostRequest,
  surveyStyleConfigurationsPostRequest,
  surveyQuestionPutRequest,
  surveyChapterPutRequest
} from "~/utils/apiRequests";

export default {
  props: [
    "minimizeStepsParent",
    "stepsParent",
    "selectedQuestionParent",
    "selectedChapterParent",
    "questionsParent",
    "stylesConfigurationParent",
    "validatorParent",
  ],
  emits: [
    "stepsParent",
    "selectedQuestionParent",
    "selectedChapterParent",
    "questionsParent",
    "stylesConfigurationParent",
    "validatorParent",
  ],
  computed: {
    ...mapWritableState(useSurveysStore, {"surveyId": "id"}),
  },
  mounted() {
    document.body.addEventListener("click", (e) => {
      if (
          this.toEdit &&
          !e.target.classList.contains("edit-input") &&
          !e.target.classList.contains("fa-pencil") &&
          !(e.target.nodeName == "path" || e.target.nodeName == "svg")
      ) {
        this.toEdit = "";
        this.nameTemp = "";
      }
    });
    this.steps = this.stepsParent;
    this.selectedQuestion = this.selectedQuestionParent;
    this.selectedChapter = this.selectedChapterParent;
    this.questions = this.questionsParent;
    this.stylesConfiguration = this.stylesConfigurationParent;
    this.validator = this.validatorParent;
  },
  data() {
    return {
      toEdit: "",
      nameTemp: "",
      steps: [],
      selectedQuestion: null,
      selectedChapter: null,
      questions: [],
      stylesConfiguration: {},
      validator: {},
      title: "",
      type: "question",
    };
  },
  components: {
    draggable,
  },
  watch: {
    stylesConfigurationParent(val) {
      this.stylesConfiguration = val;
    },
    selectedQuestionParent(val) {
      this.selectedQuestion = val;
      this.scrollQuestionIntoView(val?.id);
    },
    questionsParent(val) {
      this.questions = val;
    },
    stepsParent(val) {
      this.steps = val;
    },
  },
  methods: {
    scrollQuestionIntoView(id) {
      this.$nextTick(() => {
        document
            .querySelector(".steps-container")
            ?.querySelector(`#step-${id}`)
            ?.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            });
      });
    },
    async updateQuestion(index, questionIndex) {
      if (this.nameTemp.length) {
        let question = {};
        if (questionIndex !== undefined) {
          this.steps[index].value.questions[
              questionIndex
              ].value.title = this.nameTemp;
          question = this.steps[index].value.questions[questionIndex];
        } else {
          this.steps[index].value.title = this.nameTemp;
          question = this.steps[index].value;
        }
        if (question.value) {
          const questionIndex = this.questions.findIndex(
              (q) => q.id == question?.value?.id
          );
          this.questions[questionIndex] = question.value;
        } else {
          const questionIndex = this.questions.findIndex(
              (q) => q.id == question?.id
          );
          this.questions[questionIndex] = question;
        }
        this.$emit("questionsParent", this.questions);
        this.toEdit = "";
        this.nameTemp = "";
        try {
          // Get the target resource type (questions or chapters)
          const resourceType = questionIndex !== undefined
              ? "questions"
              : this.steps[index].type === "chapter"
                  ? "chapters"
                  : "questions";

          // Define the payload data
          const payload = {
            id: questionIndex !== undefined
                ? this.steps[index].value.questions[questionIndex]?.value?.id
                : this.steps[index].value?.id,
            data: {
              ...(questionIndex !== undefined
                  ? this.steps[index].value.questions[questionIndex]?.value
                  : this.steps[index].value),
              surveyId: this.surveyId,
            },
          };


          // Dispatch the update action with the determined resource type
          if (resourceType === 'questions') {
            await surveyQuestionPutRequest({
              ...payload.data
            }, this.surveyId)
          } else {
            await surveyChapterPutRequest({
              ...payload.data
            }, this.surveyId)
          }

          console.log(this.surveyId, "here");
        } catch (e) {
          console.log(e);
        }
      } else {
        this.toEdit = "";
        this.nameTemp = "";
      }
    },
    editQuestion(index, questionIndex) {
      if (questionIndex !== undefined) {
        this.toEdit =
            this.steps[index].value.questions[questionIndex].value.id;
        this.nameTemp =
            this.steps[index].value.questions[
                questionIndex
                ].value.title;
      } else {
        this.toEdit = this.steps[index].id;
        this.nameTemp = this.steps[index].value.title;
      }
    },
    async onQuestionChange(event) {
      if (event.added) {
        try {
          await surveyMoveQuestionPostRequest({
            questionId: event.added.element.value.id,
            chapterId: null,
          })
        } catch (e) {
        }
      } else if (event.moved) {
        try {
          const {newIndex, element} = event.moved;
          const isQuestionType = element.type === "question";
          const dispatchType = isQuestionType ? "questions" : "chapters";
          const dispatchParams = {
            id: element.value.id,
            lowerOrder: this.getOrder(newIndex - 1),
            upperOrder: this.getOrder(newIndex + 1),
          };

          if (newIndex === 0) {
            dispatchParams.lowerOrder = this.getOrder(newIndex + 1);
          } else if (this.steps[newIndex + 1]) {
            dispatchParams.lowerOrder = this.getOrder(newIndex - 1);
            dispatchParams.upperOrder = this.getOrder(newIndex + 1);
          } else {
            dispatchParams.upperOrder = this.getOrder(newIndex - 1);
          }

          if (dispatchType === 'questions') {
            await surveyChangeQuestionOrderPostRequest({
              dispatchParams
            })
          } else {
            await surveyChangeChapterOrderPostRequest({
              dispatchParams
            })
          }
          if (this.$route.name === "SurveysEdit") {
            this.$emitter.emit("refresh", true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    async onChapterQuestionChange(event, step, index) {
      if (event.added) {
        try {
          await surveyMoveQuestionPostRequest({
            questionId: event.added.element.value.id,
            chapterId: step.value.id,
          })
        } catch (e) {
        }
      } else if (event.moved) {
        try {
          if (event.moved.newIndex === 0) {
            await surveyChangeQuestionOrderPostRequest({
              id: event.moved.element.value.id,
              lowerOrder:
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex + 1
                      ]?.value?.order ??
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex + 1
                      ]?.value?.chapterOrder,
            });
          } else if (this.steps[event.moved.newIndex + 1]) {
            await surveyChangeQuestionOrderPostRequest({
              id: event.moved.element.value.id,
              lowerOrder:
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex - 1
                      ]?.value?.order ??
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex - 1
                      ]?.value?.chapterOrder,
              upperOrder:
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex + 1
                      ]?.value?.order ??
                  this.steps[event.moved.newIndex + 1]?.value
                      ?.chapterOrder,
            });
          } else {
            await surveyChangeQuestionOrderPostRequest({
              id: event.moved.element.value.id,
              upperOrder:
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex - 1
                      ]?.value?.order ??
                  this.steps[index]?.value?.questions[
                  event.moved.newIndex - 1
                      ]?.value?.chapterOrder,
            });
          }
          if (this.$route.name === "SurveysEdit")
            this.$emitter.emit("refresh", true);
        } catch (e) {
          console.log(e);
        }
      }
    },
    cloneChapterQuestion(params) {
      return params;
    },
    cloneQuestion(params) {
      return params;
    },
    async removeQuestion(index, questionIndex) {
      if (typeof questionIndex === "number") {
        const chapter = this.steps[index];
        const deletedItem = chapter.value.questions.splice(
            questionIndex,
            1
        )?.[0];
        try {
          await surveyQuestionDeleteRequest(deletedItem?.value?.id ?? deletedItem?.id)
        } catch (e) {
        }
        this.filterQuestionsAfterDelete(deletedItem.id);
      } else {
        const deletedItem = this.steps.splice(index, 1)?.[0];
        try {
          if (deletedItem.type === "chapter") {
            await surveyChapterDeleteRequest(deletedItem?.value?.id)
          } else {
            await surveyQuestionDeleteRequest(deletedItem?.value?.id)
          }
        } catch (e) {
        }
        this.$emit("stepsParent", this.steps);
        if (deletedItem.type === "question") {
          this.filterQuestionsAfterDelete(deletedItem.value.id);
        } else {
          const questions = deletedItem.value.questions;
          questions.forEach((question) => {
            this.filterQuestionsAfterDelete(question.id);
          });
        }
      }
    },
    filterQuestionsAfterDelete(deletedQuestionId) {
      this.questions = this.questions.filter(
          (question) => question.id != deletedQuestionId
      );
      this.$emit("questionsParent", this.questions);
      if (this.selectedQuestion?.id == deletedQuestionId) {
        this.selectedQuestion = null;
        this.$emit("selectedQuestionParent", this.selectedQuestion);
      }
    },
    async addQuestionToChapter(chapter, e) {
      const question = {
        id: uuidv4(),
        title: e.target.value,
        text: "",
        description: "",
        chapter: null,
        chapterId: chapter.id,
        surveyId: this.$route.params.id ?? this.surveyId,
        productDetails: "",
        configuration: {
          type: "single-select",
          conditions: [],
          groups: [],
        },
        upperOrder:
        chapter?.questions?.[chapter?.questions?.length - 1]?.value
            .order,
        next: "",
        back: "",
      };
      try {
        await surveyQuestionTemplateWidgetPostRequest({
          ...question,
        }).then((response) => {
          question.id = response?.data?.id ?? question.id;
          this.surveyId = response?.data?.surveyId ?? null
        });
      } catch (e) {
      }
      this.scrollQuestionIntoView(question?.id);
      this.questions.push(question);
      this.$emit("questionsParent", this.questions);
      chapter.questions.push({
        id: uuidv4(),
        type: "question",
        value: question,
      });
      this.$refs.chapterQuestionInput.value = "";
    },
    selectType(type) {
      this.type = type;
    },
    async createQuestion() {
      if (this.title) {
        const question = {
          id: uuidv4(),
          title: this.title,
          text: "",
          description: "",
          chapter: null,
          chapterId: null,
          surveyId: this.$route.params.id ?? this.surveyId,
          productDetails: "",
          configuration: {
            type: "single-select",
            groups: [],
            conditions: [],
          },
          upperOrder:
              this.steps?.[this.questions.length - 1]?.value?.order ??
              this.steps?.[this.questions.length - 1]?.value
                  ?.chapterOrder,
          next: "",
          back: "",
        };
        this.validator[question.id] = {
          text: {
            required: true,
            error: false,
            message: "Text is a required field",
          },
          description: {
            required: true,
            error: false,
            message: "Description is a required field",
          },
          value: {
            required: true,
            error: false,
            message: "Value is a required field",
          },
        };
        this.$emit("validatorParent", this.validator);
        try {
          surveyQuestionTemplateWidgetPostRequest({
            ...question,
          })
              .then((response) => {
                question.id = response?.data?.id ?? question.id;
                question.surveyId = response?.data?.surveyId;
                if (!this.surveyId) {
                  this.stylesConfiguration['step'] = this.stylesConfiguration['steps'];
                  this.stylesConfiguration['questionDetail'] = this.stylesConfiguration['questionDetails'];
                  this.stylesConfiguration['productDetail'] = this.stylesConfiguration['productDetails'];
                  this.$nextTick(async () => {
                    await surveyStyleConfigurationsPostRequest({
                      ...this.stylesConfiguration,
                      surveyId: response?.data?.surveyId,
                    })
                  });
                }
                question.order = response?.data?.questionOrder;
                this.scrollQuestionIntoView(question?.id);
                this.surveyId = response?.data?.surveyId;
                console.log("SEtting ths survye: ", this.surveyId, response.data)
              })
        } catch (e) {
        }
        this.questions.push(question);
        this.$emit("questionsParent", this.questions);
        this.steps.push({
          id: uuidv4(),
          type: "question",
          value: question,
        });
        this.$emit("stepsParent", this.steps);
        this.title = "";
        this.selectedQuestion = question;
        this.$emit("selectedQuestionParent", this.selectedQuestion);
      }
    },
    async createChapter() {
      if (this.title) {
        const chapter = {
          id: uuidv4(),
          title: this.title,
          questions: [],
          surveyId: this.surveyId ?? this.$route.params.id,
          upperOrder:
              this.steps?.[this.steps.length - 1]?.value?.order ??
              this.steps?.[this.steps.length - 1]?.value
                  ?.chapterOrder,
        };
        try {
          surveyChapterTemplateWidgetPostRequest({
            ...chapter,
          })
              .then((response) => {
                chapter.id = response?.data?.id ?? chapter.id;
                chapter.surveyId = response?.data?.surveyId;
                if (!this.surveyId) {
                  this.stylesConfiguration['step'] = this.stylesConfiguration['steps'];
                  this.stylesConfiguration['questionDetail'] = this.stylesConfiguration['questionDetails'];
                  this.stylesConfiguration['productDetail'] = this.stylesConfiguration['productDetails'];
                  this.$nextTick(async () => {
                    await surveyStyleConfigurationsPostRequest({
                      ...this.stylesConfiguration,
                      surveyId: response?.data?.surveyId,
                    })
                  });
                }
                chapter.chapterOrder = response?.data?.chapterOrder;
                this.surveyId = response?.data?.surveyId;
              })
        } catch (e) {
        }
        this.steps.push({
          id: uuidv4(),
          type: "chapter",
          value: chapter,
        });
        this.$emit("stepsParent", this.steps);
        this.title = "";
        this.selectedChapter = chapter;
        this.$emit("selectedChapterParent", this.selectedChapter);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.justify-evenly {
  justify-content: space-evenly;
}

:deep(.custom-action-grid) {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 10px;
}

.question:hover {
  background: #eee;
  color: #000;
  border: 1px solid #aaa;
}

.question:hover > .cross {
  display: block;
}

.chapter:hover > .cross {
  display: block;
}

.question:hover > .pencil {
  display: block;
}

.chapter:hover > .pencil {
  display: block;
}

ul {
  margin-left: 20px;
}

.chapter li {
  list-style-type: none;
  margin: 10px 0 10px 10px;
  position: relative;
}

.chapter .question:before {
  content: "";
  position: absolute;
  top: -13px;
  left: -20px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  width: 20px;
  height: 27px;
}

.chapter .question-title-input:before {
  content: "";
  position: absolute;
  top: -20px;
  left: -20px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  width: 20px;
  height: 40px;
}

.chapter li:after {
  position: absolute;
  content: "";
  top: 5px;
  left: -20px;
  border-left: 1px solid #ddd;
  width: 20px;
  height: 100%;
}

.chapter li:last-child:after {
  display: none;
}

.chapter li span {
  display: block;
  color: #000;
  text-decoration: none;
}

.chapter li span:hover,
.chapter li span:focus {
  background: #eee;
  color: #000;
}

.chapter li span:hover + ul li span,
.chapter li span:focus + ul li span {
  background: #eee;
  color: #000;
}

.chapter li span:hover + ul li:after,
.chapter li span:focus + ul li:after,
.chapter li span:hover + ul li:before,
.chapter li span:focus + ul li:before {
  border-color: #aaa;
}

.main-div {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
}

.mid-card {
  display: grid;
  grid-template-rows: 1fr 2fr;
  gap: 1rem;
}

.bottom-card {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1rem;
}

.card {
  background-color: white;
  border: 1px solid #eeeeee; /* darker white */
}

.card-title {
  color: black;
  background-color: #fafafa;
}

.question-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.option-card {
  border: 1px solid #eeeeee;
}

.cross {
  color: black !important;
  position: absolute;
  right: 10px;
}

.pencil {
  color: black !important;
  position: absolute;
  right: 30px;
}

.tabs .cross {
  color: black !important;
  position: absolute;
  right: 50%;
}

.top-4 {
  top: 4px;
}

.conditions {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: 0.2rem;
}

.conditions-number {
  grid-template-columns: 1fr 2fr 2fr 2fr !important;
}

:deep(.ql-container) {
  min-height: 300px;
}

/* Accordion styles */
.tabs {
  overflow: hidden;
}

.tab {
  width: 100%;
  color: white;
  overflow: hidden;

  &-label {
    display: flex;
    justify-content: space-between;
    background: white;
    cursor: pointer;
    /* Icon */
    &:hover {
    }

    &::after {
      content: "\276F";
      text-align: center;
      transition: all 0.35s;
      color: black;
      position: absolute;
      right: 10px;
      margin-top: 15px;
    }
  }

  &-content {
    display: none;
    max-height: 0;
    color: black;
    transition: all 0.35s;
  }

  &-close {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75em;
    background: white;
    cursor: pointer;

    &:hover {
    }
  }
}

.styles-configurator-tab-label::after {
  margin-top: 0px !important;
}

// :checked
input:checked {
  + .tab-label {
    &::after {
      transform: rotate(90deg);
      transform-origin: center;
    }
  }

  ~ .tab-content {
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

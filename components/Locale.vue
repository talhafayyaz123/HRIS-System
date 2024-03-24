<script lang="ts" setup>

import { useAuthStore } from "~/store/auth";
import {ref, onMounted} from "vue"
import { useI18n } from "vue-i18n";
const
    auth = useAuthStore(),
    { t, locale } = useI18n({useScope: 'global' }),
    currentLanguage = ref(auth.language),
    languages = [
        {
            language: "en",
            title: "English",
        },
        {
            language: "de",
            title: "German",
        },
    ]
    /**
     * Set languages
     */
    const setLanguage = (lang: string) => {

        locale.value = lang;
        currentLanguage.value = lang;
        localStorage.setItem("lang", lang);
        auth.lang(lang); // Call the 'language' action in the store
      }

      onMounted(() => {
          locale.value = auth.language
      })
</script>
<template>
    <div class="dropdwon">
        <a class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">

              <span v-if="$i18n.locale === 'de'">
                <ElementsIcon v-bind:icon="'germenIcon'" />
              </span>
            <span v-else>
                <ElementsIcon v-bind:icon="'ukIcon'" />
              </span>
        </a>
        <ul class="dropdown-menu">
            <li>
                <div class="dropdown-item notify-item" v-for="(entry, i) in languages" :key="`Lang${i}`" :value="entry"
                     @click="setLanguage(entry.language)"
                     :link-class="{ active: entry.language === currentLanguage }">
                    <ElementsIcon v-if="entry.language === 'de'" v-bind:icon="'germenIcon'" class="me-2"/>
                    <ElementsIcon v-else v-bind:icon="'ukIcon'"  class="me-2"/>
                    <span class="align-middle">{{ entry.title }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from "@/store/layout";
import { ref } from "vue";

const store = useLayoutStore();
const title = ref("");
const items = [
  {
    text: "Admin portal",
    to: "/",
  },
  {
    text: "Profile",
    active: true,
  },
];

</script>


<template>
  <div>
    <page-header :title="title" :items="items" />
    <form @submit.prevent="store">
      <div class="card noheader">
        <div class="card-body">
          <div class="row">
            <div class="col-lg-2">
              <div class="profile_img">
                <img src="~/assets/images/users/avatar-1.jpg" alt="">
              </div>
            </div>
            <div class="col-lg-3">
              <div class="profile_user_det mt-2 widget_prof">
                <h2>Marcel Rupprecht</h2>
                <p>Geschäftsführer | CTO

                  Entwicklung, Cloud & Infrastruktur

                  00002</p>
              </div>

            </div>
            <div class="col-lg-3">
              <div class="profile_user_det mt-2 widget_prof">
                <h3>Contact</h3>
                <p>m.rupprecht@docshero.de</p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="profile_user_det mt-2 widget_prof">
                <h3>Location</h3>
                <p>Standort Karlsruhe

                  Lorenzstraße 29

                  76135 Karlsruhe

                  Baden-Württemberg

                  Deutschland</p>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-4">
              <div class="form-group">
                <input type="text" name="firstName" class="form-control" placeholder="Enter your first name">
                <label for="" class="input-label">{{ $t('First Name') }} <span>*</span></label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <input type="text" name="lastName" class="form-control" placeholder="Enter your last name">
                <label for="" class="input-label">{{ $t('Last Name') }} <span>*</span></label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <select name="language" id="" class="form-control">
                  <option value="">English</option>
                  <option value="">German</option>
                </select>
                <label for="" class="input-label">{{ $t('Language') }}</label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <input type="email" name="email" class="form-control" placeholder="Email">
                <label for="" class="input-label">{{ $t('Email') }} </label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <input type="text" name="password" class="form-control" placeholder="password">
                <label for="" class="input-label">{{ $t('Password') }}</label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <input type="text" name="password" class="form-control" placeholder="password">
                <label for="" class="input-label">{{ $t('Confirm Password') }}</label>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="w-100 mt-3">
                <button class="secondary-btn ms-auto">Update user</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
  </div>
</template>


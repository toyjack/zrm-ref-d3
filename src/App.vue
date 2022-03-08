<script setup>
import { ref } from 'vue'
import routes from './routes'

const ifNavMenu = ref(false)

</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" :class="{'is-active':ifNavMenu}" @click="ifNavMenu=!ifNavMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{'is-active':ifNavMenu}">
      <div class="navbar-start">
        <router-link class="navbar-item" :to="route.path" v-for="route of routes">{{ route.name }}</router-link>
      </div>
    </div>
  </nav>
  <h5>図書寮本類聚名義抄注文引用の可視化</h5>


  <section class="section">
    <div class="container">
      <router-view></router-view>
    </div>
  </section>

  
</template>
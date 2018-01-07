<template>
  <div id="app">
    <GlobalNavbar></GlobalNavbar>
    <div class="content-wrapper">
      <router-view/>
    </div>
  </div>
</template>

<script>
import GlobalNavbar from '@/components/GlobalNavbar'

export default {
  name: 'app',
  components: {
    GlobalNavbar
  }
}
</script>

<style lang="scss">
@import "/assets/scss/app";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.content-wrapper {
  margin-top: 100px;
}
</style>

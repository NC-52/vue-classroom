<template>
  <div id="app">
    <GlobalNavbar></GlobalNavbar>
    <div class="content-wrapper">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import GlobalNavbar from '@/components/GlobalNavbar'

export default {
  name: 'app',
  components: {
    GlobalNavbar
  },
  methods: {
    ...mapMutations('Site', [
      'updateWindow'
    ]),

    listenWindowResize () {
      window.addEventListener('resize', ({ target }) => {
        let _window = {
          width: target.innerWidth,
          height: target.innerHeight
        }
        this.updateWindow(_window)
      })
    }
  },
  mounted () {
    this.listenWindowResize()
  }
}
</script>

<style lang="scss">
// import scss in assets
@import "/assets/scss/app";

#app {
  font-family: 'Ping Fang TC', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.content-wrapper {
  margin-top: 100px;
}
</style>

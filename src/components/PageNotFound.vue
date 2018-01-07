<template>
  <div class="center">
    <BaseImage :image="{ src: pageNotFoundSrc, class: 'limit-height-xs' }" />
    <header>
      <h1>Page Not Found</h1>
    </header>
    <div>
      <router-link :to="{ name: 'home' }">
        However, you can come back home!
      </router-link>
      <p>
        (Route path is <router-link :to="{ path: path }">{{ path }}</router-link>)
      </p>
    </div>
  </div>
</template>

<script>
import BaseImage from '@/components/BaseImage'

export default {
  data () {
    return {
      path: window.location.pathname,
      pageNotFoundSrc: 'https://cdn.dribbble.com/users/256715/screenshots/3621943/404bath.gif'
    }
  },

  components: {
    BaseImage
  }
}
</script>
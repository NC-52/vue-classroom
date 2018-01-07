<template lang="html">
  <figure :class="figure.class">
    <img :class="className"
      :src="imageSrc"
      :alt="imageTitle || false"
      :title="imageTitle || false"
      :id="image.id"/>
    <slot></slot>
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      default: function () {
        return {
          src: '',
          rawSrc: '',
          class: [],
          id: '',
          name: '',
          showNameSuffix: false,
          rjs: false
        }
      }
    },
    index: Number,
    figure: {
      type: Object,
      default: () => ({
        class: []
      })
    },
    rellax: Boolean
  },

  data () {
    return {
      nameSuffix: '',
      imagePath: ''
    }
  },

  computed: {
    className () {
      let defaultClass = ''
      let className = this.image.class

      return className === undefined
        ? defaultClass
        : typeof className === 'string'
          ? [...className.split(' '), defaultClass]
          : Array.isArray(className)
            ? [...className, defaultClass]
            : defaultClass
    },

    imageTitle () {
      let { name, showNameSuffix } = this.image
      return showNameSuffix
        ? name + this.nameSuffix
        : name
    },

    imageSrc () {
      return this.image.src || `${this.imagePath}/${this.image.rawSrc}`
    }
  }
}
</script>
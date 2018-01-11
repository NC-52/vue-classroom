<template lang="html">
  <canvas ref="chart"></canvas>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ClassroomPieChart',
  props: {
    pieConfig: Object
  },
  data () {
    pieInstance: null
  },
  computed: {
    ...mapState('Site', {
      windowWidth: (state) => state.windowSize.width
    }),
    ...mapGetters('Site', [
      'isMobile'
    ])
  },
  methods: {
    createPie () {
      let pieDOM = this.$refs.chart.getContext('2d')
      let pieConfig = this.pieConfig
      this.pieInstance = new Chart(pieDOM, pieConfig)
    },
    redrawPie () {
      this.pieInstance.destroy()
      this.createPie()
    }
  },
  watch: {
    pieConfig () {
      this.redrawPie()
    },
    windowWidth () {
      if (this.isMobile) {
        this.redrawPie()
      }
    }
  }
}
</script>
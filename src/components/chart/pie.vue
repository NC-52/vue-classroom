<template lang="html">
  <canvas ref="chart"></canvas>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Chart from 'chart.js'

export default {
  name: 'ChartPie',
  props: {
    pieConfig: Object
  },
  data () {
    return {
      pieInstance: null
    }
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
  },
  mounted () {
    this.createPie()
  }
}
</script>
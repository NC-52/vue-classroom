<template lang="html">
  <canvas ref="chart"></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'ChartPie',
  props: {
    pieConfig: Object
  },
  methods: {
    createPie () {
      let pieDOM = this.$refs.chart.getContext('2d')
      let pieConfig = this.pieConfig
      this.pieInstance = new Chart(pieDOM, pieConfig)
    }
  },
  watch: {
    pieConfig () {
      this.createPie()
    }
  }
}
</script>

<style lang="scss">
</style>

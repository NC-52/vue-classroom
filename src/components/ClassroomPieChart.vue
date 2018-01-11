<template lang="html">
  <canvas ref="chart"></canvas>
</template>

<script>

export default {
  name: 'ClassroomPieChart',
  props: {
    pieConfig: Object
  },
  data () {
    pieInstance: null
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
      this.pieInstance.destroy()
      this.createPie()
    }
  }
}
</script>

<style lang="scss">
</style>

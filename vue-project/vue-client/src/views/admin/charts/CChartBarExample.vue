<template>
  <CChartBar
    style="width: 450px"
    v-if="data"
    :datasets="defaultDatasets"
    labels="indexes"
  />
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs'

export default {
  name: 'CChartBarExample',
  components: { CChartBar },
  props:{
    data: Array,
  },
  computed: {
    defaultDatasets () {
      return [
        {
          label: 'Sao',
          backgroundColor: '#1E90FF',
          data: this.data
        }
      ]
    }
  }
}
</script>

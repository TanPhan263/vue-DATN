<template>
  <CChartBar
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
      console.log(this.data);
      return [
        {
          label: 'Star',
          backgroundColor: '#f87979',
          data: this.data
        }
      ]
    }
  }
}
</script>

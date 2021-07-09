<template>
  <CChartLine
    :datasets="defaultDatasets"
    :options="defaultOptions"
    :labels="lable"
  />
</template>

<script>
import { CChartLine } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'


export default {
  name: 'MainChartExample',
  data(){
    return{
    }
  },
  props:{
    dataBlue:Array,
    dataGreen:Array,
    dataRed:Array,
    lable:Array,
    lableBlue: String,
    lableGreen: String,
    lableRed: String
  },
  created(){
  },
  components: {
    CChartLine
  },
  computed: {
    defaultDatasets () {
      const brandSuccess = getStyle('success2') || '#4dbd74'
      const brandInfo = getStyle('info') || '#20a8d8'
      const brandDanger = getStyle('danger') || '#f86c6b'
      return [
        {
          label: this.lableBlue,
          backgroundColor: hexToRgba(brandInfo, 10),
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          data: this.dataBlue
        },
        {
          label: this.lableGreen,
          backgroundColor: 'transparent',
          borderColor: brandSuccess,
          pointHoverBackgroundColor: brandSuccess,
          borderWidth: 2,
          data: this.dataGreen
        },
        {
          label: this.lableRed,
          backgroundColor: 'transparent',
          borderColor: brandDanger,
          pointHoverBackgroundColor: brandDanger,
          borderWidth: 2,
          data: this.dataRed
        }
      ]
    },
    defaultOptions () {
      var maxBlue = Math.max.apply(Math, this.dataBlue);
      var maxGreen = Math.max.apply(Math, this.dataGreen);
      var maxRed = Math.max.apply(Math, this.dataRed);
      var max = [maxBlue,maxGreen,maxRed];
      return {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              drawOnChartArea: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil((Math.max.apply(Math, max) + 20 )/ 5),
              max: Math.max.apply(Math, max)
            },
            gridLines: {
              display: true
            }
          }]
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    }
  }
}
</script>

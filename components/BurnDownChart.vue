<template>
  <div>
    <line-chart :chart-data="datacollection" :options="graphOptions" style="position: relative; height: 600px;"></line-chart>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      datacollection: {},
      graphOptions: {
        // responsive: true,
        legend: {
          align: 'end'
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: '#808080'
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: '#808080'
              },
              scaleLabel: {
                display: true,
                labelString: 'Hours'
              }
            }
          ]
        },
        tooltips: {
          backgroundColor: 'white',
          titleFontColor: 'black',
          bodyFontColor: 'black',
          mode: 'label',
          // callbacks: {
          //   label: function (tooltipItem, data){
          //     return ["計画との差：" + tooltipItem + "huga"]
          //   }
          // }
        }
      }
    }
  },
  props: {
    days: {
      type: Array,
      default: []
    }
  },
  mounted () {
    this.fillData()
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: this.days,
        datasets: [
          {
            label: '計画',
            lineTension: 0,
            backgroundColor: '#f0f8ff',
            fill: false,
            borderColor: '#f0f8ff',
            borderWidth: 3,
            pointHitRadius: 15,
            hoverRadius: 10,
            radius: 5,
            pointStyle: 'circle',
            data: [70, 60, 50, 40, 30, 20, 10, 0],
            borderDash: [5, 5]
          }, {
            label: '実績',
            lineTension: 0,
            backgroundColor: '#00bfff',
            fill: false,
            borderColor: '#00bfff',
            borderWidth: 5,
            pointHitRadius: 15,
            hoverRadius: 10,
            radius: 5,
            pointStyle: 'rectRounded',
            data: [100, 110, 125, 95, 64, 76, 62]
          }
        ]
      }
    }
  },
  watch: {
    days: function () {
      this.fillData()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

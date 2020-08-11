<template>
  <div>
    <line-chart :chart-data="datacollection" :options="graphOptions" style="position: relative; height: 600px;"></line-chart>
    <div>{{ taskData }}</div>
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
      },
      taskData: []
    }
  },
  mounted () {
    this.fillData()
    // TODO: proxy serverを自前でたてる
    this.$axios.$get('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/agile/1.0/board/' + process.env.JIRA_ACTIVE_BOARD_NO + '/sprint?state=active', {
      credentials: true,
      auth: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWD
      }
    }).then((response) => {
      this.taskData = response
      console.log(this.taskData)
    })

    const url = 'https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search?jql=project = ' + process.env.JIRA_PROJECT_NAME + ' AND sprint in openSprints()'
    this.$axios.$get(encodeURI(url), {
      credentials: true,
      auth: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWD
      }
    }).then((response) => {
      console.log(response)
    })

    const url2 = 'https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + "/rest/api/3/search?jql=(parent = TES-1 OR parent = TES-2 OR parent = TES-3) AND status changed on(2020-08-11) to '完了(受け入れ条件を満たす)'"
    this.$axios.$get(encodeURI(url2), {
      credentials: true,
      auth: {
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWD
      }
    }).then((response) => {
      console.log(response)
    })

    // const token = Buffer.from(`${process.env.JIRA_USERNAME}:${process.env.JIRA_PASSWD}`, 'utf8').toString('base64')
    // this.$axios.$post('http://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search',
    //   {
    //     "expand": [
    //       "names"
    //     ],
    //     "jql": "project = AP AND sprint in openSprints()",
    //     "maxResults": 50,
    //     "fieldsByKeys": false,
    //     "fields": [
    //       "key"
    //     ],
    //     "startAt": 0
    //   },
    //   {
    //     headers: {
    //       'X-Atlassian-Token': 'no-check',
    //       'Authorization': `Basic ${token}`,
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // ).then((response) => {
    //   console.log(response)
    // })
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12'],
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
            data: [110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0],
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
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

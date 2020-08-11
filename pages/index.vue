<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="font-weight-thin display-1">DashBoard</div>
      </v-col>
      <v-col>
        <v-btn text icon color="white" class="float-right" @click="getSprintTask()">
          <v-icon dark>mdi-reload</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-hover>
          <v-card
           slot-scope="{ hover }"
           class="mx-auto aligh-center"
          >
            <v-fade-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="height: 100%;"
              >
              </div>
            </v-fade-transition>
            <v-card-title class="headline">
              スプリントバーンダウンチャート
            </v-card-title>
            <BurnDownChart :days="days" />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-hover>
          <v-card
           slot-scope="{ hover }"
           class="mx-auto"
          >
            <v-fade-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="height: 100%;"
              >
              </div>
            </v-fade-transition>
            <v-card-title class="headline">
              スプリント残時間
            </v-card-title>
            <v-card-text>
              <p class="display-3">30.5h</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col>
        <v-hover>
          <v-card
           slot-scope="{ hover }"
           class="mx-auto"
          >
            <v-fade-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="height: 100%;"
              >
              </div>
            </v-fade-transition>
            <v-card-title class="headline">
              タスク残時間
            </v-card-title>
            <v-card-text>
              <p class="display-3">30.5h</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col>
        <v-hover>
          <v-card
           slot-scope="{ hover }"
           class="mx-auto"
          >
            <v-fade-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="height: 100%;"
              >
              </div>
            </v-fade-transition>
            <v-card-title class="headline">
              先行/遅れ
            </v-card-title>
            <v-card-text>
              <p class="display-3">30.5h</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
      <v-col>
        <v-hover>
          <v-card
           slot-scope="{ hover }"
           class="mx-auto"
          >
            <v-fade-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="height: 100%;"
              >
              </div>
            </v-fade-transition>
            <v-card-title class="headline">
              進捗率
            </v-card-title>
            <v-card-text>
              <p class="display-3">60%</p>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BurnDownChart from '~/components/BurnDownChart.vue'

export default {
  components: {
    BurnDownChart
  },
  data () {
    return {
      days: [],
    }
  },
  methods: {
    getSprintTask () {
      // TODO: proxy serverを自前でたてる
      this.$axios.$get('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/agile/1.0/board/' + process.env.JIRA_ACTIVE_BOARD_NO + '/sprint?state=active', {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((response) => {
        this.days = []
        const startDate = this.$moment(response.values[0].startDate)
        const endDate = this.$moment(response.values[0].endDate)
        for (let date = startDate; date < endDate; startDate.add(1, "days")) {
          // スプリント最終日は開発を行わない（レビュー日）ため計画から除く、土日は休みのため計画から除く
          if ((date.format('ddd') != '土' || date.format('ddd') != '日') && date.format("YYYY-MM-DD") != endDate.format("YYYY-MM-DD")) {
            this.days.push(date.format("YYYY-MM-DD"))
          }
        }
        console.log(this.days)
      })

      const url = 'https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search?jql=project = ' + process.env.JIRA_PROJECT_NAME + ' AND sprint in openSprints()'
      this.$axios.$get(encodeURI(url), {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((response) => {
        for (const el of response.issues) {
          console.log(el.key)
        }
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
    }
  }
}
</script>

<style>
.v-card--reveal {
  border: solid 1px #00bfff;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
}
</style>
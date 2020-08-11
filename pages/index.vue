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
            <BurnDownChart :days="days" :timeLeftPlan="timeLeftPlan" :timeLeftLog="timeLeftLog" />
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
      timeLeftPlan: [],
      timeLeftLog: []
    }
  },
  methods: {
    async getSprintTask () {
      // TODO: proxy serverを自前でたてる
      // 今回スプリントで開発に充てる日付を取得
      await this.$axios.$get('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/agile/1.0/board/' + process.env.JIRA_ACTIVE_BOARD_NO + '/sprint?state=active', {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        this.days = []
        const startDate = this.$moment(res.values[0].startDate)
        const endDate = this.$moment(res.values[0].endDate)
        for (let date = startDate; date < endDate; startDate.add(1, "days")) {
          // スプリント最終日は開発を行わない（レビュー日）ため計画から除く、土日は休みのため計画から除く
          if (date.format('ddd') != '土' && date.format('ddd') != '日' && date.format("YYYY-MM-DD") != endDate.format("YYYY-MM-DD")) {
            this.days.push(date.format("YYYY-MM-DD"))
          }
        }
      })

      // 今回スプリントの全ての親タスク（Story）を取得
      let parentTasksForJql = ''
      await this.$axios.$get(encodeURI('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search?jql=project = ' + process.env.JIRA_PROJECT_NAME + ' AND sprint in openSprints()'), {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        for (const el of res.issues) {
          parentTasksForJql += 'parent = ' + el.key
          if (el != res.issues.slice(-1)[0]) {
            parentTasksForJql += ' OR '
          }
        }
      })

      // 全ての子タスク分の時間取得
      let sprintFullTime = 0
      await this.$axios.$get(encodeURI('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search?jql=' + parentTasksForJql), {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        for (const el of res.issues) {
          sprintFullTime += el.fields.timeestimate
        }
        sprintFullTime = sprintFullTime / 3600
        const timeAvailablePerDay = sprintFullTime / this.days.length
        let timeLeftPlanNum = sprintFullTime
        for (const day of this.days) {
          this.timeLeftPlan.push(timeLeftPlanNum)
          timeLeftPlanNum -= timeAvailablePerDay
        }
      })

      // スプリント開始から今日まで日ごとに消化したタスク取得
      let timeLeft = sprintFullTime
      for (const day of this.days) {
        await this.$axios.$get(encodeURI('https://cors-anywhere.herokuapp.com/' + process.env.JIRA_URL + '/rest/api/3/search?jql=(' + parentTasksForJql + ') AND status changed on(' + day + ") to '完了(受け入れ条件を満たす)'"), {
          credentials: true,
          auth: {
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWD
          }
        }).then((res) => {
          for (const el of res.issues) {
            timeLeft -= el.fields.timeestimate / 3600
          }
          // 残り時間の実績に追加
          this.timeLeftLog.push(timeLeft)
        })
        if (day === this.$moment().format("YYYY-MM-DD")) {
          break
        }
      }
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
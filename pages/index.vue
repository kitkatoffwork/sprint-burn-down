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
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="card"
        >
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
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="list-item-three-line"
        >
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
                <p class="display-3">{{ sprintLeft }}h</p>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="list-item-three-line"
        >
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
                <p class="display-3">{{ taskLeft }}h</p>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="list-item-three-line"
        >
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
                <p class="display-3">{{ plusMinous }}h</p>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="list-item-three-line"
        >
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
                <p class="display-3">{{ progress }}%</p>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-skeleton-loader>
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
      timeLeftLog: [],
      sprintLeft: 0,
      taskLeft: 0,
      plusMinous: 0,
      progress: 0,
      loading: false
    }
  },
  mounted () {
    this.getSprintTask()
  },
  methods: {
    async getSprintTask () {
      // 今回スプリントで開発に充てる日付を取得
      this.loading = true
      await this.$axios.$get(process.env.PROXY_URL + process.env.JIRA_URL + '/rest/agile/1.0/board/' + process.env.JIRA_ACTIVE_BOARD_NO + '/sprint?state=active', {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        const startDate = this.$moment(res.values[0].startDate)
        const endDate = this.$moment(res.values[0].endDate)
        this.days = this.getBusinessDays (startDate, endDate)
      })

      // 今回スプリントの全ての親タスク（Story）を取得
      let parentTasksForJql = ''
      await this.$axios.$get(encodeURI(process.env.PROXY_URL + process.env.JIRA_URL + '/rest/api/3/search?jql=project = ' + process.env.JIRA_PROJECT_NAME + ' AND sprint in openSprints()'), {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        parentTasksForJql = this.makeParentTasksForJql(res.issues)
      })

      // 全ての子タスク分の時間取得
      let sprintFullTime = 0
      await this.$axios.$get(encodeURI(process.env.PROXY_URL + process.env.JIRA_URL + '/rest/api/3/search?jql=' + parentTasksForJql), {
        credentials: true,
        auth: {
          username: process.env.JIRA_USERNAME,
          password: process.env.JIRA_PASSWD
        }
      }).then((res) => {
        sprintFullTime = this.calcSprintFullTime(res.issues)
        this.timeLeftPlan = this.makeTimeLeftPlan(sprintFullTime, this.days)
        this.sprintLeft = this.makeSprintLeft(sprintFullTime, this.days)
      })

      // スプリント開始から今日まで日ごとに消化したタスク取得
      let timeLeft = sprintFullTime
      this.timeLeftLog = []
      for (const day of this.days) {
        if (this.$moment(day).isAfter(this.$moment())) {
          break
        }
        await this.$axios.$get(encodeURI(process.env.PROXY_URL + process.env.JIRA_URL + '/rest/api/3/search?jql=(' + parentTasksForJql + ') AND status changed on(' + day + ") to '完了(受け入れ条件を満たす)'"), {
          credentials: true,
          auth: {
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWD
          }
        }).then((res) => {
          for (const el of res.issues) {
            timeLeft -= this.convertSecond2Hour(el.fields.timeestimate)
          }
          // 残り時間の実績に追加
          this.timeLeftLog.push(timeLeft)
          // タスク残時間・先行遅れ・進捗率を更新
          this.taskLeft = this.timeLeftLog.slice(-1)[0].toFixed(1)
          this.plusMinous = (this.sprintLeft - this.taskLeft).toFixed(1)
          this.progress = (((sprintFullTime - this.taskLeft) / sprintFullTime) * 100).toFixed(1)
        })
      }
      this.loading = false
    },
    calcSprintFullTime (issues) {
      let sprintFullTime = 0
      for (const el of issues) {
        sprintFullTime += el.fields.timeestimate
      }
      // 秒単位→時間単位へ変換
      return this.convertSecond2Hour(sprintFullTime)
    },
    convertSecond2Hour (sec) {
      return sec / 3600
    },
    getBusinessDays (startDate, endDate) {
      let days = []
      for (let date = startDate; date < endDate; startDate.add(1, "days")) {
        // スプリント最終日は開発を行わない（レビュー日）ため計画から除く、土日は休みのため計画から除く
        if (date.format('ddd') != '土' && date.format('ddd') != '日' && date.format("YYYY-MM-DD") != endDate.format("YYYY-MM-DD")) {
          days.push(date.format("YYYY-MM-DD"))
        }
      }
      return days
    },
    makeParentTasksForJql (issues) {
      let parentTasksForJql = ''
      for (const el of issues) {
        parentTasksForJql += 'parent = ' + el.key
        if (el != issues.slice(-1)[0]) {
          parentTasksForJql += ' OR '
        }
      }
      return parentTasksForJql
    },
    makeSprintLeft (sprintFullTime, sprintDays) {
      const timeAvailablePerDay = sprintFullTime / sprintDays.length
      let timeLeftPlanNum = sprintFullTime
      let sprintLeft = 0
      for (const day of sprintDays) {
        // 今日時点でのスプリント残時間を保持
        if (day === this.$moment().format("YYYY-MM-DD")) {
          sprintLeft = timeLeftPlanNum.toFixed(1)
        }
        timeLeftPlanNum -= timeAvailablePerDay
      }
      return sprintLeft
    },
    makeTimeLeftPlan (sprintFullTime, sprintDays) {
      const timeAvailablePerDay = sprintFullTime / (sprintDays.length - 1)
      let timeLeftPlanNum = sprintFullTime
      let timeLeftPlan = []
      for (const day of sprintDays) {
        timeLeftPlan.push(timeLeftPlanNum)
        timeLeftPlanNum -= timeAvailablePerDay
      }
      // 最終日は0に固定（浮動小数点演算のため計算結果が0にならないケースがあるため）
      timeLeftPlan.pop()
      timeLeftPlan.push(0)
      return timeLeftPlan
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
<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="font-weight-thin display-1">DashBoard</div>
      </v-col>
      <v-col>
        <v-btn text icon color="white" class="float-right">
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
            <BurnDownChart />
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
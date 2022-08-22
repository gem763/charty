<template>
  <div class="charter vcomp">
    <div class="run" @click.stop="run">차트 불러오기</div>

    <Line
      v-if="state.prices.length > 0"
      :chart-options="state.chartOptions"
      :chart-data="state.chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { 
  reactive, 
  onMounted,
  computed,
} from 'vue';

import { 
  // Bar, 
  Line 
} from 'vue-chartjs'

// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  // Plugin
} from 'chart.js'

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

export default {
  name: 'Charter',
  components: { Line },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: 'container',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => [
        // {
        //   id: 'custom_canvas_background_color',
        //   beforeDraw: (chart) => {
        //     const {ctx} = chart;
        //     ctx.save();
        //     ctx.globalCompositeOperation = 'destination-over';
        //     ctx.fillStyle = '#3492ff';
        //     ctx.fillRect(0, 0, chart.width, chart.height);
        //     ctx.restore();
        //   }
        // }
      ]
    }
  },

  setup() {
    const state = reactive({
      chartData: computed(() => {
        return {
          datasets: [
            {
              label: 'price',
              data: state.prices,
              parsing: {
                xAxisKey: 'localDate',
                yAxisKey: 'closePrice'
              },
              borderColor: 'black',
            }
          ]
        }
      }),

      chartOptions: {
        responsive: true,
        // borderWidth: 5,
        borderWidth: 5,
        // pointRadius: 5,
        pointRadius: 0,
        pointBackgroundColor: 'white',
        // pointBorderColor: 'white',
        // pointBorderWidth: 1
        tension: 0.1,

        scales: {
          y: {
            display: false,
            beginAtZero: false,
            // grid: { display: false },
            // ticks: {display: false }
          },
          x: {
            display: false,
            grid: { display: false }
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        plugins: {
          legend: {
            // title: {
            //   color: 'red'
            // },
            labels: {
              boxHeight: 1,
              boxWidth: 20,
              color: 'black',
              font: { size: 20 }
            }
          }
        }
      },

      code: '005930',
      startDate: '20220101',
      endDate: '20220817',
      prices: [],
      url: computed(() => {
        return `/api/chart/domestic/item/${state.code}/day?startDateTime=${state.startDate}&endDateTime=${state.endDate}`
      })
    });


    onMounted(() => {
    })

    const run = () => {
      fetch(state.url).then(x => x.json()).then(x => {
        state.prices.push(...x);
        // console.log(x);
        // state.chartData.datasets[0].data.push(...x);
      })
    }

    return {
      state,
      run
    }
  }
}
</script>


<style scoped>
.charter.vcomp {
  padding-top: 20px;
}

.charter.vcomp > .run {
  width: calc(100% - 40px);
  height: 60px;
  margin: 0 auto 20px auto;
  background: black;
  line-height: 60px;
  border-radius: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.charter.vcomp > .container {
    width: calc(100% - 40px);
    width: 100%;
    margin: auto;
    background: rgba(0, 0, 0, 0.05);
    /* border-radius: 10px; */
    overflow: hidden;
}
</style>

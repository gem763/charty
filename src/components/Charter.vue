<template>
    <div class="charter vcomp">

        <p class="title">{{ title }}</p>

        <Stockpicker/>
        <SearchKeywords/>

        <div class="run" @click.stop="run">차트 불러오기</div>

        <div class="chart">
            <div class="period" v-if="state.prices.length > 0">
                <span class="item" :class="on('3M')" @click="change_period('3M')">3M</span>
                <span class="item" :class="on('6M')" @click="change_period('6M')">6M</span>
                <span class="item" :class="on('1Y')" @click="change_period('1Y')">1Y</span>
                <span class="item" :class="on('3Y')" @click="change_period('3Y')">3Y</span>
                <span class="item" :class="on('5Y')" @click="change_period('5Y')">5Y</span>
            </div>

            <Line
                v-if="prices.length > 0"
                :chart-options="state.chartOptions"
                :chart-data="state.chartData"
                :chart-id="chartId"
                :dataset-id-key="datasetIdKey"
                :plugins="plugins"
                :css-classes="cssClasses"
                :styles="styles"
                :width="width"
                :height="height"/>

        </div>
    </div>
</template>


<script setup>
import { reactive, computed } from 'vue';
import Stockpicker from './Stockpicker.vue';
import SearchKeywords from './SearchKeywords.vue';
import { Line } from 'vue-chartjs'
import { useStockinfoStore } from '@/stores/stockinfo'
import { storeToRefs } from 'pinia'
import 'chartjs-adapter-luxon'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    TimeScale,
    TimeSeriesScale,
    // Plugin
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    TimeScale,
    TimeSeriesScale
)


defineProps({
    title: {
        type: String, 
        default: 'Stockprice\nSentimental\nAnalysis'
    },
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
})

const stockinfo = useStockinfoStore();
const { prices, ntrend, period } = storeToRefs(stockinfo);


const state = reactive({
    prices: prices,
    ntrend: ntrend,

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
                    // borderColor: 'rgb(54, 162,235)',
                    // borderColor: '#42d392',
                    borderColor: '#212121',
                    yAxisID: 'y1'
                },

                {
                    label: 'sentiment',
                    data: state.ntrend,
                    parsing: {
                        xAxisKey: 'localDate',
                        yAxisKey: 'ratio'
                    },
                    borderColor: '#42d392',
                    yAxisID: 'y2'
                }
            ]
        }
    }),

    chartOptions: {
        responsive: true,
        // borderWidth: 5,
        borderWidth: 3,
        // pointRadius: 5,
        pointRadius: 0,
        pointBackgroundColor: 'white',
        // pointBorderColor: 'white',
        // pointBorderWidth: 1
        tension: 0.1,

        scales: {
            y1: {
                display: false,
                beginAtZero: false,
                position: 'left',
                // grid: { display: false },
                // ticks: {display: false }
            },
            y2: {
                display: false,
                beginAtZero: false,
                position: 'right',
            },
            x: {
                // display: false,
                // type: 'timeseries',
                type: 'time',
                grid: { display: false, drawBorder: false },
                time: {
                    unit: 'month',
                    displayFormats: {'month':'yyyy.MM'}
                },
            }
        },
        layout: {
            padding: {
                left: 20,
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
                position: 'top',
                align: 'center',
                labels: {
                    boxHeight: 1,
                    boxWidth: 20,
                    color: '#212121',
                    font: { size: 15 }
                }
            }
        }
    }
});

const on = (p) => {
    return (period.value == p) ? 'on' : ''
}

const change_period = (p) => {
    stockinfo.change_period(p)
    run()
}

const run = () => {
    stockinfo.fetch_all();
}
</script>


<style scoped>
.charter.vcomp {
    padding-top: 60px;
}

.charter.vcomp > .title {
    white-space: pre-line;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 30px;
    font-weight: bold;
    background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    line-height: 32px;

    text-align: left;
    padding-left: 20px;
    font-size: 35px;
    margin: 0;
}

.charter.vcomp > .run {
    width: calc(100% - 40px);
    height: 50px;
    /* margin: 0 auto 20px auto; */
    margin: 20px;
    /* background: var(--color-black); */
    background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
    line-height: 50px;
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: bold;
}

.charter.vcomp > .chart {
    position: relative;
    width: 100%;
}

.charter.vcomp > .chart > .period {
    height: 50px;
    line-height: 50px;
}

.charter.vcomp > .chart > .period > .item {
    /* border: 1px solid #42d392; */
    /* border: 1px solid #f1f1f1; */
    /* border-radius: 3px; */
    margin-left: 5px;
    font-size: 12px;
    padding: 5px;
    /* width: 30px; */
}

.charter.vcomp > .chart > .period > .item.on {
    /* background: #42d392;
    color: white; */
    color: #42d392;
    font-weight: bold;
}

.charter.vcomp > .chart > .container {
    width: 100%;
    /* background: rgba(0, 0, 0, 0.05); */
    background: #f1f1f1;
    /* border-radius: 10px; */
    overflow: hidden;
}
</style>

<template>
    <div class="charter vcomp">

        <p class="title">{{ title }}</p>

        <Stockpicker/>

        <div class="run" @click.stop="run">차트 불러오기</div>

        <div class="chart">
            <div class="period">
                <span class="item" :class="on('3M')" @click="change_daterange('3M')">3M</span>
                <span class="item" :class="on('6M')" @click="change_daterange('6M')">6M</span>
                <span class="item" :class="on('1Y')" @click="change_daterange('1Y')">1Y</span>
                <span class="item" :class="on('3Y')" @click="change_daterange('3Y')">3Y</span>
                <span class="item" :class="on('5Y')" @click="change_daterange('5Y')">5Y</span>
            </div>

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
    </div>
</template>


<script>
import { reactive, onMounted, computed, shallowRef, ref } from 'vue';
import Stockpicker from './Stockpicker.vue';
import { Line } from 'vue-chartjs'
import { useStockinfoStore } from '@/stores/stockinfo'
import { storeToRefs } from 'pinia'

const gTrends = require('google-trends-api');

// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
    components: { Line, Stockpicker },
    props: {
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
    },

    setup() {
        // gTrends.interestOverTime({keyword: 'Women\'s march'})
        //     .then(function(results){
        //         console.log('These results are awesome', results);
        //     });

        const stockinfo = useStockinfoStore();
        const { name, ticker } = storeToRefs(stockinfo);

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
                            borderColor: '#42d392',
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
                        align: 'start',
                        labels: {
                            boxHeight: 1,
                            boxWidth: 20,
                            color: '#212121',
                            font: { size: 15 }
                        }
                    }
                }
            },

            today: undefined,
            startDate: '',
            endDate: '',
            prices: [
                {closePrice:100, localDate: '202220101'},
                {closePrice:150, localDate: '202220102'},
                {closePrice:120, localDate: '202220103'},
                {closePrice:160, localDate: '202220104'}
            ],
            date_range: '3M'
        });

        const url = computed(() => {
            return `/api/chart/domestic/item/${ticker.value}/day?startDateTime=${state.startDate}&endDateTime=${state.endDate}`
        })

        onMounted(() => {
            state.today = new Date();
            state.endDate = get_dateformat(state.today);
            state.startDate = date_offset(state.today, -3);
        })

        const get_dateformat = (date) => {
            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            return `${y}${m}${d}`
        }

        const date_offset = (date, offset) => {
            const y = date.getFullYear();
            const m = date.getMonth();
            const d = date.getDate();
            return get_dateformat(new Date(y, m + offset, d))
        }

        const on = (date_range) => {
            return (state.date_range == date_range) ? 'on' : ''
        }

        const change_daterange = (date_range) => {
            state.date_range = date_range;
            switch (date_range) {
                case '3M':
                    state.startDate = date_offset(state.today, -3);
                    break;
                case '6M':
                    state.startDate = date_offset(state.today, -6);
                    break;
                case '1Y':
                    state.startDate = date_offset(state.today, -12);
                    break;
                case '3Y':
                    state.startDate = date_offset(state.today, -36);
                    break;
                case '5Y':
                    state.startDate = date_offset(state.today, -60);
                    break;                                                                
            }

            run();
        }

        const run = () => {
            if (ticker.value == '' || state.startDate == '' || state.endDate == '') {
                return
            }

            // splice로 하면 에러가 난다. 
            // state.prices.splice(0); 
            if (state.prices.length > 0) {
               state.prices = [] 
            }

            fetch(url.value).then(x => x.json()).then(x => {
                state.prices.push(...x);
            });
        }

        return {
            state,
            run,
            ticker,
            name,
            url,
            on,
            change_daterange
        }
    }
}
</script>


<style scoped>
.charter.vcomp {
    padding-top: 20px;
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
    /* border-radius: 10px; */
    overflow: hidden;
}
</style>

<template>
    <div class="charter vcomp">

        <p class="title">{{ title }}</p>

        <Stockpicker/>
        <SearchKeywords/>

        <div class="run" @click.stop="run">차트 불러오기</div>

        <div class="chart">
            <div class="period">
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


            <Line
                v-if="ntrend.length > 0"
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

// const get_ntrend = () => {
//     // const api_url = 'https://openapi.naver.com/v1/datalab/search';

//     // const request_body = {
//     //     startDate: "2017-01-01",
//     //     endDate: "2017-04-30",
//     //     timeUnit: "week",
//     //     keywordGroups: [
//     //         {
//     //             groupName: "삼성전자",
//     //             keywords: [
//     //                 "삼성전자",
//     //                 "반도체"
//     //             ]
//     //         }
//     //     ],
//     //     // device: "pc",
//     //     // ages: [
//     //     //     "1",
//     //     //     "2"
//     //     // ],
//     //     // gender: "f"
//     // };

//     fetch('/naver_trend/v1/datalab/search', {
//         method: 'POST',
//         headers: {
//                     'X-Naver-Client-Id': process.env.VUE_APP_NAVER_CHARTKING_ID,
//                     'X-Naver-Client-Secret': process.env.VUE_APP_NAVER_CHARTKING_SECRET,
//                     'Content-Type': 'application/json'
//                 },
//         body: JSON.stringify(state.ntrend_request)
//     }).then(x=>x.json()).then(console.log)
// }


// get_ntrend();

const stockinfo = useStockinfoStore();
const { prices, ntrend, period } = storeToRefs(stockinfo);

const state = reactive({
    // prices: prices,
    ntrend: ntrend,

    prices: [
        {closePrice:100, localDate: '20220801'},
        {closePrice:150, localDate: '20220802'},
        {closePrice:120, localDate: '20220803'},
        {closePrice:160, localDate: '20220804'}
    ].map(o => {
        const date = o.localDate;
        const y = date.slice(0, 4);
        const m = date.slice(4, 6);
        const d = date.slice(6);
        o.localDate = `${y}-${m}-${d}`;
        // console.log(typeof(date));
        return o
    }),

    // ntrend_request: {
    //     startDate: "2017-01-01",
    //     endDate: "2017-04-30",
    //     timeUnit: "week",
    //     keywordGroups: [
    //         {
    //             groupName: name,
    //             keywords: [
    //                 "삼성전자",
    //                 "반도체"
    //             ]
    //         }
    //     ],
    //     // device: "pc",
    //     // ages: [
    //     //     "1",
    //     //     "2"
    //     // ],
    //     // gender: "f"
    // },

    chartData: computed(() => {
        return {
            datasets: [
                {
                    label: 'price',
                    data: state.prices,
                    // data: prices,
                    parsing: {
                        xAxisKey: 'localDate',
                        yAxisKey: 'closePrice'
                    },
                    borderColor: '#42d392',
                },

                {
                    label: 'sentiment',
                    data: state.ntrend,
                    parsing: {
                        xAxisKey: 'period',
                        yAxisKey: 'ratio'
                    },
                    borderColor: 'black',
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
    // stockinfo.fetch_prices();
    stockinfo.fetch_ntrend();
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

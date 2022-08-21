<template>
  <div class="chart vcomp">
    <div class="loader" @click.stop="load">불러오기</div>
    <!-- <ul>
      <li v-for="(idx, p) in prices" :key="idx">{{p}}</li>
    </ul> -->
    <!-- <div>{{ state.stockinfo.length }}</div> -->
  </div>
</template>

<script>
import { 
  reactive, 
  computed,
  // watch,
  // onMounted, 
} from 'vue';

export default {
  name: 'ChartCompare',
  props: {},

  setup() {
    const state = reactive({
      // url: '/api/chart/domestic/item/005930/day?startDateTime=202203290000&endDateTime=202208140904',
      urlbase: `/api/chart/domestic/item/005930/day?startDateTime=202203290000&endDateTime=202208140904`,
      code: '005930',
      startDate: '20220801',
      endDate: '20220817',
      prices: undefined,
      url: computed(() => {
        return `/api/chart/domestic/item/${state.code}/day?startDateTime=${state.startDate}&endDateTime=${state.endDate}`
      }),
      stockinfo: [],
      stockinfo_pageSize: 60
    });

    const url_stockinfo = (market, page) => {
      return `/api/stocks/marketValue/${market}?page=${page}&pageSize=${state.stockinfo_pageSize}`
    }

    const populate_stockinfo = (market) => {
      fetch(url_stockinfo(market, 1)).then(x => x.json()).then(x => {
        state.stockinfo.push(...x.stocks);
        // const n_page = Math.ceil(x.totalCount / state.stockinfo_pageSize);
        const n_page = 2; 

        for (let i = 2; i <= n_page; i++) {
          fetch(url_stockinfo(market, i)).then(x => x.json()).then(x => {
            state.stockinfo.push(...x.stocks);
          });
        }
      })
    }

    // watch(
    //   () => state.stockinfo, 
    //   (data) => {console.log(data)},
    //   { deep: true }
    // );

    // onMounted(() => {
    // });

    const load = () => {
      populate_stockinfo('KOSPI');
      // fetch_naverstock();
    }

    const fetch_naverstock = () => {
      fetch(state.url).then(x => x.json()).then(x => {
        state.prices = x;
      })
    }

    return {
      state,
      load,
      fetch_naverstock
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart.vcomp > .loader {
  width: calc(100% - 40px);
  height: 50px;
  margin: auto;
  background: black;
  line-height: 50px;
  border-radius: 10px;
  color: white;
}
</style>

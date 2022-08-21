<template>
  <div class="stockpicker vcomp" :class="state.status">
    <div class="backdrop" @click.stop="focused(false)"></div>
    <div class="search_input">
      <input 
        v-model.trim="state.qry" 
        spellcheck="false"
        @input="debounced_search"
        @focus="focused(true)"
        placeholder="종목명 또는 종목코드" />

      <div class="result" v-if="state.search_result.length > 0">
        <div class="item" v-for="(r, idx) in state.search_result" :key="idx" @click="choose(r.item)">
          <div class="code">{{ r.item.itemCode }}</div>
          <div class="name">{{ r.item.stockName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  reactive, 
  computed,
} from 'vue';

import Fuse from 'fuse.js';
import { debounce } from 'lodash';

export default {
  name: 'Stockpicker',
  props: {},

  setup() {
    const state = reactive({
      status: '',
      qry: '',
      stocks_pageSize: 60,
      stocks: [
        {itemCode: '005930', stockName: '삼성전자'},
        {itemCode: '373220', stockName: 'LG에너지솔루션'},
        {itemCode: '000660', stockName: 'SK하이닉스'},
        {itemCode: '207940', stockName: '삼성바이오로직스'},
        {itemCode: '005935', stockName: '삼성전자우'},
        {itemCode: '051910', stockName: 'LG화학'},
        {itemCode: '035420', stockName: 'NAVER'},
      ],
      search_keys: ["itemCode", "stockName"],
      searcher: computed(() => new Fuse(state.stocks, { 
        keys: state.search_keys, 
        // minMatchCharLength: 2
      })),
      search_result: [],
      search_n: 5,
      code: '',
      name: ''
    });

    const url = (market, page) => {
      return `/api/stocks/marketValue/${market}?page=${page}&pageSize=${state.stocks_pageSize}`
    }

    const load_stocks = (market) => {
      fetch(url(market, 1)).then(x => x.json()).then(x => {
        state.stocks.push(...x.stocks);
        const n_page = Math.ceil(x.totalCount / state.stocks_pageSize);
        // const n_page = 2; 

        for (let i = 2; i <= n_page; i++) {
          fetch(url(market, i)).then(x => x.json()).then(x => {
            state.stocks.push(...x.stocks);
          });
        }
      })
    }

    const search = () => {
      state.search_result.splice(0);

      if (state.qry.length == 0) {
        state.code = '';
        state.name = '';
        return
      }

      let results = state.searcher.search(state.qry).slice(0, state.search_n);
      state.search_result.push(...results);
    }

    const focused = (on) => {
      if (on) {
        state.status = 'focused'

      } else {
        state.status = ''
      }
    }

    const choose = (item) => {
      state.code = item.itemCode;
      state.name = item.stockName;
      state.qry = item.stockName;
      focused(false);
    }

    const debounced_search = debounce(search, 500);

    // load_stocks('KOSPI');
    // load_stocks('KOSDAQ');

    return {
      state,
      load_stocks,
      search,
      debounced_search,
      focused,
      choose,
    }
  }
}
</script>

<style scoped>
.stockpicker.vcomp {
  padding-top: 20px;
}

.stockpicker.vcomp > .search_input {
    width: 100%;
    /* background: orange; */
    box-sizing: border-box;
    height: 60px;
    position: relative;
}

.stockpicker.vcomp > .search_input > input {
  width: calc(100% - 40px);
  height: 100%;
  line-height: 60px;
  text-indent: 20px;
  outline: 0;
  border: 1px solid black;
  padding: 0;
  box-sizing: border-box;
  border-radius: 10px;
  /* text-align: center; */
  font-size: 20px;
  font-weight: bold;
}

.stockpicker.vcomp > .search_input > input::placeholder {
  color: rgba(0,0,0,0.3);
  font-size: 15px;
  font-weight: normal;
}

.stockpicker.vcomp.focused > .search_input > input {
  box-shadow: 0 0 100px rgb(0, 0, 0, 0.5);
  border: 0;
  outline: 5px solid #3492ff;
  color: #3492ff;
}

.stockpicker.vcomp > .backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
  /* background: rgba(255, 255, 255, 0.5); */
  opacity: 0;
  pointer-events: none;
  transition: all 0.1s;
}

.stockpicker.vcomp.focused > .backdrop {
  opacity: 1;
  pointer-events: auto;
}

.stockpicker.vcomp > .search_input > .result {
  position: absolute;
  top: calc(100% + 20px);
  left: 20px;
  width: calc(100% - 40px);
  border-radius: 10px;
  overflow: hidden;
  background: white;
  /* border: 1px solid rgba(0,0,0,0.1); */
  box-sizing: border-box;
  text-align: left;
  opacity: 0;
  pointer-events: none;
}

.stockpicker.vcomp.focused > .search_input > .result {
  opacity: 1;
  pointer-events: auto;
}

.stockpicker.vcomp > .search_input > .result > .item {
  width: 100%;
  height: 80px;
  line-height: 80px;
  /* background: lightblue; */
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.stockpicker.vcomp > .search_input > .result > .item:last-child {
  border: 0;
}

.stockpicker.vcomp > .search_input > .result > .item > .code {
  width: 100%;
  height: 40px;
  line-height: 60px;
  /* background: orange; */
  font-size: 12px;
  padding-left: 22px;
}

.stockpicker.vcomp > .search_input > .result > .item > .name {
  width: 100%;
  height: 40px;
  line-height: 20px;
  /* background: lightblue; */
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
}
</style>

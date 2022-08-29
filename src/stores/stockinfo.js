import { defineStore } from 'pinia'
import { ref, computed, watchEffect } from "vue";
import _ from 'lodash'

export const useStockinfoStore = defineStore('stockinfo', () => {
    const name = ref('');
    const ticker = ref('');
    const keywords = ref([]);
    const prices = ref([]);
    const ntrend = ref([]);
    
    const period = ref('3M');
    const now = ref(new Date());
    const endDate = computed(() => _offset_by_month(now.value, 0));
    
    const startDate = computed(() => {
        switch(period.value) {
            case '3M':
            default:
                return _offset_by_month(now.value, -3)

            case '6M':
                return _offset_by_month(now.value, -6)
            
            case '1Y':
                return _offset_by_month(now.value, -12)

            case '3Y':
                return _offset_by_month(now.value, -36)

            case '5Y':
                return _offset_by_month(now.value, -60)
        }
    })

    const url_stockprice = computed(() => {
        const _start = _date_format(startDate.value, 'yyyymmdd');
        const _end = _date_format(endDate.value, 'yyyymmdd');
        return `/naver_stock/api/chart/domestic/item/${ticker.value}/day?startDateTime=${_start}&endDateTime=${_end}`
    })

    const url_ntrend = ref('/naver_trend/v1/datalab/search');

    const ntrend_rbody = computed(() => {
        return {
            startDate: _date_format(startDate.value, 'yyyy-mm-dd'),
            endDate: _date_format(endDate.value, 'yyyy-mm-dd'),
            timeUnit: "date",
            keywordGroups: [
                {
                    groupName: name.value,
                    keywords: keywords.value
                }
            ],
            // device: "pc",
            // ages: [
            //     "1",
            //     "2"
            // ],
            // gender: "f"
        }
    })

    function add_keyword(w) {
        keywords.value.push(w);
    }

    function remove_keyword(idx) {
        keywords.value.splice(idx, 1);
    }

    function change_period(p) {
        period.value = p;
    }

    function _date_format(date, fmt) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        
        if (fmt == 'yyyymmdd') {
            return `${y}${m}${d}`

        } else if (fmt == 'yyyy-mm-dd') {
            return `${y}-${m}-${d}`
        }
    }


    function _offset_by_month(date, offset) {
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        return new Date(y, m + offset, d)
    }

    async function fetch_prices() {
        if (!ticker.value || !startDate.value || !endDate.value) {
            return
        }

        // splice로 하면 에러가 난다. 
        // state.prices.splice(0); 
        // if (prices.value.length > 0) {
        //     prices.value = [] 
        // }

        await fetch(url_stockprice.value).then(x => x.json()).then(x => {
            // prices.value.push(...x);
            prices.value = x;
        });
    }

    async function fetch_ntrend() {
        if (!name.value || !keywords.value) {
            console.log(1111);
            return
        }

        await fetch(url_ntrend.value, {
            method: 'POST',
            headers: {
                'X-Naver-Client-Id': process.env.VUE_APP_NAVER_CHARTKING_ID,
                'X-Naver-Client-Secret': process.env.VUE_APP_NAVER_CHARTKING_SECRET,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ntrend_rbody.value)

        }).then(x => x.json()).then(x => {
            // console.log(x);
            ntrend.value = x.results[0].data.map(o => {
                o.localDate = o.period.replace(/-/gi, '');
                return o
            });
        })
    }


    async function fetch_all() {
        await fetch_prices();
        await fetch_ntrend();
        ntrend.value = _.intersectionBy(ntrend.value, prices.value, 'localDate');
    }


    watchEffect(async () => {
        if (name.value.length > 0) {
            add_keyword(name.value);
        }
    })

  
    return { 
        name, 
        ticker, 
        keywords, 
        prices,
        ntrend,
        add_keyword, 
        remove_keyword, 
        fetch_prices,
        fetch_ntrend,
        fetch_all,
        change_period,
        now,
        startDate,
        endDate,
        period,
        url_stockprice,
        url_ntrend,
        ntrend_rbody
    }
})
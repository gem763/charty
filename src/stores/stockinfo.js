import { defineStore } from 'pinia'
import { ref } from "vue";

export const useStockinfoStore = defineStore('stockinfo', () => {
    const name = ref('');
    const ticker = ref('');

    // function increment() {
    //     count.value++
    // }
  
    return { name, ticker }
})
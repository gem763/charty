<template>
    <div class="search-keywords">
        <div class="subject"><strong><u>STEP 2</u></strong> 센티멘트 측정을 위한 네이버 검색어 추가하기</div>

        <div class="input">
            <input 
            v-model.trim="qry" 
            spellcheck="false"
            placeholder="네이버 검색어" />

            <div class="adder" @click="add_keyword">
                <img src="../assets/plus.png">
            </div>
        </div>

        <div class="keywords" v-if="stockinfo.keywords.length > 0">
            <div class="word" v-for="(w, idx) in stockinfo.keywords" :key="idx">
                {{ w }}
                <div class="close" @click="remove_keyword(idx)">
                    <img src="../assets/close.png">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStockinfoStore } from '@/stores/stockinfo'

const stockinfo = useStockinfoStore();
const qry = ref('');

const remove_keyword = (idx) => {
    stockinfo.remove_keyword(idx);
}

const add_keyword = () => {
    if (qry.value.length > 0) {
        stockinfo.add_keyword(qry.value);
        qry.value = '';
    }
}
</script>

<style scoped>
.search-keywords {
    width: 100%;
    padding-top: 20px;
}

.search-keywords > .subject {
    text-align: left;
    padding-left: 25px;
    padding-bottom: 5px;
    font-size: 13px;
}

.search-keywords > .keywords {
    width: 100%;
    /* background: rgba(0, 0, 0, 0.1); */
    padding: 20px;
    box-sizing: border-box;
    text-align: left;
    font-size: 13px;
    color: black;
}

.search-keywords > .keywords > .word {
    padding: 10px 30px 10px 10px;
    margin: 0 10px 10px 0;
    display: inline-block;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
    /* background: #42d392; */
    box-sizing: border-box;
    position: relative;
}

.search-keywords > .keywords > .word > .close {
    position: absolute;
    top: calc(50% - 1px);
    right: 5px;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    /* background: orange; */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.2;
}

.search-keywords > .keywords > .word > .close > img {
    width: 15px;
    height: 15px;
}

.search-keywords > .input {
    width: 100%;
    /* background: orange; */
    box-sizing: border-box;
    height: 50px;
    position: relative;
}

.search-keywords > .input > input {
    width: calc(100% - 40px);
    height: 100%;
    line-height: 50px;
    text-indent: 20px;
    outline: 0;
    padding: 0;
    box-sizing: border-box;
    border-radius: 10px;
    font-size: 15px;
    font-weight: bold;
    background: #f1f1f1;
    border: 0;
}

.search-keywords > .input > input::placeholder {
    color: rgba(0,0,0,0.3);
    font-size: 15px;
    font-weight: normal;
}

.search-keywords > .input > .adder {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 50px;
    height: 50px;
    /* background: orange; */
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-keywords > .input > .adder > img {
    width: 25px;
    height: 25px;
}
</style>

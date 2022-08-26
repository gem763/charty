<template>
  <MasterHead/>
  <!-- <Stockpicker/> -->
  <Charter/>
</template>

<script>
import MasterHead from './components/MasterHead.vue';
// import Stockpicker from './components/Stockpicker.vue';
import Charter from './components/Charter.vue';

export default {
  name: 'App',
  components: {
    MasterHead,
    // Stockpicker,
    Charter
}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap');

#app {
  font-family: Helvetica;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  /* padding-top: 200px; */
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}
</style>

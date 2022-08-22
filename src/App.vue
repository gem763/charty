<template>
  <MasterHead/>
  <Stockpicker/>
  <Charter/>
</template>

<script>
import MasterHead from './components/MasterHead.vue';
import Stockpicker from './components/Stockpicker.vue';
import Charter from './components/Charter.vue';

export default {
  name: 'App',
  components: {
    MasterHead,
    Stockpicker,
    Charter
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  padding-top: 200px;
  height: 100vh;
  box-sizing: border-box;
}
</style>

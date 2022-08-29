<template>
  <div class="header vcomp" ref="header">
    <div class="logo">
      <div class="bg"></div>
      <img class='logopix' src="../assets/logo.png">
      <div class="title">차트킹</div>
      <div class="version">beta</div>
    </div>

    <div class="topheader" :class="{on: topheader_on}">
      <div class="logo">
        <div class="title">차트킹</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const header = ref(null);
const hgap = ref(0);
const topheader_on = ref(false);

onMounted(() => {
  document.querySelector('#app').addEventListener('scroll', recal_hgap);
})

const recal_hgap = () => {
  // let target = e.target;
  let rect = header.value.getBoundingClientRect();
  hgap.value = rect.top + rect.height;

  if (hgap.value < 0) {
    topheader_on.value = true;

  } else {
    topheader_on.value = false;
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header.vcomp {
  /* position: fixed; */
  /* top: 0; */
  width: 100%;
  height: 200px;
  color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
}

.header.vcomp > .logo {
  width: 150px;
  height: 150px;
  /* background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff); */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.header.vcomp > .logo > .bg {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient( -45deg, #647eff 50%, #42d392 50% );
  filter: blur(30px);
  border-radius: 200px;
}

.header.vcomp > .logo > .title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 40px;
  font-weight: bold;
  letter-spacing: -4px;
  color: white;
}

.header.vcomp > .logo > img.logopix {
  filter: invert(1);
  width: 40px;
  margin-bottom: -5px;
}

.header.vcomp > .logo > .version {
  font-size: 15px;
  margin-top: -5px;
}

/* .header.vcomp > .title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 40px;
  font-weight: bold;
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -4px;
} */

.header.vcomp > .topheader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  opacity: 0;
  transform: translateY(-70px);
  transition: all 0.5s;
  z-index: 3;
}

.header.vcomp > .topheader.on {
  opacity: 1;
  transform: none;
}

.header.vcomp > .topheader > .logo {
  position: absolute;
  top: 5px;
  left: 20px;
  /* width: 100px; */
  height: 50px;
  /* background: orange; */
  line-height: 50px;
  /* background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff); */
}

.header.vcomp > .topheader > .logo > .title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: -4px;
  color: white;
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  padding-right: 5px;
}
</style>

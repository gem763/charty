<template>
  <div class="masterfoot">
    <div class="logo">*</div>
    <div class="txt">created by <strong>quantlab</strong> @2022</div>
    <!-- <div class="design"></div> -->
  </div>
</template>

<script setup>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.masterfoot {
  position: relative;
  /* position: fixed; */
  /* top: 0; */
  width: 100%;
  height: 200px;
  background: white;
  /* color: white; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  font-size: 12px;
  overflow: hidden;
  /* letter-spacing: -0.5px; */
}

.masterfoot > .logo {
  font-size: 80px;
  line-height: 64px;
  /* padding-top: 40px; */
  -webkit-animation-name: rotate;
  animation-name: rotate;
  -webkit-animation-duration: 4s;
  animation-duration: 4s;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  /* margin: 0; */
  width: 30px;
  height: 30px;
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.masterfoot > .txt {
  padding-top: 5px;
}

.masterfoot > .design {
  width: 150px;
  height: 150px;
  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
  border-radius: 300px;
}

@keyframes rotate {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
}
</style>

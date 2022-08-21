<template>
  <div class="header vcomp">
    <img class='logo' src="../assets/logo.png">
    <div class="title">차트킹</div>
  </div>
</template>

<script>
export default {
  name: 'MasterHead',
  props: {
    // msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header.vcomp {
  position: fixed;
  top: 0;
  width: 100%;
  height: 250px;
  background: #3492ff;
  color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 20px 0 50px 0;
  box-sizing: border-box;
  border-bottom: 1px solid black;
}

.header.vcomp > img.logo {
    filter: invert(1);
    width: 80px;
    margin: 10px;
}

.header.vcomp > .title {
  font-size: 32px;
  font-weight: bold;
}
</style>

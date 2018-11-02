<template>
  <div>
    <div class="sider-container">
      <app-sider></app-sider>
    </div>
    <div class='nav-container'>
      <app-nav></app-nav>
    </div>
    <div class="main-container">
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import AppSider from "./AppSider.vue";
import AppNav from "./AppNav.vue";
import AppMain from './AppMain.vue';
export default {
  name: "layout",
  components: {
    AppNav,
    AppSider,
    AppMain
  }
};
</script>
<style lang="scss" scoped>
.sider-container {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0;
  width: 180px;
  background-color: $Ebony-Clay;
}
.nav-container {
  position: absolute;
  left: 180px;
  right: 0;
  top: 0;
  height: 40px;
  border-bottom: 1px solid $Mischka;
}
.main-container {
  position: absolute;
  left: 180px;
  right: 0;
  top: 40px;
  height: calc(100% - 50px);
  bottom: 0;
  overflow: hidden;
  background-color: $Aqua-Haze;
  padding: 10px 0 0 15px;
}
</style>

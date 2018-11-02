import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import axios from "@/assets/js/request";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/icon/iconfont.css"; //加载第三方incnfont
import "@/assets/css/reset.css"; //css初始化，消除不同浏览器差异化
import "@/assets/css/color.scss"; //所有颜色变量css

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

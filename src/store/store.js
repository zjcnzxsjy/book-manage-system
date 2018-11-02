import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app.js";
import getters from "./getters.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app
  },
  getters
});

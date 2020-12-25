import Vue from 'vue';
import Vuex from 'vuex';
import geyser from "./modules/geyser";
import profile from "./modules/profile";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        geyser,
        profile
    }
});

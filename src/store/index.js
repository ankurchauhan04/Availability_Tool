import Vue from 'vue'
import Vuex from 'vuex'
import time from './modules/time'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    time
  },
  plugins: [
    createPersistedState({
    key: 'availability'
    })
  ]
})

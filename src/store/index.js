import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    num: 0,
  },
  mutations: {
    addCount(state) {
      state.count++
    },
    addNum(state) {
      state.num++
    },
  },
  actions: {
    asyncAddNum({ commit }) {
      setInterval(() => {
        commit('addNum')
      }, 1000)
    },
  },
})

import Vue from 'vue'
import Vuex from './kstore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    num: 0,
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  mutations: {
    addCount(state, payload) {
      state.count += payload
    },
    addNum(state, payload) {
      state.num += payload
    },
  },
  actions: {
    asyncAddNum({ commit }, payload) {
      setInterval(() => {
        commit('addNum', payload)
      }, 1000)
    },
  },
})

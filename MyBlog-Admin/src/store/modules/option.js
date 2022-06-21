import { listAllOptions } from '@/api/option'

// 博客设置

const state = {
  options: {}
}

const mutations = {
  SET_OPTIONS: (state, options) => {
    state.options = options
  }
}

const actions = {
  changeOptions({ commit }, data) {
    commit('SET_OPTIONS', data)
  },

  getOptions({ commit }) {
    return new Promise((resolve, reject) => {
      listAllOptions().then(response => {
        const { status, data } = response

        if (status !== 200) {
          return reject('获取博客设置出错')
        }

        commit('SET_OPTIONS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

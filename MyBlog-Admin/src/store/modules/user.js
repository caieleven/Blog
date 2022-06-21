import { login, checkLogin, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { jsonObj2FormData } from '@/utils'

const getDefaultState = () => {
  return {
    isLogin: false,
    user: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ISLOGIN: (state, isLogin) => {
    state.isLogin = isLogin
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const dataForm = jsonObj2FormData(userInfo)
    return new Promise((resolve, reject) => {
      login(dataForm).then(response => {
        const { data } = response
        commit('SET_ISLOGIN', true)
        commit('SET_USER', data)
        // 获取博客设置
        // dispatch('option/getOptions', {}, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // check user's login status
  checkLogin({ commit }) {
    return new Promise((resolve, reject) => {
      checkLogin().then(response => {
        const { data } = response

        if (!data.isLogin) {
          return reject('用户未登录！')
        }

        commit('SET_ISLOGIN', true)
        resolve(true)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { status, data } = response
        if (status !== 200) {
          return reject('用户未认证，请登录！')
        }
        commit('SET_USER', data)
        // 获取博客设置
        // dispatch('option/getOptions', {}, { root: true })
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        // removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
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


import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const isLogin = store.getters.isLogin
  if (isLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasUserInfo = store.getters.user && Object.keys(store.getters.user).length !== 0
      const hasOptions = store.getters.options && Object.keys(store.getters.options).length !== 0
      if (hasUserInfo && hasOptions) {
        next()
      } else {
        try {
          if (!hasUserInfo) {
            await store.dispatch('user/getInfo')
          }
          if (!hasOptions) {
            await store.dispatch('option/getOptions')
          }
          next()
        } catch (error) {
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      try {
        // check user's login status
        await store.dispatch('user/checkLogin')
        // logged in, get user info
        await store.dispatch('user/getInfo')
        await store.dispatch('option/getOptions')
        next()
      } catch (error) {
        // Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

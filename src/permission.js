import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/forgetPwd'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断是否已登录
  if (getToken()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.id
      // 判断是否新页面
      if (!(hasGetUserInfo == null || hasGetUserInfo === '')) {
        next()
      } else {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* has no token */
    /* 白名单*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
  // next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

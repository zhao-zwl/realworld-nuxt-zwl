import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _614b070c = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _d17eeba2 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _51090419 = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _0bff3259 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _05272973 = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _78e8ba86 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _1a6d14b4 = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _614b070c,
    children: [{
      path: "",
      component: _d17eeba2,
      name: "home"
    }, {
      path: "/login",
      component: _51090419,
      name: "login"
    }, {
      path: "/register",
      component: _51090419,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _0bff3259,
      name: "profile"
    }, {
      path: "/settings",
      component: _05272973,
      name: "settings"
    }, {
      path: "/editor",
      component: _78e8ba86,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _1a6d14b4,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}

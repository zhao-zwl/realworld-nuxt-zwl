/*
 * nuxt.js 配置文件
 */

module.exports = {
    /*
     ** Nuxt.js modules
     */
    modules: ["@nuxtjs/axios"],
    /*
     ** axios proxy
     */
    axios: {
        proxy: true
    },
    /*
     ** proxy
     */
    proxy: {
        "/api": "https://conduit.productionready.io"
    },
    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {
        vendor: ["axios"]
    },
    router: {
        extendRoutes(routes, resolve) {
            //清除默认你路由表
            routes.splice(0)
            routes.push(...[{
                path: '/',
                component: resolve(__dirname, 'pages/layout/'),
                children: [{
                    path: '',
                    name: "home",
                    component: resolve(__dirname, 'pages/home/')
                }, {
                    path: '/login',
                    name: "login",
                    component: resolve(__dirname, 'pages/login/')
                }, {
                    path: '/register',
                    name: "register",
                    component: resolve(__dirname, 'pages/login/')
                }, {
                    path: '/profile/:username',
                    name: "profile",
                    component: resolve(__dirname, 'pages/profile/')
                }, {
                    path: '/settings',
                    name: "settings",
                    component: resolve(__dirname, 'pages/settings/')
                }, {
                    path: '/editor',
                    name: "editor",
                    component: resolve(__dirname, 'pages/editor/')
                }, {
                    path: '/article/:slug',
                    name: "article",
                    component: resolve(__dirname, 'pages/article/')
                }]
            }])
        }
    },
    server: {
        host: '0.0.0.0',
        port: 8000
    },
    plugins: ['@/plugins/request.js', '@/plugins/dayjs.js'],
    head: {
        title: 'conduit',
        meta: [{
                charset: 'utf-8'
            },
            {
                hid: 'keywords',
                name: 'keywords',
                content: 'conduit'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'conduit'
            }
        ],
    },
}

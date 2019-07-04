import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Axios from 'axios';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


const role_edit = () => import('@/views/menu/menu1/menu1-2/complex-table')
const personal_edit = () => import('@/views/menu/menu4/menu4-2')
const need_edit = () => import('@/views/menu/menu2/menu2-2')
const helppeople_edit = () => import('@/views/menu/menu4/menu4-1')
const helpZ_edit = () => import('@/views/menu/menu3/menu3-3/complex-table')
const workdata_edit = () => import('@/views/menu/menu3/menu3-2')
const road_edit = () => import('@/views/menu/menu3/menu3-1')
const school_edit = () => import('@/views/menu/menu2/menu2-1/complex-table')
const power_edit = () => import('@/views/menu/menu1/menu1-1')







export const constantRoutes = [
  {

    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
 

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }


  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  
  routes: constantRoutes
  
})


//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRoutes = [
  {
    path: '/menu',
    component: Layout,
    alwaysShow: true,
    redirect: '/menu/index',
    meta: {
      title: '系统管理',
      icon: 'nested'
     
    },

    children: [
      {
        path: '/menu1',
        name: 'Menu1',
        meta: { title: '系统管理', roles: [ 'power_edit','role_edit'] },
        component: () => import('@/views/menu/menu1'),

        children: [
          {

            path: '/menu1-1',
            name: 'Menu1-1',
            meta: { title: '权限管理', roles: ['power_edit'] },
            component: power_edit


          },
          {
            path: '/menu1-2',
            component: role_edit,
            name: 'Menu1-2',
            meta: { title: '角色管理', roles: ['role_edit'] }
          }

        ]
      },
      {
        path: '/menu2',
        name: 'Menu2',
        component: () => import('@/views/menu/menu2'),
        meta: { title: '援藏高校',  roles: ['school_edit', 'need_edit']},
        alwaysShow: true,
        children: [
          {
            path: '/menu2-1',
            component: school_edit,
            name: 'Menu2-1',
            meta: { title: '学校管理',  roles: ['school_edit'] }
          },
          {
            path: '/menu2-2',
            component: need_edit,
            name: 'Menu2-2',
            meta: { title: '援藏需求',  roles: ['need_edit'] }
          }

        ]
      },
      {
        path: '/menu3',
        name: 'Menu3',
        meta: { title: '援藏工作',  roles: ['road_edit', 'workdata_edit','helpZ_edit'] },
        alwaysShow: true,
        component: () => import('@/views/menu/menu3'),
        children: [
          {
            path: '/menu3-1',
            component: road_edit,
            name: 'Menu3-1',
            meta: { title: '路线管理' ,  roles: ['road_edit']}
          },
          {
            path: '/menu3-2',
            component: workdata_edit,
            name: 'Menu3-2',
            meta: { title: '工作动态' ,  roles: ['workdata_edit']}
          },
          {
            path: '/menu3-3',
            component: helpZ_edit,
            name: 'Menu3-3',
            meta: { title: '援藏政策',  roles: ['helpZ_edit'] }
          }
        ]
      },
      {
        path: '/menu4',
        name: 'Menu4',
        component: () => import('@/views/menu/menu4'),
        meta: { title: '招聘管理',  roles: ['helppeople_edit', 'personal_edit'] },
        alwaysShow: true,
        children: [
          {
            path: '/menu4-1',
            component: helppeople_edit,
            name: 'Menu4-1',
            meta: { title: '援藏人员' ,  roles: ['helppeople_edit']}
          },
          {
            path: '/menu4-2',
            component: personal_edit,
            name: 'Menu4-2',
            meta: { title: '人才引进' ,  roles: ['personal_edit']}
          }

        ]
      }
    ]
  },
 
  { path: '*', redirect: '/404', hidden: true }
];




const router = createRouter(console.log('路由'))

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {

  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

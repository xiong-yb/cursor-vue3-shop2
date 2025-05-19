import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import Cart from '@/views/Cart.vue'
import Orders from '@/views/Orders.vue'
import Design from '@/views/Design.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/About.vue')
        },
        {
          path: 'products',
          name: 'products',
          component: Products
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('@/views/News.vue')
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/Contact.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/Profile.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'cart',
          name: 'cart',
          component: Cart,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'orders',
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: 'design/:productId?',
          name: 'design',
          component: Design,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders/:id',
          name: 'orderDetail',
          component: () => import('@/views/OrderDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/products/:id',
          name: 'product-detail',
          component: () => import('@/views/ProductDetail.vue'),
          meta: {
            title: '产品详情'
          }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    // 如果需要登录但未登录，保存目标路由并重定向到首页
    next({ 
      name: 'home',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router 
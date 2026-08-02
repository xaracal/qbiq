import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { focusMainContent, setPageTitle } from '@/lib/page-title'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/pages/ProductListPage.vue'),
    meta: { title: 'Products' },
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/pages/ProductDetailPage.vue'),
    meta: { title: 'Product details' },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/pages/CartPage.vue'),
    meta: { title: 'Shopping cart' },
  },
  {
    path: '/checkout/success/:orderId',
    name: 'checkout-success',
    component: () => import('@/pages/CheckoutSuccessPage.vue'),
    meta: { title: 'Order confirmed' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  setPageTitle(typeof to.meta.title === 'string' ? to.meta.title : undefined)
  focusMainContent()
})

export default router

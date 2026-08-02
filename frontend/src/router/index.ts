import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/pages/ProductListPage.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/pages/ProductDetailPage.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage.vue'),
    },
    {
      path: '/checkout/success/:orderId',
      name: 'checkout-success',
      component: () => import('@/pages/CheckoutSuccessPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

export default router

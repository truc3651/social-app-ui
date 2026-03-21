import { createRouter, createWebHistory } from 'vue-router'
import { getCookie } from '@/utils/localStorage'
import { ACCESS_TOKEN } from '@/utils/constants'

const LoginPage = () => import('@/pages/auth/LoginPage.vue')
const RegisterPage = () => import('@/pages/auth/RegisterPage.vue')
const ForgotPasswordPage = () => import('@/pages/auth/ForgotPasswordPage.vue')
const NewsfeedPage = () => import('@/pages/posts/NewsfeedPage.vue')
const ProfilePage = () => import('@/pages/profile/ProfilePage.vue')
const SessionManagementPage = () => import('@/pages/profile/SessionManagementPage.vue')
const FriendsPage = () => import('@/pages/connections/FriendsPage.vue')
const SuggestionsPage = () => import('@/pages/connections/SuggestionsPage.vue')
const BlockedUsersPage = () => import('@/pages/connections/BlockedUsersPage.vue')
const TaggedPostsPage = () => import('@/pages/posts/TaggedPostsPage.vue')

const PUBLIC_ROUTES = ['login', 'register', 'forgot-password']

const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage },
  { path: '/', name: 'newsfeed', component: NewsfeedPage, meta: { requiresAuth: true } },
  { path: '/profile/:userId', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/profile/sessions', name: 'session-management', component: SessionManagementPage, meta: { requiresAuth: true } },
  { path: '/friends', name: 'friends', component: FriendsPage, meta: { requiresAuth: true } },
  { path: '/friends/suggestions', name: 'friend-suggestions', component: SuggestionsPage, meta: { requiresAuth: true } },
  { path: '/friends/blocked', name: 'blocked-users', component: BlockedUsersPage, meta: { requiresAuth: true } },
  { path: '/posts/tagged', name: 'tagged-posts', component: TaggedPostsPage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = getCookie(ACCESS_TOKEN)
  const hasToken = !!token

  if (to.meta.requiresAuth && !hasToken) {
    return { name: 'login' }
  }

  if (PUBLIC_ROUTES.includes(to.name) && hasToken) {
    return { name: 'newsfeed' }
  }
})

export default router

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') }
    ]
  },
  {
    path: '/requests',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RequestsPage.vue') }
    ]
  },
  {
    path: '/request',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':requestId', component: () => import('pages/EditRequestPage.vue') }
    ]
  },
  {
    path: '/assigned',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AssignedRequestsPage.vue') }
    ]
  },
  {
    path: '/newrequest',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/NewRequestPage.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/SignIn.vue'),
  },
{
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') }
    ]
  },
  {
    path: '/reports',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ReportsPage.vue') }
    ]
  },
  {
    path: '/knowledge',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/KnowledgePage.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ManageUserPage.vue') }
    ]
  },
  {
    path: '/createuser',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CreateUserPage.vue') }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SettingsPage.vue') }
    ]
  },
  {
    path: '/maincategories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MainCategoriesPage.vue') }
    ]
  },
  {
    path: '/hardwarecategories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HardwCategories.vue') }
    ]
  },
  {
    path: '/softwarecategories',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SoftwareCategoriesPage.vue') }
    ]
  },
]

export default routes
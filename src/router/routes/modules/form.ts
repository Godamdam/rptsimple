import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FORM: AppRouteRecordRaw = {
  path: '/form',
  name: 'form',
  redirect: '/form/step',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.form',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/form/group/index.vue'),
      meta: {
        locale: 'menu.form.group',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'step',
      name: 'step',
      component: () => import('@/views/form/step/index.vue'),
      meta: {
        locale: 'menu.form.step',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default FORM;

import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const VISUALIZATION: AppRouteRecordRaw = {
  path: '/carbon',
  name: 'carbon',
  redirect: '/carbon/summary',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.carbon',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 2,
  },
  children: [
    {
      path: 'summary',
      name: 'summary',
      component: () => import('@/views/carbon/summary/index.vue'),
      meta: {
        locale: 'menu.carbon.overviewCarbonEmissions',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'data-manage',
      name: 'DataManage',
      component: () => import('@/views/carbon/data-manage/index.vue'),
      meta: {
        locale: 'menu.carbon.dataManage',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default VISUALIZATION;

import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useCarbonStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupCarbonInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const carbonStore = useCarbonStore();
    if (isLogin()) {
      if (carbonStore.carbonRecords) {
        next();
      } else {
        try {
          // console.log('carbonstore info ');
          await carbonStore.info();
          // console.log("@@@@");
          next();
        } catch (error) {
          // next({
          //   name: 'login',
          //   query: {
          //     redirect: to.name,
          //     ...to.query,
          //   } as LocationQueryRaw,
          // });
          // console.log('before carbon router err');
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}

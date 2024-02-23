import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useCarbonStore from './modules/carbon';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useCarbonStore };
export default pinia;

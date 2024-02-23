import Mock from 'mockjs';

import './user';
import './message-box';

import '@/views/visualization/data-analysis/mock';
import '@/views/visualization/multi-dimension-data-analysis/mock';
import '@/views/carbon/data-manage/mock';
import '@/views/carbon/summary/mock';

Mock.setup({
  timeout: '600-1000',
});

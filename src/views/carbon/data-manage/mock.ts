import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams, PostData } from '@/types/global';
import { CarbonParams, CarbonRecord } from '@/api/dataManage';
import { start } from 'nprogress';
import { update } from 'lodash';

const { Random } = Mock;

// index: string;
// emissions: number;
// processEmissions: string;
// powerConsumption: string;
// purchasedPower: string;
// powerGeneration: string;
// PVPowerGeneration: string;
// output: string;
// line: string;
// productor: string;
// status: string;
// createdTime: string;

const data = Mock.mock({
  'list|55': [
    {
      'index|+1': 3,
      'emissions|2-3': /[0-9]/,
      'processEmissions|2-3': /[0-9]/,
      'powerConsumption|2-3': /[0-9]/,
      'purchasedPower|2-3': /[0-9]/,
      'powerGeneration|2-3': /[0-9]/,
      'PVPowerGeneration|2-3': /[0-9]/,
      'output|2-3': /[0-9]/,
      'status|1': ['online', 'offline'],
      'productor|1': ['wnc', 'ysgs', 'ydgs', 'dags', 'ydgs', 'lpgs'],
      'line|1': ['#1', '#2', '#7', '#8'],
      'createdTime': Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    // 碳排放list
    Mock.mock(new RegExp('/api/carbon/carbon-data'), (params: GetParams) => {
      console.log(params);
      const {
        current = 1,
        pageSize = 10,
        productor,
        line,
        status,
        startTime,
        endTime,
      } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      const reslist = (data.list as CarbonRecord[]).filter((item) => {
        return (
          (productor ?? false ? productor === item.productor : true) &&
          (line ?? false ? line === item.line : true) &&
          (status ?? false ? status === item.status : true) &&
          (startTime ?? false ? startTime < item.createdTime : true) &&
          (endTime ?? false ? endTime > item.createdTime : true)
        );
      });
      const list = reslist.slice((p - 1) * ps, p * ps);
      const total = reslist.length;
      return successResponseWrap({
        list,
        total,
      });
    });

    // 创建碳排放数据
    Mock.mock(new RegExp('/api/carbon/carbon-create'), (params: PostData) => {
      // console.log('postparams', params);
      const deParams = qs.parse(params.body);
      // console.log('de', deParams);
      return successResponseWrap({
        record: params || [],
        created: true,
      });
    });

    // 修改碳排数据
    Mock.mock(new RegExp('/api/carbon/carbon-update'), (params: PostData) => {
      // console.log('update', params);

      const record = qs.parse(params.body);
      // console.log('record', record);

      return successResponseWrap({
        record: record || [],
        updated: true,
      });
    });
  },
});

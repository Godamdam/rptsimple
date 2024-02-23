import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import dayjs from 'dayjs';


let index = 0;
const day = 400;
const generateUniqueDatetime = () => {
  let start = Math.round(new Date().getTime() / 1000);
  start -= 3600 * 24 * index;
  const temp = new Date(start * 1000);
  const dateTime = temp.toLocaleString();
  index = (index + 1) % day;
  return dateTime;
};
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
const dayOfYear = dayjs().diff(dayjs().year(), 'day');
// console.log("dayOfYear",dayOfYear,dayjs().year());

const data = Mock.mock({
  'list|7': [
    {
      'productor|+1': ['wnqgf', 'wnc', 'ysgs', 'ydgs', 'dags', 'rjgs', 'lpgs'],
      [`emission|${dayOfYear}`]: [
        {
          'value|0-300': 1,
        },
      ],
    },
  ],
});

const carbonInfo = Mock.mock({
  'list|500': [
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
      'productor|1': ['wnc', 'ysgs', 'rjgs', 'dags', 'ydgs', 'lpgs'],
      'line|1': ['#1', '#2', '#7', '#8'],
      'createdTime': generateUniqueDatetime,
    },
  ],
});

setupMock({
  setup() {
    // 碳排放热力图
    Mock.mock(
      new RegExp('/api/carbon/summary/EmissionCalendar'),
      (params: GetParams) => {
        const { year } = qs.parseUrl(params.url).query;
        return successResponseWrap({
          list: data.list,
        });
      }
    );

    // 碳排放listinfo
    Mock.mock(new RegExp('/api/carbon/summary/info'), (params: GetParams) => {
      const { year } = qs.parseUrl(params.url).query;
      return successResponseWrap({
        list: carbonInfo.list,
      });
    });
  },
});

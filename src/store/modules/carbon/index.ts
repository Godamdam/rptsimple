import { defineStore } from 'pinia';
// import {
//   login as userLogin,
//   logout as userLogout,
//   getUserInfo,
//   LoginData,
// } from '@/api/user';
import {
  CarbonSearchParams,
  productorRank,
  queryCarbonInfo,
} from '@/api/dataSummary';

import dayjs from 'dayjs';
import { CarbonRecord, CarbonState } from './types';

export interface ChartDataRecord {
  x: string;
  y: number;
  name: string;
}

export interface EmissionDayDetail {
  productor?: string;
  line?: string;
  output?: string;
  emissions?: string;
  processEmissions?: string;
  powerConsumption?: string;
  boundaryEmission?: string;
}

export interface EmissionMonthDetail {
  emissions: number;
  processEmissions: number;
  powerConsumption: number;
  boundaryEmission: number;
  totalEmisssion: number;
  tb: string;
  m: string;
}

export interface PublicOpinionAnalysis {
  quota: string;
}
export interface PublicOpinionAnalysisRes {
  count: number;
  growth: number;
  chartData: ChartDataRecord[];
  accYear: number;
  accMonth: number;
}

const useCarbonStore = defineStore('carbon', {
  state: (): CarbonState => ({
    carbonRecords: undefined,
  }),

  getters: {
    // userInfo(state: UserState): UserState {
    //   return { ...state },
    // },
  },

  actions: {
    // switchRoles() {
    //   return new Promise((resolve) => {
    //     this.role = this.role === 'user'  'admin' : 'user',
    //     resolve(this.role),
    //   }),
    // },
    // // Get user's information
    // async info() {
    //   const res = await getUserInfo(),
    //   this.setInfo(res.data),
    // },

    async info(params?: CarbonSearchParams) {
      const res = await queryCarbonInfo(params);
      // console.log('intensity info res', res);
      const temp: CarbonRecord[] = res.data.list;
      // console.log('intensity info carbonrecord', this.carbonRecords);
      temp.forEach((item) => {
        item.totalEmisssion = String(
          Number(item.emissions) +
            Number(item.processEmissions) +
            Number(item.powerConsumption)
        );
        item.boundaryEmission = String(
          (Number(item.totalEmisssion) / 3).toFixed(2)
        );
      });
      this.carbonRecords = temp;
      // console.log(' carbonrecord load---',this.carbonRecords);
    }, // 按时间获取各个工厂的排放总量
    getEmissionIntensity(startTime: string, endTime: string) {
      const myMap: Map<string, string> = new Map();
      const start = dayjs(startTime);
      const end = dayjs(endTime);
      const gap = end.diff(start, 'day');
      // console.log('startTime', start, 'endTime', end, 'gap', gap);
      // console.log('record filter time', this.carbonRecords);
      this.carbonRecords
        ?.filter((item) => {
          const current = dayjs(item.createdTime);
          return current < end && current > start;
        })
        ?.forEach((item) =>
          myMap.set(
            item.productor ?? 'undefined',
            String(
              Number(item.totalEmisssion ?? 0) +
                Number(myMap.get(item.productor ?? 'undefined') ?? 0)
            )
          )
        );
      // console.log('mymap', myMap);

      const res = [] as number[];
      productorRank.forEach((item) =>
        res.push(Number(myMap.get(item) ?? 0) / gap)
      );
      // console.log('intensity getEmissionIntensity res', res);
      return res;
    },
    getFildTotalThisYear(filed: string) {
      const myMap: Map<string, number> = new Map();
      this.carbonRecords?.forEach((item) =>
        myMap.set(
          item.productor ?? 'undefined',
          Number(item[filed] ?? 0) +
            Number(myMap.get(item.productor ?? 'undefined') ?? 0)
        )
      );
      // console.log('mymap', myMap);
      const res = [] as number[];
      productorRank.forEach((item) => res.push(myMap.get(item) ?? 0));
      // console.log('intensity getEmissionIntensity res', res);
      return res;
    },
    getCarbonBoundaryTotalThisYear() {
      const myMap: Map<string, number> = new Map();
      this.carbonRecords?.forEach((item) => {
        myMap.set(
          'processEmissions',
          Number(item.processEmissions ?? 0) +
            Number(myMap.get('processEmissions') ?? 0)
        );
        myMap.set(
          'emissions',
          Number(item.emissions ?? 0) + Number(myMap.get('emissions') ?? 0)
        );
        myMap.set(
          'powerConsumption',
          Number(item.powerConsumption ?? 0) +
            Number(myMap.get('powerConsumption') ?? 0)
        );
      });
      return Array.from(myMap.values());
    },
    getYearAnalysis(
      filed: string,
      isAverage: boolean,
      year: number
    ): ChartDataRecord[] {
      const months: number[] = new Array(12).fill(0);
      const times: number[] = new Array(12).fill(0);
      this.carbonRecords
        ?.filter((item) => dayjs(item.createdTime).year() === year)
        .forEach((item) => {
          const m = dayjs(item.createdTime).month();
          months[m] += Number(item[filed] ?? 0);
          times[m] += 1;
        });
      return months.map((item, index) => ({
        x: index.toString(),
        y:
          isAverage ?? false
            ? item / (times[index] === 0 ? 1 : times[index])
            : item,
        name: year.toString(),
      }));
    },
    getDayAnalysis(filed: string, day: string): number {
      return (
        this.carbonRecords
          ?.filter(
            (item) => dayjs(item.createdTime).format('YYYY-MM-DD') === day
          )
          .reduce((acc, el) => acc + Number(el[filed]) ?? 0, 0) ?? 0
      );
    },
    queryPublicOpinionAnalysis(
      params: PublicOpinionAnalysis
    ): PublicOpinionAnalysisRes {
      const currentYear = dayjs().year();
      const preventYear = currentYear - 1;
      // 获取今天的日期
      const today: string = dayjs().format('YYYY-MM-DD');

      // 获取昨天的日期
      const yesterday: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const month = dayjs().month();
      let isAverage = false;
      if (params.quota === 'emissionIntensity') {
        params.quota = 'totalEmisssion';
        isAverage = true;
      }
      const current = this.getYearAnalysis(
        params.quota,
        isAverage,
        currentYear
      );
      const prevent = this.getYearAnalysis(
        params.quota,
        isAverage,
        preventYear
      );
      const cCount = this.getDayAnalysis(params.quota, today);
      const pCount = this.getDayAnalysis(params.quota, yesterday);
      const accYear = current.reduce((acc, el) => acc + el.y ?? 0, 0);
      // console.log('11111', accYear);

      const accMonth = current[month].y;
      // console.log('Analysis:', {
      //   count: Number(cCount.toFixed(2)),
      //   growth: Number((cCount - pCount).toFixed(2)),
      //   chartData: [...prevent, ...current],
      // });

      return {
        count: Number(cCount.toFixed(2)),
        growth: Number((cCount - pCount).toFixed(2)),
        chartData: [...prevent, ...current],
        accYear: Number((accYear / 165).toFixed(2)),
        accMonth: Number((accMonth / dayjs().date()).toFixed(2)),
      };
    },
    getEmissionDayDetail(date: string): EmissionDayDetail[] {
      const res: EmissionDayDetail[] = [];
      this.carbonRecords
        ?.filter((el) => dayjs(el.createdTime).format('YYYYMMDD') === date)
        .forEach((el) => {
          const temp: EmissionDayDetail = el;
          res.push(temp);
        });
      return res;
    },
    queryLast12MonthData(productor: string): EmissionMonthDetail[] {
      const currentTime = dayjs();
      // console.log("EmissionMonthDetail",currentTime);
      const res: EmissionMonthDetail[] = Array.from(
        { length: 24 },
        (_, idx) => ({
          emissions: 0,
          processEmissions: 0,
          powerConsumption: 0,
          boundaryEmission: 0,
          totalEmisssion: 0,
          tb: '',
          m: dayjs().subtract(idx, 'month').format('YYYYMM'),
        })
      );
      // console.log('res init', res);
      this.carbonRecords
        ?.filter((el) => el.productor === productor)
        .forEach((el) => {
          const index = currentTime.diff(dayjs(el.createdTime), 'month');
          res[index].emissions += Number(el.emissions) ?? 0;
          res[index].boundaryEmission += Number(el.boundaryEmission) ?? 0;
          res[index].powerConsumption += Number(el.powerConsumption) ?? 0;
          res[index].processEmissions += Number(el.processEmissions) ?? 0;
          res[index].totalEmisssion += Number(el.totalEmisssion) ?? 0;
        });
      // console.log('res filter', res);
      // 计算同比
      for (let i = 0; i < 12; i += 1) {
        const current = res[i];
        const previous = res[i + 12];
        if (current && previous && previous.totalEmisssion !== 0) {
          const tbPercentage =
            ((current.totalEmisssion - previous.totalEmisssion) /
              previous.totalEmisssion) *
            100;
          // 判断同比增减并赋值给 tb 字段
          if (tbPercentage > 0) {
            current.tb = `${tbPercentage.toFixed(2)}%↑`;
          } else if (tbPercentage < 0) {
            current.tb = `${Math.abs(tbPercentage).toFixed(2)}%↓`;
          } else {
            current.tb = '0%';
          }
        } else {
          current.tb = '--'; // 当前值或前一个值不存在时，设为空字符串
        }
      }
      // console.log('res.slice(0, 12).reverse()', res.slice(0, 12).reverse());
      return res.slice(0, 12);
    },
  },
});

export default useCarbonStore;

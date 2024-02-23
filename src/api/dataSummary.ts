import axios from 'axios';
import qs from 'query-string';

import { CarbonListRes, CarbonRecord } from './dataManage';
// index: '',
// emissions: '',
// processEmissions: '',
// powerConsumption: '',
// purchasedPower: '',
// powerGeneration: '',
// PVPowerGeneration: '',
// output: '',
// line: '',
// productor: '',
// status: '',
// createdTime: undefined,

export interface CarbonSearchParams extends Partial<CarbonRecord> {
  startTime?: string | number | Date;
  endTime?: string | number | Date;
}

export interface EmissionCalendarRecord {
  emission: number[];
  productor: string;
}

export interface EmissionCalendarRes {
  list: EmissionCalendarRecord[];
}

export const productorRank = ['wnc', 'ysgs', 'rjgs', 'ydgs', 'lpgs', 'dags'];

export const productorOptions = [
  {
    label: '万年厂',
    value: 'wnc',
  },
  {
    label: '玉山公司',
    value: 'ysgs',
  },
  {
    label: '瑞金公司',
    value: 'rjgs',
  },
  {
    label: '于都公司',
    value: 'ydgs',
  },
  {
    label: '乐平公司',
    value: 'lpgs',
  },
  {
    label: '德安公司',
    value: 'dags',
  },
];

export function queryEmissionCalendarRecord(params: string) {
  return axios.get<EmissionCalendarRes>(
    '/api/carbon/summary/EmissionCalendar',
    {
      params,
    }
  );
}

export function queryCarbonInfo(params?: CarbonSearchParams) {
  return axios.get<CarbonListRes>('/api/carbon/summary/info', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// export function queryCarbon(params: CarbonParams) {
//   return axios.get<CarbonListRes>('/api/carbon/carbon-data', {
//     params,
//     paramsSerializer: (obj) => {
//       return qs.stringify(obj);
//     },
//   });
// }

// export function updateCarbon(params: CarbonRecord[]) {
//   return axios.post<CarbonUpdateRes>('/api/carbon/carbon-update', params);
// }

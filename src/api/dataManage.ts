import axios from 'axios';
import qs from 'query-string';

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

interface LineOptionsMap {
  [key: string]: { label: string; value: string }[];
}
// productorRank = ['wnc', 'ysgs', 'rjgs', 'ydgs', 'lpgs', 'dags'];
export const lineOptionsMap: LineOptionsMap = {
  wnc: [
    { label: '7#', value: '7#' },
    { label: '8#', value: '8#' },
  ],
  ysgs: [
    { label: '1#', value: '1#' },
    { label: '2#', value: '2#' },
  ],
  rjgs: [
    { label: '1#', value: '1#' },
    { label: '2#', value: '2#' },
  ],
  ydgs: [{ label: '1#', value: '1#' }],
  lpgs: [
    { label: '1#', value: '1#' },
    { label: '2#', value: '2#' },
  ],
  dags: [{ label: '1#', value: '1#' }],
};

export interface CarbonRecord {
  index: string;
  emissions: string;
  processEmissions: string;
  powerConsumption: string;
  purchasedPower: string;
  powerGeneration: string;
  PVPowerGeneration: string;
  output: string;
  line: string;
  productor: string;
  status: string;
  createdTime: undefined;
}

export interface CarbonParams extends Partial<CarbonRecord> {
  current: number;
  pageSize: number;
  startTime?: string | number | Date;
  endTime?: string | number | Date;
}

export interface CarbonListRes {
  list: CarbonRecord[];
  total: number;
}

export interface CarbonCreateRes {
  record: CarbonRecord[];
  created: boolean;
}

export interface CarbonUpdateRes {
  record: CarbonRecord[];
  updated: boolean;
}

export function queryCarbonList(params: CarbonParams) {
  return axios.get<CarbonListRes>('/api/carbon/carbon-data', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function createCarbon(params: CarbonRecord[]) {
  return axios.post<CarbonCreateRes>('/api/carbon/carbon-create', params);
}

export function queryCarbon(params: CarbonParams) {
  return axios.get<CarbonListRes>('/api/carbon/carbon-data', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function updateCarbon(params: CarbonRecord[]) {
  return axios.post<CarbonUpdateRes>('/api/carbon/carbon-update', params);
}

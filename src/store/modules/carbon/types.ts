export interface CarbonRecord {
  index?: string;
  emissions?: string;
  processEmissions?: string;
  powerConsumption?: string;
  purchasedPower?: string;
  powerGeneration?: string;
  PVPowerGeneration?: string;
  output?: string;
  line?: string;
  productor?: string;
  status?: string;
  createdTime?: string;
  totalEmisssion?: string;
  boundaryEmission?: string;
}

export interface CarbonState {
  carbonRecords?: CarbonRecord[];
}

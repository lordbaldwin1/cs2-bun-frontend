export type PearsonCorrelations = {
  lr: number;
  hr: number;
  kd: number;
  aim: number;
  util: number;
};

export type Scatter = {
  steamID: string;
  avgLR: number;
  avgHR: number;
  avgKD: number;
  avgAim: number;
  avgUtil: number;
  avgWon: number;
};

export type Stats = {
  pearson: PearsonCorrelations;
  scatter: Scatter[];
}
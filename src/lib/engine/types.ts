export type Distribution = {
  mean?: number;
  stdev?: number;
  input?: string;
};

export type Graph = {
  metrics: any;
  simulations: any;
};

export type Sample = {
  values?: any;
  errors?: any;
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

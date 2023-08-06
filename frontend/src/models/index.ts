export interface Category {
  id: string;
  name: string;
  measurements?: Measurement[];
}

export interface Measurement {
  date: string;
  positions: number;
  remote: number;
}

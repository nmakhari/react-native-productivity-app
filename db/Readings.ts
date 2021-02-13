export interface IReading {
  id: number;
  name: string;
  creationDate: Date;
  pagesComplete: number;
  pagesTotal: number;
  readings: IReadingTodo[];
}

export interface IReadingTodo {
  id: number;
  name: string;
  pageStart: number;
  pageEnd: number;
  done: boolean;
  reading: IReading;
}

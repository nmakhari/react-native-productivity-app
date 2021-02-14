import Realm from 'realm';

export interface IReading {
  id: number;
  name: string;
  creationDate: Date;
  pagesComplete: number;
  pagesTotal: number;
  readings: Realm.List<IReadingTodo>;
}

export interface IReadingTodo {
  id: number;
  name: string;
  pageStart: number;
  pageEnd: number;
  done: boolean;
  reading: IReading;
}

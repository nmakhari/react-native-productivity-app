import Realm from 'realm';

export interface IGroup {
  id: number;
  name: string;
  creationDate: Date;
  description?: string;
  pointsCompleted: number;
  pointsTotal: number;
  items: Realm.List<IGroupTodo>;
}

export interface IGroupTodo {
  id: number;
  name: string;
  done: boolean;
  in_progress: boolean;
  points: number;
  group: IGroup;
}

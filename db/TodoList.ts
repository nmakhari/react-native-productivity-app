import { IGroup } from './Groups';
import { IReading } from './Readings';
import { ITodo } from './Todo';
import Realm from 'realm';

export interface ITodoList {
  creationDate: Date;
  groups: Realm.List<IGroup>;
  readings: Realm.List<IReading>;
  items: Realm.List<ITodo>;
}

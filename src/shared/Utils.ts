import { IGroup } from '../../db/Groups';
import { IReading } from '../../db/Readings';
import { ITodo } from '../../db/Todo';
import { IGroupTodo } from '../../db/Groups';
import { IReadingTodo } from '../../db/Readings';
import { IDisplayItemSection } from '../components/DisplayList';

export type GenericTodo = ITodo | IGroupTodo | IReadingTodo;

export enum TodoState {
  Pending,
  InProgress,
  Complete,
}

export enum SectionTitles {
  Groups = 'Groups',
  Todos = 'Todos',
  Readings = 'Readings',
}

export function getTodoState(genericTodo: GenericTodo): TodoState {
  if (genericTodo.done) {
    return TodoState.Complete;
  } else if (genericTodo.in_progress) {
    return TodoState.InProgress;
  }

  return TodoState.Pending;
}

// Section Ordering default = Groups => Todo => Readings
export function formatSections(
  todos?: Realm.Results<ITodo>,
  groups?: Realm.Results<IGroup>,
  readings?: Realm.Results<IReading>,
): IDisplayItemSection[] {
  let ret: IDisplayItemSection[] = [];

  if (groups && groups.length > 0) {
    let section: IDisplayItemSection = {
      title: SectionTitles.Groups.toString(),
      data: [],
    };
    groups.forEach((group) => {
      section.data.push(group);
    });

    ret.push(section);
  }

  if (todos && todos.length > 0) {
    let section: IDisplayItemSection = {
      title: SectionTitles.Todos.toString(),
      data: [],
    };
    todos.forEach((todo) => {
      section.data.push(todo);
    });

    ret.push(section);
  }

  if (readings && readings.length > 0) {
    let section: IDisplayItemSection = {
      title: SectionTitles.Readings.toString(),
      data: [],
    };
    readings.forEach((reading) => {
      section.data.push(reading);
    });

    ret.push(section);
  }

  return ret;
}

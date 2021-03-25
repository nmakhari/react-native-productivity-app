import { IGroupTodo } from '../../db/Groups';
import { IReadingTodo } from '../../db/Readings';
import { ITodo } from '../../db/Todo';

export type GenericTodo = ITodo | IGroupTodo | IReadingTodo;

export enum TodoState {
  Pending,
  InProgress,
  Complete,
}

export function getTodoState(genericTodo: GenericTodo): TodoState {
  if (genericTodo.done) {
    return TodoState.Complete;
  } else if (genericTodo.in_progress) {
    return TodoState.InProgress;
  }

  return TodoState.Pending;
}

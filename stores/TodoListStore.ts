import {Results} from 'realm';
import realm, {
  SchemaNames,
  TodoList,
  Group,
  Reading,
  Todo,
} from '../db/RealmSchemas';

const kLogTag = 'TodoListStore';

export interface ITodoListStore {
  readonly todoList: TodoList;
  readonly groups?: Results<Group>;
  readonly readings?: Results<Reading>;
  readonly todos?: Results<Todo>;
}

export class TodoListStore implements ITodoListStore {
  todoList: TodoList;
  groups?: Results<Group>;
  readings?: Results<Reading>;
  todos?: Results<Todo>;

  constructor() {
    this.todoList = realm.objects(SchemaNames.TODO_LIST_SCHEMA)[0];

    if (!this.todoList) {
      this._initTodoList();
    }

    console.log(kLogTag + ' todo list initialized');
  }

  private _initTodoList() {
    realm.write(() => {
      realm.create(SchemaNames.TODO_LIST_SCHEMA, {
        creationDate: new Date(),
        groups: [],
        readings: [],
        items: [],
      });
    });
  }
}

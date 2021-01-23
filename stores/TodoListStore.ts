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
  readonly groups?: Realm.List<Group & Realm.Object> | null;
  readonly readings?: Realm.List<Reading & Realm.Object> | null;
  readonly todos?: Realm.List<Todo & Realm.Object> | null;
}

export class TodoListStore implements ITodoListStore {
  todoList: TodoList;
  groups?: Realm.List<Group & Realm.Object> | null;
  readings?: Realm.List<Reading & Realm.Object> | null;
  todos?: Realm.List<Todo & Realm.Object> | null;

  constructor() {
    this.todoList = realm.objects<TodoList>(SchemaNames.TODO_LIST_SCHEMA)[0];

    if (!this.todoList) {
      this._initTodoList();
    }

    console.log(kLogTag + ' todo list initialized');

    this.groups = this.todoList.groups;
    this.readings = this.todoList.readings;
    this.todos = this.todoList.items;

    console.log(kLogTag + ' todo list properties initialized');
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

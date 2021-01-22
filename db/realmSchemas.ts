import Realm from 'realm';

// schema name constants
export enum SchemaNames {
  TODO_LIST_SCHEMA = 'TodoList',
  GROUP_SCHEMA = 'Group',
  READING_SCHEMA = 'Reading',
  TODO_SCHEMA = 'Todo',
  READING_TODO_SCHEMA = 'ReadingTodo',
  GROUP_TODO_SCHEMA = 'GroupTodo',
}

// Schema declarations

export class GroupTodo extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.GROUP_TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      done: {type: 'bool', default: false},
      points: 'int',
      group: {
        // points to an object (reverse one to many)
        type: 'linkingObjects',
        objectType: SchemaNames.GROUP_SCHEMA,
        property: 'items',
      },
    },
  };
}

export class ReadingTodo extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.READING_TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      pageStart: 'int',
      pageEnd: 'int',
      done: {type: 'bool', default: false},
      reading: {
        // points to an object (reverse one to many)
        type: 'linkingObjects',
        objectType: SchemaNames.READING_SCHEMA,
        property: 'readings',
      },
    },
  };
}

export class Todo extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      done: {type: 'bool', default: false},
    },
  };
}

export class Reading extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.READING_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      creationDate: 'date',
      pagesComplete: 'int',
      pagesTotal: 'int',
      readings: {type: 'list', objectType: SchemaNames.READING_TODO_SCHEMA}, // to many relationship
    },
  };
}

export class Group extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.GROUP_SCHEMA,
    primaryKey: 'id', // primary key
    properties: {
      id: 'int',
      name: 'string',
      creationDate: 'date',
      description: 'string?',
      items: {type: 'list', objectType: SchemaNames.GROUP_TODO_SCHEMA}, // to many relationship
    },
  };
}

export class TodoList extends Realm.Object {
  static schema: Realm.ObjectSchema = {
    name: SchemaNames.TODO_LIST_SCHEMA,
    properties: {
      creationDate: 'date',
      groups: {type: 'list', objectType: SchemaNames.GROUP_SCHEMA},
      readings: {type: 'list', objectType: SchemaNames.READING_SCHEMA},
      items: {type: 'list', objectType: SchemaNames.TODO_SCHEMA},
    },
  };

  // creationDate: Date;
  // groups?: Realm.List<Group & Realm.Object>;
  // readings?: Realm.List<Reading & Realm.Object>;
  // items?: Realm.List<Todo & Realm.Object>;

  // constructor() {
  //   super();
  //   this.creationDate = new Date();
  // }
}

export default new Realm({
  schema: [GroupTodo, ReadingTodo, Todo, Group, Reading, TodoList],
});

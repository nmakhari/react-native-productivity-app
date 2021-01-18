import Realm from 'realm';

// schema name constants
const TODO_LIST_SCHEMA: string = 'TodoList';
const GROUP_SCHEMA: string = 'Group';
const READING_SCHEMA: string = 'Reading';
const TODO_SCHEMA: string = 'Todo';
const READING_TODO_SCHEMA: string = 'ReadingTodo';
const GROUP_TODO_SCHEMA: string = 'GroupTodo';

// Schema declarations

class GroupTodo extends Realm.Object {
  static schema = {
    name: GROUP_TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      done: {type: 'bool', default: false},
      points: 'int',
      group: {
        // points to an object (reverse one to many)
        type: 'linkingObjects',
        objectType: GROUP_SCHEMA,
        property: 'items',
      },
    },
  };
}

class ReadingTodo extends Realm.Object {
  static schema = {
    name: READING_TODO_SCHEMA,
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
        objectType: READING_SCHEMA,
        property: 'readings',
      },
    },
  };
}

class Todo extends Realm.Object {
  static schema = {
    name: TODO_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      done: {type: 'bool', default: false},
    },
  };
}

class Reading extends Realm.Object {
  static schema = {
    name: READING_SCHEMA,
    primaryKey: 'id',
    properties: {
      id: 'int', // primary key
      name: 'string',
      creationDate: 'date',
      pagesComplete: 'int',
      pagesTotal: 'int',
      readings: {type: 'list', objectType: READING_TODO_SCHEMA}, // to many relationship
    },
  };
}

class Group extends Realm.Object {
  static schema = {
    name: GROUP_SCHEMA,
    primaryKey: 'id', // primary key
    properties: {
      id: 'int',
      name: 'string',
      creationDate: 'date',
      description: 'string?',
      items: {type: 'list', objectType: GROUP_TODO_SCHEMA}, // to many relationship
    },
  };
}

class TodoList extends Realm.Object {
  static schema = {
    name: TODO_LIST_SCHEMA,
    properties: {
      creationDate: 'date',
      groups: {type: 'list', objectType: GROUP_SCHEMA},
      readings: {type: 'list', objectType: READING_SCHEMA},
      items: {type: 'list', objectType: TODO_SCHEMA},
    },
  };
}

export default new Realm({
  schema: [GroupTodo, ReadingTodo, Todo, Group, Reading, TodoList],
});

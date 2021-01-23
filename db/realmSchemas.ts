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

  id: number;
  name: string;
  done: boolean;
  points: number;
  group: Group;

  constructor(
    id: number,
    name: string,
    points: number,
    group: Group,
    done?: boolean | null,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.done = done ?? false;
    this.points = points;
    this.group = group;
  }
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

  id: number;
  name: string;
  pageStart: number;
  pageEnd: number;
  done: boolean;
  reading: Reading;

  constructor(
    id: number,
    name: string,
    pageStart: number,
    pageEnd: number,
    reading: Reading,
    done?: boolean | null,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.pageStart =
      pageStart >= 0 && pageStart < reading.pagesTotal ? pageStart : 0;
    this.pageEnd =
      pageEnd <= reading.pagesTotal && pageEnd > 0
        ? pageEnd
        : reading.pagesTotal;
    this.done = done ?? false;
    this.reading = reading;
  }
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

  id: number;
  name: string;
  done: boolean;

  constructor(id: number, name: string, done?: boolean | null) {
    super();
    this.id = id;
    this.name = name;
    this.done = done ?? false;
  }
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

  id: number;
  name: string;
  creationDate: Date;
  pagesComplete: number;
  pagesTotal: number;
  readings?: Realm.List<ReadingTodo & Realm.Object> | null;

  constructor(
    id: number,
    name: string,
    creationDate: Date,
    pagesTotal: number,
    pagesComplete?: number | null,
    readings?: Realm.List<ReadingTodo & Realm.Object> | null,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.creationDate = creationDate;
    this.pagesComplete = pagesComplete ?? 0;
    this.pagesTotal = pagesTotal;
    this.readings = readings;
  }
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
      pointTotal: 'int',
      items: {type: 'list', objectType: SchemaNames.GROUP_TODO_SCHEMA}, // to many relationship
    },
  };

  id: number;
  name: string;
  creationDate: Date;
  description?: string | null;
  pointTotal: number;
  items?: Realm.List<GroupTodo & Realm.Object> | null;

  constructor(
    id: number,
    name: string,
    creationDate: Date,
    description?: string | null,
    items?: Realm.List<GroupTodo & Realm.Object> | null,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.pointTotal = items?.sum('points') ?? 0;
    this.creationDate = creationDate;
    this.description = description;
    this.items = items;
  }
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

  creationDate: Date;
  groups?: Realm.List<Group & Realm.Object> | null;
  readings?: Realm.List<Reading & Realm.Object> | null;
  items?: Realm.List<Todo & Realm.Object> | null;

  constructor(
    creationDate: Date,
    groups?: Realm.List<Group & Realm.Object> | null,
    readings?: Realm.List<Reading & Realm.Object> | null,
    items?: Realm.List<Todo & Realm.Object> | null,
  ) {
    super();
    this.creationDate = creationDate;
    this.groups = groups;
    this.readings = readings;
    this.items = items;
  }
}

export default new Realm({
  schema: [GroupTodo, ReadingTodo, Todo, Group, Reading, TodoList],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 1) {
      const oldGroups: Realm.Results<
        Group & Realm.Object
      > = oldRealm.objects<Group>(SchemaNames.GROUP_SCHEMA);
      const newGroups: Realm.Results<
        Group & Realm.Object
      > = newRealm.objects<Group>(SchemaNames.GROUP_SCHEMA);

      for (let i = 0; i < oldGroups.length; i++) {
        newGroups[i].pointTotal = oldGroups[i].items?.sum('points') ?? 0;
      }
    }
  },
});

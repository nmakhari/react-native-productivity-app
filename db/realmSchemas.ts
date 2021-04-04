import Realm, { ObjectSchema } from 'realm';

// schema name constants
export enum SchemaNames {
  GROUP_SCHEMA = 'Group',
  READING_SCHEMA = 'Reading',
  TODO_SCHEMA = 'Todo',
  READING_TODO_SCHEMA = 'ReadingTodo',
  GROUP_TODO_SCHEMA = 'GroupTodo',
}

// Schema declarations

export const GroupTodoSchema: ObjectSchema = {
  name: SchemaNames.GROUP_TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', // primary key
    name: 'string',
    done: { type: 'bool', default: false },
    in_progress: { type: 'bool', default: false },
    points: 'int',
    group: SchemaNames.GROUP_SCHEMA.toString(),
  },
};

export const ReadingTodoSchema: ObjectSchema = {
  name: SchemaNames.READING_TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', // primary key
    name: 'string',
    pageStart: 'int',
    pageEnd: 'int',
    done: { type: 'bool', default: false },
    in_progress: { type: 'bool', default: false },
    reading: SchemaNames.READING_SCHEMA.toString(),
  },
};

export const TodoSchema: ObjectSchema = {
  name: SchemaNames.TODO_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', // primary key
    name: 'string',
    description: 'string?',
    done: { type: 'bool', default: false },
    in_progress: { type: 'bool', default: false },
  },
};

export const ReadingSchema: ObjectSchema = {
  name: SchemaNames.READING_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', // primary key
    name: 'string',
    creationDate: 'date',
    pagesComplete: { type: 'int', default: 0 },
    pagesTotal: 'int',
    readings: { type: 'list', objectType: SchemaNames.READING_TODO_SCHEMA }, // to many relationship
  },
};

export const GroupSchema: ObjectSchema = {
  name: SchemaNames.GROUP_SCHEMA,
  primaryKey: 'id', // primary key
  properties: {
    id: 'int',
    name: 'string',
    creationDate: 'date',
    description: 'string?',
    pointsCompleted: 'int',
    pointsTotal: 'int',
    items: { type: 'list', objectType: SchemaNames.GROUP_TODO_SCHEMA }, // to many relationship
  },
};

export default new Realm({
  schema: [
    GroupTodoSchema,
    ReadingTodoSchema,
    TodoSchema,
    GroupSchema,
    ReadingSchema,
  ],
  deleteRealmIfMigrationNeeded: true,
  schemaVersion: 5,
});

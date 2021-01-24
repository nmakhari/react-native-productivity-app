import realm, {
  TodoList,
  Group,
  Reading,
  Todo,
  GroupTodo,
} from '../db/RealmSchemas';

const kLogTag = 'TodoListStore';

export interface ITodoListStore {
  readonly todoList: TodoList;
  readonly groups?: Realm.List<Group & Realm.Object> | null;
  readonly readings?: Realm.List<Reading & Realm.Object> | null;
  readonly todos?: Realm.List<Todo & Realm.Object> | null;

  createTodo(name: string): void;
  getTodo(id: number): Todo | undefined;
  toggleTodoState(id: number): void;
  deleteTodo(id: number): void;

  createGroup(name: string, description?: string): void;
  getGroup(id: number): Group | undefined;
  deleteGroup(id: number): void;

  createGroupTodo(name: string, points: number, group: Group): void;
  getGroupTodo(id: number): GroupTodo | undefined;
  toggleGroupTodoState(id: number): void;
  deleteGroupTodo(id: number): void;

  createReading(name: string, pagesTotal: number, pagesComplete?: number): void;
  getReading(id: number): Reading | undefined;
  deleteReading(id: number): void;

  // TODO: propagate pages read and group todo points to the parent todo under create, toggle and delete

  // TODO: ReadingTodo crud
}

export class TodoListStore implements ITodoListStore {
  todoList: TodoList;
  groups?: Realm.List<Group & Realm.Object> | null;
  readings?: Realm.List<Reading & Realm.Object> | null;
  todos?: Realm.List<Todo & Realm.Object> | null;

  constructor() {
    this.todoList = realm.objects<TodoList>(TodoList.schema.name)[0];

    if (!this.todoList) {
      this._initTodoList();
    }

    console.log(kLogTag + ' todo list initialized');

    this.groups = this.todoList.groups;
    this.readings = this.todoList.readings;
    this.todos = this.todoList.items;

    console.log(kLogTag + ' todo list properties initialized');
  }

  createTodo(name: string) {
    const orderedTodos:
      | Realm.Results<Todo & Realm.Object>
      | undefined = this.todos?.sorted('id', true);

    let id: number = 1;

    if (orderedTodos) {
      id = orderedTodos[0] ? orderedTodos[0].id + 1 : 1;
    }

    const newTodo = new Todo(id, name, false);

    try {
      realm.write(() => {
        this.todoList.items?.push(realm.create(Todo.schema.name, newTodo));
      });
    } catch (error) {
      console.log(kLogTag + ' error adding Todo');
    }
  }

  getTodo(id: number): Todo | undefined {
    return realm.objectForPrimaryKey<Todo>(Todo.schema.name, id);
  }

  toggleTodoState(id: number) {
    const selectedTodo: Todo | undefined = this.getTodo(id);

    if (selectedTodo) {
      try {
        realm.write(() => {
          selectedTodo.done = !selectedTodo.done;
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error toggling todo with name: ' +
            selectedTodo.name +
            ' id: ' +
            selectedTodo.id,
        );
      }
      return;
    }

    console.log(kLogTag + ' error toggling todo, id: ' + id + ' not found');
  }

  deleteTodo(id: number) {
    const selectedTodo: Todo | undefined = this.getTodo(id);

    if (selectedTodo) {
      try {
        realm.write(() => {
          realm.delete(selectedTodo);
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error deleting todo with name: ' +
            selectedTodo.name +
            ' id: ' +
            selectedTodo.id,
        );
      }
      return;
    }

    console.log(kLogTag + ' error deleting todo, id: ' + id + ' not found');
  }

  createGroup(name: string, description?: string) {
    const orderedGroups:
      | Realm.Results<Group & Realm.Object>
      | undefined = this.groups?.sorted('id', true);

    let id: number = 1;

    if (orderedGroups) {
      id = orderedGroups[0] ? orderedGroups[0].id + 1 : 1;
    }

    const newGroup: Group = new Group(id, name, new Date(), description);

    try {
      realm.write(() => {
        this.todoList.groups?.push(realm.create(Group.schema.name, newGroup));
      });
    } catch (error) {
      console.log(kLogTag + ' error creating group => name: ' + name);
    }
  }

  getGroup(id: number): Group | undefined {
    return realm.objectForPrimaryKey<Group>(Group.schema.name, id);
  }

  deleteGroup(id: number) {
    const selectedGroup: Group | undefined = this.getGroup(id);
    if (selectedGroup) {
      try {
        realm.write(() => {
          realm.delete(selectedGroup.items);
          realm.delete(selectedGroup);
        });
      } catch (error) {
        console.log(kLogTag + ' error deleting group => id: ' + id);
      }
      return;
    }

    console.log(
      kLogTag + ' could not find group with id: ' + id + ' to delete',
    );
  }

  createGroupTodo(name: string, points: number, group: Group) {
    const selectedGroup: Group | undefined = this.getGroup(group.id);

    if (selectedGroup) {
      const orderedGroupTodos:
        | Realm.Results<GroupTodo & Realm.Object>
        | undefined = group.items?.sorted('id', true);

      let id: number = 1;

      if (orderedGroupTodos) {
        id = orderedGroupTodos[0] ? orderedGroupTodos[0].id + 1 : 1;
      }

      const newGroupTodo = new GroupTodo(id, name, points, group);
      try {
        realm.write(() => {
          selectedGroup.items?.push(
            realm.create(GroupTodo.schema.name, newGroupTodo),
          );
          selectedGroup.pointTotal += points;
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error creating group todo name: ' +
            name +
            ' group name: ' +
            group.name,
        );
      }
    }
  }

  getGroupTodo(id: number): GroupTodo | undefined {
    return realm.objectForPrimaryKey<GroupTodo>(GroupTodo.schema.name, id);
  }

  toggleGroupTodoState(id: number) {
    const selectedGroupTodo: GroupTodo | undefined = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      try {
        realm.write(() => {
          selectedGroupTodo.done = !selectedGroupTodo.done;

          if (selectedGroupTodo.done) {
            selectedGroupTodo.group.pointsCompleted += selectedGroupTodo.points;
          } else {
            selectedGroupTodo.group.pointsCompleted -= selectedGroupTodo.points;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not toggle GroupTodo with name: ' +
            selectedGroupTodo.name +
            ' id: ' +
            id,
        );
      }
    }
    console.log(
      kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to toggle',
    );
  }

  deleteGroupTodo(id: number) {
    const selectedGroupTodo: GroupTodo | undefined = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      try {
        realm.write(() => {
          selectedGroupTodo.group.pointTotal -= selectedGroupTodo.points;
          if (selectedGroupTodo.done) {
            selectedGroupTodo.group.pointsCompleted -= selectedGroupTodo.points;
          }
          realm.delete(selectedGroupTodo);
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not delete GroupTodo with name: ' +
            selectedGroupTodo.name +
            ' id: ' +
            id,
        );
      }
    }
    console.log(
      kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to delete',
    );
  }

  createReading(name: string, pagesTotal: number, pagesComplete?: number) {
    const orderedReadings:
      | Realm.Results<Reading & Realm.Object>
      | undefined = this.todoList.readings?.sorted('id', true);

    let id: number = 1;

    if (orderedReadings) {
      id = orderedReadings[0] ? orderedReadings[0].id + 1 : 1;
    }

    const newReading: Reading = new Reading(
      id,
      name,
      new Date(),
      pagesTotal,
      pagesComplete,
    );

    try {
      realm.write(() => {
        this.todoList.readings?.push(
          realm.create(Reading.schema.name, newReading),
        );
      });
    } catch (error) {
      console.log(kLogTag + ' error creating reading => name: ' + name);
    }
  }

  getReading(id: number): Reading | undefined {
    return realm.objectForPrimaryKey<Reading>(Reading.schema.name, id);
  }

  deleteReading(id: number) {
    const selectedReading: Reading | undefined = this.getReading(id);

    if (selectedReading) {
      try {
        realm.write(() => {
          realm.delete(selectedReading.readings);
          realm.delete(selectedReading);
        });
      } catch (error) {
        console.log(kLogTag + ' error deleting reading => id: ' + id);
      }
      return;
    }

    console.log(
      kLogTag + ' could not find reading with id: ' + id + ' to delete',
    );
  }

  private _initTodoList() {
    try {
      realm.write(() => {
        let todoList = new TodoList(new Date());
        realm.create(TodoList.schema.name, todoList);
      });
    } catch (error) {
      console.log(kLogTag + ' error initializing todoList');
    }
  }
}

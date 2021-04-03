import realm, {
  GroupTodoSchema,
  GroupSchema,
  ReadingTodoSchema,
  ReadingSchema,
  TodoSchema,
  TodoListSchema,
} from '../db/realmSchemas';
import { IGroup, IGroupTodo } from '../db/Groups';
import { IReading, IReadingTodo } from '../db/Readings';
import { ITodo } from '../db/Todo';
import { ITodoList } from '../db/TodoList';
import {
  observable,
  action,
  computed,
  runInAction,
  makeObservable,
} from 'mobx';

const kLogTag = 'TodoListStore';

export interface ITodoListStore {
  readonly todoList: ITodoList;
  readonly groups: Realm.List<IGroup>;
  readonly readings: Realm.List<IReading>;
  readonly todos: Realm.List<ITodo>;

  readonly pendingTodos: Realm.Results<ITodo>;
  readonly pendingGroups: Realm.Results<IGroup>;
  readonly pendingReadings: Realm.Results<IReading>;

  readonly inProgressTodos: Realm.Results<ITodo>;
  readonly inProgressGroups: Realm.Results<IGroup>;
  readonly inProgressReadings: Realm.Results<IReading>;

  readonly completedTodos: Realm.Results<ITodo>;
  readonly completedGroups: Realm.Results<IGroup>;
  readonly completedReadings: Realm.Results<IReading>;

  createTodo(name: string): ITodo | undefined;
  getTodo(id: number): ITodo | undefined;
  toggleTodoDoneState(id: number): void;
  toggleTodoProgressState(id: number): void;
  deleteTodo(id: number): void;

  createGroup(name: string, description?: string): IGroup | undefined;
  getGroup(id: number): IGroup | undefined;
  deleteGroup(id: number): void;

  createGroupTodo(
    name: string,
    points: number,
    group: IGroup,
  ): IGroupTodo | undefined;
  getGroupTodo(id: number): IGroupTodo | undefined;
  toggleGroupTodoDoneState(id: number): void;
  toggleGroupTodoProgressState(id: number): void;
  deleteGroupTodo(id: number): void;

  createReading(
    name: string,
    pagesTotal: number,
    pagesComplete?: number,
  ): IReading | undefined;
  getReading(id: number): IReading | undefined;
  deleteReading(id: number): void;

  createReadingTodo(
    name: string,
    pageStart: number,
    pageEnd: number,
    reading: IReading,
  ): IReadingTodo | undefined;
  getReadingTodo(id: number): IReadingTodo | undefined;
  toggleReadingTodoDoneState(id: number): void;
  toggleReadingTodoProgressState(id: number): void;
  deleteReadingTodo(id: number): void;

  wipeTodoList(): void;
}

export class TodoListStore implements ITodoListStore {
  @observable todoList: ITodoList;

  constructor() {
    makeObservable(this);
    runInAction(() => {
      this.todoList = realm.objects<ITodoList>(TodoListSchema.name)[0];

      if (!this.todoList) {
        this._initTodoList();
      }

      console.log(kLogTag + ' todo list initialized');
    });
  }

  // Completely clear out the current todolist of all child elements
  wipeTodoList() {
    realm.write(() => {
      realm.delete(realm.objects<ITodo>(TodoSchema.name));
      realm.delete(realm.objects<IReadingTodo>(ReadingTodoSchema.name));
      realm.delete(realm.objects<IReading>(ReadingSchema.name));
      realm.delete(realm.objects<IGroupTodo>(GroupTodoSchema.name));
      realm.delete(realm.objects<IGroup>(GroupSchema.name));
    });
  }

  @action
  createTodo(name: string): ITodo | undefined {
    let id = 1;

    const currentTodos = this.todos.sorted('id', true);

    if (currentTodos.length > 0) {
      id = currentTodos[0].id + 1;
    }

    const newTodo = {
      id: id,
      name: name,
      done: false,
      in_progress: false,
    };

    try {
      realm.write(() => {
        this.todoList.items.push(realm.create(TodoSchema.name, newTodo));
      });
    } catch (error) {
      console.log(kLogTag + ' error adding Todo' + ' error: ' + error);
      return;
    }
    return this.getTodo(id);
  }

  getTodo(id: number): ITodo | undefined {
    return realm.objectForPrimaryKey<ITodo>(TodoSchema.name, id);
  }

  @action
  toggleTodoDoneState(id: number) {
    const selectedTodo = this.getTodo(id);

    if (selectedTodo) {
      try {
        realm.write(() => {
          selectedTodo.done = !selectedTodo.done;
          if (selectedTodo.done) {
            selectedTodo.in_progress = false;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error toggling todo done with name: ' +
            selectedTodo.name +
            ' id: ' +
            selectedTodo.id,
        );
      }
      return;
    }

    console.log(
      kLogTag + ' error toggling todo done, id: ' + id + ' not found',
    );
  }

  @action
  toggleTodoProgressState(id: number) {
    const selectedTodo = this.getTodo(id);

    if (selectedTodo) {
      try {
        realm.write(() => {
          selectedTodo.in_progress = !selectedTodo.in_progress;
          if (selectedTodo.in_progress) {
            selectedTodo.done = false;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error toggling todo progress with name: ' +
            selectedTodo.name +
            ' id ' +
            selectedTodo,
        );
      }
      return;
    }

    console.log(
      kLogTag + ' error toggling todo progress, id: ' + id + ' not found',
    );
  }

  @action
  deleteTodo(id: number) {
    const selectedTodo = this.getTodo(id);

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

  @action
  createGroup(name: string, description?: string): IGroup | undefined {
    let id = 1;

    const currentGroups = this.groups.sorted('id', true);

    if (currentGroups.length > 0) {
      id = currentGroups[0].id + 1;
    }

    const newGroup = {
      id: id,
      name: name,
      creationDate: new Date(),
      description: description,
      pointsCompleted: 0,
      pointsTotal: 0,
      items: [],
    };

    try {
      realm.write(() => {
        this.todoList.groups.push(realm.create(GroupSchema.name, newGroup));
      });
    } catch (error) {
      console.log(
        kLogTag + ' error creating group => name: ' + name + ' error: ' + error,
      );
      return;
    }
    return this.getGroup(id);
  }

  getGroup(id: number): IGroup | undefined {
    return realm.objectForPrimaryKey<IGroup>(GroupSchema.name, id);
  }

  deleteGroup(id: number) {
    const selectedGroup = this.getGroup(id);

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

  createGroupTodo(
    name: string,
    points: number,
    group: IGroup,
  ): IGroupTodo | undefined {
    const selectedGroup = this.getGroup(group.id);

    if (selectedGroup) {
      let id = 1;

      const currentGroupTodos = selectedGroup.items.sorted('id', true);

      if (currentGroupTodos.length > 0) {
        id = currentGroupTodos[0].id + 1;
      }

      const newGroupTodo = {
        id: id,
        name: name,
        done: false,
        in_progress: false,
        points: points,
        group: selectedGroup,
      };

      try {
        realm.write(() => {
          selectedGroup.items.push(
            realm.create(GroupTodoSchema.name, newGroupTodo),
          );
          selectedGroup.pointsTotal += points;
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error creating group todo name: ' +
            name +
            ' group name: ' +
            group.name +
            ' error: ' +
            error,
        );
        return;
      }
      return this.getGroupTodo(id);
    }
    console.log(
      kLogTag +
        ' error couldnt find selected group to create groupTodo name: ' +
        name,
    );
  }

  getGroupTodo(id: number): IGroupTodo | undefined {
    return realm.objectForPrimaryKey<IGroupTodo>(GroupTodoSchema.name, id);
  }

  toggleGroupTodoDoneState(id: number) {
    const selectedGroupTodo = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      const parentGroup = this.getGroup(selectedGroupTodo.group.id);

      if (!parentGroup) {
        console.log(
          kLogTag +
            ' error parent group of groupTodo name: ' +
            selectedGroupTodo.name +
            ' could not be found during toggle done',
        );
        return;
      }

      try {
        realm.write(() => {
          selectedGroupTodo.done = !selectedGroupTodo.done;

          if (selectedGroupTodo.done) {
            parentGroup.pointsCompleted += selectedGroupTodo.points;
            console.log('incrementing group points on toggle done');
            selectedGroupTodo.in_progress = false;
          } else {
            parentGroup.pointsCompleted -= selectedGroupTodo.points;
            console.log('decrementing group points on toggle done');
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not toggle GroupTodo done with name: ' +
            selectedGroupTodo.name +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag +
        ' error, could not find GroupTodo => id: ' +
        id +
        ' to toggle done',
    );
  }

  toggleGroupTodoProgressState(id: number) {
    const selectedGroupTodo = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      const parentGroup = this.getGroup(selectedGroupTodo.group.id);

      if (!parentGroup) {
        console.log(
          kLogTag +
            ' error parent group of groupTodo name: ' +
            selectedGroupTodo.name +
            ' could not be found during toggle progress',
        );
        return;
      }

      try {
        realm.write(() => {
          selectedGroupTodo.in_progress = !selectedGroupTodo.in_progress;

          if (selectedGroupTodo.in_progress) {
            selectedGroupTodo.done = false;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not toggle GroupTodo progress with name: ' +
            selectedGroupTodo.name +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag +
        ' error, could not find GroupTodo => id: ' +
        id +
        ' to toggle progress',
    );
  }

  deleteGroupTodo(id: number) {
    const selectedGroupTodo = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      try {
        realm.write(() => {
          const parentGroup = this.getGroup(selectedGroupTodo.group.id);
          parentGroup!.pointsTotal -= selectedGroupTodo.points;
          if (selectedGroupTodo.done) {
            parentGroup!.pointsCompleted -= selectedGroupTodo.points;
          }
          realm.delete(selectedGroupTodo);
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not delete GroupTodo with name: ' +
            selectedGroupTodo.name +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to delete',
    );
  }

  createReading(
    name: string,
    pagesTotal: number,
    pagesComplete?: number,
  ): IReading | undefined {
    let id = 1;

    const currentReadings = this.todoList.readings.sorted('id', true);

    if (currentReadings.length > 0) {
      id = currentReadings[0].id + 1;
    }

    const newReading = {
      id: id,
      name: name,
      creationDate: new Date(),
      pagesTotal: pagesTotal,
      pagesComplete: pagesComplete ?? 0,
    };

    try {
      realm.write(() => {
        this.todoList.readings.push(
          realm.create(ReadingSchema.name, newReading),
        );
      });
    } catch (error) {
      console.log(
        kLogTag +
          ' error creating reading => name: ' +
          name +
          ' error: ' +
          error,
      );
      return;
    }
    return this.getReading(id);
  }

  getReading(id: number): IReading | undefined {
    return realm.objectForPrimaryKey<IReading>(ReadingSchema.name, id);
  }

  deleteReading(id: number) {
    const selectedReading = this.getReading(id);

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

  createReadingTodo(
    name: string,
    pageStart: number,
    pageEnd: number,
    reading: IReading,
  ): IReadingTodo | undefined {
    const selectedReading = this.getReading(reading.id);

    if (selectedReading) {
      let id = 1;

      const currentReadingTodos = selectedReading.readings.sorted('id', true);

      if (currentReadingTodos.length > 0) {
        id = currentReadingTodos[0].id + 1;
      }

      const newReadingTodo = {
        id: id,
        name: name,
        pageStart: pageStart,
        pageEnd: pageEnd,
        done: false,
        in_progress: false,
        reading: selectedReading,
      };

      try {
        realm.write(() => {
          selectedReading.readings.push(
            realm.create(ReadingTodoSchema.name, newReadingTodo),
          );
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error creating reading todo with name: ' +
            name +
            ' id: ' +
            id +
            ' error: ' +
            error,
        );
        return;
      }
      return this.getReadingTodo(id);
    }
    console.log(
      kLogTag +
        ' error could not find parent reading to create ReadingTodo with name: ' +
        name,
    );
  }

  getReadingTodo(id: number): IReadingTodo | undefined {
    return realm.objectForPrimaryKey<IReadingTodo>(ReadingTodoSchema.name, id);
  }

  toggleReadingTodoDoneState(id: number) {
    const selectedReadingTodo = this.getReadingTodo(id);

    if (selectedReadingTodo) {
      const parentReading = this.getReading(selectedReadingTodo.reading.id);

      if (!parentReading) {
        console.log(
          kLogTag +
            ' error, could not find parent reading to toggle ReadingTodo done name: ' +
            selectedReadingTodo.name +
            ' id: ' +
            id +
            ' parent reading id: ' +
            id,
        );
        return;
      }

      try {
        realm.write(() => {
          selectedReadingTodo.done = !selectedReadingTodo.done;
          if (selectedReadingTodo.done) {
            parentReading.pagesComplete +=
              selectedReadingTodo.pageEnd - selectedReadingTodo.pageStart;
            selectedReadingTodo.in_progress = false;
          } else {
            parentReading.pagesComplete -=
              selectedReadingTodo.pageEnd - selectedReadingTodo.pageStart;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error, could not toggle ReadingTodo done, name: ' +
            selectedReadingTodo.name +
            ' id: ' +
            id +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag +
        ' error, could not find ReadingTodo with id: ' +
        id +
        ' to toggle done',
    );
  }

  toggleReadingTodoProgressState(id: number) {
    const selectedReadingTodo = this.getReadingTodo(id);

    if (selectedReadingTodo) {
      const parentReading = this.getReading(selectedReadingTodo.reading.id);

      if (!parentReading) {
        console.log(
          kLogTag +
            ' error, could not find parent reading to toggle ReadingTodo progress name: ' +
            selectedReadingTodo.name +
            ' id: ' +
            id +
            ' parent reading id: ' +
            id,
        );
        return;
      }

      try {
        realm.write(() => {
          selectedReadingTodo.in_progress = !selectedReadingTodo.in_progress;
          if (selectedReadingTodo.in_progress) {
            selectedReadingTodo.done = false;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error, could not toggle ReadingTodo progress, name: ' +
            selectedReadingTodo.name +
            ' id: ' +
            id +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag +
        ' error, could not find ReadingTodo with id: ' +
        id +
        ' to toggle progress',
    );
  }

  deleteReadingTodo(id: number) {
    const selectedReadingTodo = this.getReadingTodo(id);

    if (selectedReadingTodo) {
      try {
        realm.write(() => {
          const parentReading = this.getReading(selectedReadingTodo.reading.id);
          if (selectedReadingTodo.done) {
            parentReading!.pagesComplete -=
              selectedReadingTodo.pageEnd - selectedReadingTodo.pageStart;
          }
          realm.delete(selectedReadingTodo);
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not delete ReadingTodo with name: ' +
            selectedReadingTodo.name +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag +
        ' error, could not find selected ReadingTodo with id: ' +
        id +
        ' to delete',
    );
  }

  @computed
  get groups(): Realm.List<IGroup> {
    console.log(kLogTag + ' get Groups');
    return this.todoList.groups;
  }

  @computed
  get readings(): Realm.List<IReading> {
    console.log(kLogTag + ' get Readings');
    return this.todoList.readings;
  }

  @computed
  get todos(): Realm.List<ITodo> {
    console.log(kLogTag + ' get Todos');
    return this.todoList.items;
  }

  @computed
  get pendingTodos(): Realm.Results<ITodo> {
    return this.todos.filtered(
      'done = false AND in_progress = false SORT(id DESC)',
    );
  }
  // SUBQUERY on Collection:
  // https://docs.mongodb.com/realm-legacy/docs/javascript/latest/api/tutorial-query-language.html

  // For pending groups and readings, check if there is anything inProgress OR complete, if not, then it's pending
  @computed
  get pendingGroups(): Realm.Results<IGroup> {
    return this.groups.filtered(
      'SUBQUERY(items, $item, $item.done = true OR $item.in_progress = true).@count = 0 SORT(id DESC)',
    );
  }

  @computed
  get pendingReadings(): Realm.Results<IReading> {
    return this.readings.filtered(
      'SUBQUERY(readings, $reading, $reading.done = true OR $reading.in_progress = true).@count = 0 AND pagesComplete = 0 SORT(id DESC)',
    );
  }

  @computed
  get inProgressTodos(): Realm.Results<ITodo> {
    return this.todos.filtered(
      'done = false AND in_progress = true SORT(id DESC)',
    );
  }

  @computed
  get inProgressGroups(): Realm.Results<IGroup> {
    return this.groups.filtered(
      'SUBQUERY(items, $item, $item.done = false AND $item.in_progress = true).@count > 0 SORT(id DESC)',
    );
  }

  @computed
  get inProgressReadings(): Realm.Results<IReading> {
    return this.readings.filtered(
      'SUBQUERY(readings, $reading, $reading.done = false AND $reading.in_progress = true).@count > 0 OR pagesComplete > 0 AND pagesComplete < pagesTotal SORT(id DESC)',
    );
  }

  @computed
  get completedTodos(): Realm.Results<ITodo> {
    return this.todos.filtered(
      'done = true AND in_progress = false SORT(id DESC)',
    );
  }

  @computed
  get completedGroups(): Realm.Results<IGroup> {
    return this.groups.filtered(
      'SUBQUERY(items, $item, $item.done = true AND $item.in_progress = false).@count > 0 SORT(id DESC)',
    );
  }

  @computed
  get completedReadings(): Realm.Results<IReading> {
    return this.readings.filtered(
      'SUBQUERY(readings, $reading, $reading.done = true AND $reading.in_progress = false).@count > 0 OR pagesComplete = pagesTotal SORT(id DESC)',
    );
  }

  private _initTodoList() {
    try {
      realm.write(() => {
        let todoList = {
          creationDate: new Date(),
        };
        realm.create(TodoListSchema.name, todoList);
      });
    } catch (error) {
      console.log(kLogTag + ' error initializing todoList');
    }
  }
}

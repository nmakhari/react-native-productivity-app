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
import { observable, action, computed, runInAction } from 'mobx';

const kLogTag = 'TodoListStore';

export interface ITodoListStore {
  readonly todoList: ITodoList;
  readonly groups: Realm.List<IGroup>;
  readonly readings: Realm.List<IReading>;
  readonly todos: Realm.List<ITodo>;

  createTodo(name: string): void;
  getTodo(id: number): ITodo | undefined;
  toggleTodoState(id: number): void;
  deleteTodo(id: number): void;

  createGroup(name: string, description?: string): void;
  getGroup(id: number): IGroup | undefined;
  deleteGroup(id: number): void;

  createGroupTodo(name: string, points: number, group: IGroup): void;
  getGroupTodo(id: number): IGroupTodo | undefined;
  toggleGroupTodoState(id: number): void;
  deleteGroupTodo(id: number): void;

  createReading(name: string, pagesTotal: number, pagesComplete?: number): void;
  getReading(id: number): IReading | undefined;
  deleteReading(id: number): void;

  createReadingTodo(
    name: string,
    pageStart: number,
    pageEnd: number,
    reading: IReading,
  ): void;
  getReadingTodo(id: number): IReadingTodo | undefined;
  toggleReadingTodoState(id: number): void;
  deleteReadingTodo(id: number): void;
}

export class TodoListStore implements ITodoListStore {
  @observable todoList: ITodoList;

  constructor() {
    runInAction(() => {
      this.todoList = realm.objects<ITodoList>(TodoListSchema.name)[0];

      if (!this.todoList) {
        this._initTodoList();
      }

      console.log(kLogTag + ' todo list initialized');
    });
  }

  @action
  createTodo(name: string) {
    let id = 1;

    const currentTodos = this.todos.sorted('id', true);

    if (currentTodos.length > 0) {
      id = currentTodos[0].id + 1;
    }

    const newTodo = {
      id: id,
      name: name,
      done: false,
    };

    try {
      realm.write(() => {
        this.todoList.items.push(realm.create(TodoSchema.name, newTodo));
      });
    } catch (error) {
      console.log(kLogTag + ' error adding Todo' + ' error: ' + error);
    }
  }

  getTodo(id: number): ITodo | undefined {
    return realm.objectForPrimaryKey<ITodo>(TodoSchema.name, id);
  }

  @action
  toggleTodoState(id: number) {
    const selectedTodo = this.getTodo(id);

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
  createGroup(name: string, description?: string) {
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
    }
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

  createGroupTodo(name: string, points: number, group: IGroup) {
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
      }
      return;
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

  toggleGroupTodoState(id: number) {
    const selectedGroupTodo = this.getGroupTodo(id);

    if (selectedGroupTodo) {
      const parentGroup = this.getGroup(selectedGroupTodo.group.id);

      if (!parentGroup) {
        console.log(
          kLogTag +
            ' error parent group of groupTodo name: ' +
            selectedGroupTodo.name +
            ' could not be found during toggle',
        );
        return;
      }

      try {
        realm.write(() => {
          selectedGroupTodo.done = !selectedGroupTodo.done;

          if (selectedGroupTodo.done) {
            parentGroup.pointsCompleted += selectedGroupTodo.points;
            console.log('incrementing group points on toggle');
          } else {
            parentGroup.pointsCompleted -= selectedGroupTodo.points;
            console.log('decrementing group points on toggle');
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error could not toggle GroupTodo with name: ' +
            selectedGroupTodo.name +
            ' error: ' +
            error,
        );
      }
      return;
    }
    console.log(
      kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to toggle',
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

  createReading(name: string, pagesTotal: number, pagesComplete?: number) {
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
    }
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
  ) {
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
      }
      return;
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

  toggleReadingTodoState(id: number) {
    const selectedReadingTodo = this.getReadingTodo(id);

    if (selectedReadingTodo) {
      const parentReading = this.getReading(selectedReadingTodo.reading.id);

      if (!parentReading) {
        console.log(
          kLogTag +
            ' error, could not find parent reading to toggle ReadingTodo name: ' +
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
          } else {
            parentReading.pagesComplete -=
              selectedReadingTodo.pageEnd - selectedReadingTodo.pageStart;
          }
        });
      } catch (error) {
        console.log(
          kLogTag +
            ' error, could not toggle ReadingTodo name: ' +
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
        ' to toggle',
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

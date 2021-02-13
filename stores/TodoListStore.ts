import realm, {
  GroupTodoSchema,
  GroupSchema,
  ReadingTodoSchema,
  ReadingSchema,
  TodoSchema,
  TodoListSchema,
} from '../db/realmSchemas';
import {IGroup, IGroupTodo} from '../db/Groups';
import {IReading, IReadingTodo} from '../db/Readings';
import {ITodo} from '../db/Todo';
import {ITodoList} from '../db/TodoList';
import {observable, action, computed, runInAction} from 'mobx';

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

  // createGroup(name: string, description?: string): void;
  // getGroup(id: number): IGroup | undefined;
  // deleteGroup(id: number): void;

  // createGroupTodo(name: string, points: number, group: IGroup): void;
  // getGroupTodo(id: number): IGroupTodo | undefined;
  // toggleGroupTodoState(id: number): void;
  // deleteGroupTodo(id: number): void;

  // createReading(name: string, pagesTotal: number, pagesComplete?: number): void;
  // getReading(id: number): IReading | undefined;
  // deleteReading(id: number): void;

  // TODO: ReadingTodo crud + propagate to parent reading
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

  // createGroup(name: string, description?: string) {
  //   const orderedGroups:
  //     | Realm.Results<Group & Realm.Object>
  //     | undefined = this.groups?.sorted('id', true);

  //   let id: number = 1;

  //   if (orderedGroups) {
  //     id = orderedGroups[0] ? orderedGroups[0].id + 1 : 1;
  //   }

  //   const newGroup: Group = new Group(id, name, new Date(), description);

  //   try {
  //     realm.write(() => {
  //       this.todoList.groups?.push(realm.create(Group.schema.name, newGroup));
  //     });
  //   } catch (error) {
  //     console.log(kLogTag + ' error creating group => name: ' + name);
  //   }
  // }

  // getGroup(id: number): Group | undefined {
  //   return realm.objectForPrimaryKey<Group>(Group.schema.name, id);
  // }

  // deleteGroup(id: number) {
  //   const selectedGroup: Group | undefined = this.getGroup(id);
  //   if (selectedGroup) {
  //     try {
  //       realm.write(() => {
  //         realm.delete(selectedGroup.items);
  //         realm.delete(selectedGroup);
  //       });
  //     } catch (error) {
  //       console.log(kLogTag + ' error deleting group => id: ' + id);
  //     }
  //     return;
  //   }

  //   console.log(
  //     kLogTag + ' could not find group with id: ' + id + ' to delete',
  //   );
  // }

  // createGroupTodo(name: string, points: number, group: Group) {
  //   const selectedGroup: Group | undefined = this.getGroup(group.id);

  //   if (selectedGroup) {
  //     const orderedGroupTodos:
  //       | Realm.Results<GroupTodo & Realm.Object>
  //       | undefined = group.items?.sorted('id', true);

  //     let id: number = 1;

  //     if (orderedGroupTodos) {
  //       id = orderedGroupTodos[0] ? orderedGroupTodos[0].id + 1 : 1;
  //     }

  //     const newGroupTodo = new GroupTodo(id, name, points, group);
  //     try {
  //       realm.write(() => {
  //         selectedGroup.items?.push(
  //           realm.create(GroupTodo.schema.name, newGroupTodo),
  //         );
  //         selectedGroup.pointTotal += points;
  //       });
  //     } catch (error) {
  //       console.log(
  //         kLogTag +
  //           ' error creating group todo name: ' +
  //           name +
  //           ' group name: ' +
  //           group.name +
  //           ' error: ' +
  //           error,
  //       );
  //     }
  //     return;
  //   }
  //   console.log(
  //     kLogTag +
  //       ' error couldnt find selected group to create groupTodo name: ' +
  //       name,
  //   );
  // }

  // getGroupTodo(id: number): GroupTodo | undefined {
  //   return realm.objectForPrimaryKey<GroupTodo>(GroupTodo.schema.name, id);
  // }

  // toggleGroupTodoState(id: number) {
  //   const selectedGroupTodo: GroupTodo | undefined = this.getGroupTodo(id);

  //   if (selectedGroupTodo) {
  //     const parentGroup: Group | undefined = this.getGroup(
  //       selectedGroupTodo.group.id,
  //     );

  //     if (!parentGroup) {
  //       console.log(
  //         kLogTag +
  //           ' error parent group of groupTodo name: ' +
  //           selectedGroupTodo.name +
  //           ' could not be found during toggle',
  //       );
  //       return;
  //     }

  //     try {
  //       realm.write(() => {
  //         selectedGroupTodo.done = !selectedGroupTodo.done;

  //         if (selectedGroupTodo.done) {
  //           parentGroup.pointsCompleted += selectedGroupTodo.points;
  //           console.log('incrementing group points on toggle');
  //         } else {
  //           parentGroup.pointsCompleted -= selectedGroupTodo.points;
  //           console.log('decrementing group points on toggle');
  //         }
  //       });
  //     } catch (error) {
  //       console.log(
  //         kLogTag +
  //           ' error could not toggle GroupTodo with name: ' +
  //           selectedGroupTodo.name +
  //           ' id: ' +
  //           id,
  //       );
  //     }
  //     return;
  //   }
  //   console.log(
  //     kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to toggle',
  //   );
  // }

  // deleteGroupTodo(id: number) {
  //   const selectedGroupTodo: GroupTodo | undefined = this.getGroupTodo(id);

  //   if (selectedGroupTodo) {
  //     try {
  //       realm.write(() => {
  //         selectedGroupTodo.group.pointTotal -= selectedGroupTodo.points;
  //         if (selectedGroupTodo.done) {
  //           selectedGroupTodo.group.pointsCompleted -= selectedGroupTodo.points;
  //         }
  //         realm.delete(selectedGroupTodo);
  //       });
  //     } catch (error) {
  //       console.log(
  //         kLogTag +
  //           ' error could not delete GroupTodo with name: ' +
  //           selectedGroupTodo.name +
  //           ' id: ' +
  //           id,
  //       );
  //     }
  //     return;
  //   }
  //   console.log(
  //     kLogTag + ' error, could not find GroupTodo => id: ' + id + ' to delete',
  //   );
  // }

  // createReading(name: string, pagesTotal: number, pagesComplete?: number) {
  //   const orderedReadings:
  //     | Realm.Results<Reading & Realm.Object>
  //     | undefined = this.todoList.readings?.sorted('id', true);

  //   let id: number = 1;

  //   if (orderedReadings) {
  //     id = orderedReadings[0] ? orderedReadings[0].id + 1 : 1;
  //   }

  //   const newReading: Reading = new Reading(
  //     id,
  //     name,
  //     new Date(),
  //     pagesTotal,
  //     pagesComplete,
  //   );

  //   try {
  //     realm.write(() => {
  //       this.todoList.readings?.push(
  //         realm.create(Reading.schema.name, newReading),
  //       );
  //     });
  //   } catch (error) {
  //     console.log(kLogTag + ' error creating reading => name: ' + name);
  //   }
  // }

  // getReading(id: number): Reading | undefined {
  //   return realm.objectForPrimaryKey<Reading>(Reading.schema.name, id);
  // }

  // deleteReading(id: number) {
  //   const selectedReading: Reading | undefined = this.getReading(id);

  //   if (selectedReading) {
  //     try {
  //       realm.write(() => {
  //         realm.delete(selectedReading.readings);
  //         realm.delete(selectedReading);
  //       });
  //     } catch (error) {
  //       console.log(kLogTag + ' error deleting reading => id: ' + id);
  //     }
  //     return;
  //   }

  //   console.log(
  //     kLogTag + ' could not find reading with id: ' + id + ' to delete',
  //   );
  // }

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

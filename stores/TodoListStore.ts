import realm, {TodoList, Group, Reading, Todo} from '../db/RealmSchemas';

const kLogTag = 'TodoListStore';

export interface ITodoListStore {
  readonly todoList: TodoList;
  readonly groups?: Realm.List<Group & Realm.Object> | null;
  readonly readings?: Realm.List<Reading & Realm.Object> | null;
  readonly todos?: Realm.List<Todo & Realm.Object> | null;

  addTodo(name: string): void;
  toggleTodoState(id: number): void;
  deleteTodo(id: number): void;
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

  addTodo(name: string) {
    const orderedTodos:
      | Realm.Results<Todo & Realm.Object>
      | undefined = this.todos?.sorted('id', true);

    const latestTodo: (Todo & Realm.Object) | undefined = orderedTodos
      ? orderedTodos[0]
      : undefined;

    const id: number = latestTodo ? latestTodo.id + 1 : 1;
    const newTodo = new Todo(id, name, false);

    try {
      realm.write(() => {
        this.todoList.items?.push(realm.create(Todo.schema.name, newTodo));
      });
    } catch (error) {
      console.log(kLogTag + ' error adding Todo');
    }

    console.log('got here');
  }

  toggleTodoState(id: number) {
    const selectedTodo: Todo | undefined = realm.objectForPrimaryKey<Todo>(
      Todo.schema.name,
      id,
    );

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
    const selectedTodo: Todo | undefined = realm.objectForPrimaryKey<Todo>(
      Todo.schema.name,
      id,
    );

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

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Text, View, Button} from 'react-native';
import {TodoListStore} from './stores/TodoListStore';
import {observer} from 'mobx-react';

@observer
export default class App extends React.Component {
  render() {
    const store = new TodoListStore();

    const onAddTodoPressed = () => {
      store.createTodo('test' + store.todos.length);
    };

    const onDeleteTodoPressed = () => {
      while (store.todos.length > 0) {
        console.log('delete iteration todo');
        store.todos.forEach((todo) => {
          if (todo) {
            console.log('deleting ' + todo.name);
            store.deleteTodo(todo.id);
          }
        });
      }
    };

    const onAddGroupPressed = () => {
      store.createGroup('test' + store.groups.length);
    };

    const onDeleteGroupPressed = () => {
      while (store.groups.length > 0) {
        console.log('delete iteration group');
        store.groups.forEach((group) => {
          if (group) {
            console.log('deleting' + group.name);
            store.deleteGroup(group.id);
          }
        });
      }
    };

    const onAddGroupTodoPressed = () => {
      if (store.groups.length > 0) {
        const group = store.groups[0];
        store.createGroupTodo('test' + group.items.length, 5, group);
      }
    };

    const onDeleteGroupTodoPressed = () => {
      if (store.groups.length > 0) {
        const group = store.groups[0];
        while (group.items.length > 0) {
          group.items.forEach((item) => {
            if (item) {
              store.deleteGroupTodo(item.id);
            }
          });
        }
      }
    };

    const onToggleGroupTodoPressed = () => {
      if (store.groups.length > 0 && store.groups[0].items.length > 0) {
        const groupTodo = store.groups[0].items[0];
        store.toggleGroupTodoState(groupTodo.id);
      }
    };

    return (
      <View>
        <Text>TODOS:</Text>
        <Text> {store.todos.map((todo) => todo.name)}</Text>
        <Button title={'Add todo'} onPress={onAddTodoPressed} />
        <Button title={'Delete todo'} onPress={onDeleteTodoPressed} />
        <Text>Groups:</Text>
        <Text>
          {' '}
          {store.groups.map(
            (group) =>
              group.name +
              ' ' +
              group.pointsTotal +
              ' ' +
              group.pointsCompleted,
          )}
        </Text>
        <Button title={'Add group'} onPress={onAddGroupPressed} />
        <Button title={'Delete group'} onPress={onDeleteGroupPressed} />
        <Text>Group Todos:</Text>
        <Text>
          {store.groups.length > 0
            ? store.groups[0].items.map(
                (groupTodo) => groupTodo.name + ' ' + groupTodo.group.id,
              )
            : ''}
        </Text>
        <Button title={'Add group todo'} onPress={onAddGroupTodoPressed} />
        <Button
          title={'Delete group todo'}
          onPress={onDeleteGroupTodoPressed}
        />
        <Button
          title={'Toggle group todo'}
          onPress={onToggleGroupTodoPressed}
        />
      </View>
    );
  }
}

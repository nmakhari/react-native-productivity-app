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

    const onAddReadingPressed = () => {
      store.createReading('test' + store.readings.length, 55);
    };

    const onDeleteReadingPressed = () => {
      while (store.readings.length > 0) {
        store.readings.forEach((reading) => {
          if (reading) {
            store.deleteReading(reading.id);
          }
        });
      }
    };

    const onAddReadingTodoPressed = () => {
      if (store.readings.length > 0) {
        const parentReading = store.readings[0];
        store.createReadingTodo(
          'test' + parentReading.readings.length,
          1,
          20,
          parentReading,
        );
      }
    };

    const onDeleteReadingTodoPressed = () => {
      if (store.readings.length > 0) {
        const parentReading = store.readings[0];
        while (parentReading.readings.length > 0) {
          parentReading.readings.forEach((reading) => {
            if (reading) {
              store.deleteReadingTodo(reading.id);
            }
          });
        }
      }
    };

    const onToggleReadingTodoPressed = () => {
      if (store.readings.length > 0 && store.readings[0].readings.length > 0) {
        store.toggleReadingTodoState(store.readings[0].readings[0].id);
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
        <Text>Reading:</Text>
        <Text>
          {store.readings.map(
            (reading) =>
              reading.name +
              ' ' +
              reading.pagesTotal +
              ' ' +
              reading.pagesComplete,
          )}
        </Text>
        <Button title={'Add reading'} onPress={onAddReadingPressed} />
        <Button title={'Delete reading'} onPress={onDeleteReadingPressed} />
        <Text>ReadingTodo:</Text>
        <Text>
          {store.readings.length > 0
            ? store.readings[0].readings.map((reading) => reading.name)
            : ''}
        </Text>
        <Button title={'Add reading todo'} onPress={onAddReadingTodoPressed} />
        <Button
          title={'Delete reading todo'}
          onPress={onDeleteReadingTodoPressed}
        />
        <Button
          title={'Toggle reading todo'}
          onPress={onToggleReadingTodoPressed}
        />
      </View>
    );
  }
}

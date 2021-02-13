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

    const onAddPressed = () => {
      store.createTodo('test' + store.todos.length);
    };

    const onDeletePressed = () => {
      while (store.todos.length > 0) {
        store.todos.forEach((todo) => {
        console.log('delete iteration');
          if (todo) {
            console.log('deleting ' + todo.name);
            store.deleteTodo(todo.id);
          }
        });
      }
    };
    return (
      <View>
        <Text> {store.todos.map((todo) => todo.name)}</Text>
        <Button title={'Add todo'} onPress={onAddPressed} />
        <Button title={'Delete todo'} onPress={onDeletePressed} />
      </View>
    );
  }
}

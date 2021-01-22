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
import {Text, View} from 'react-native';
import {TodoListStore} from './stores/TodoListStore';

export default class App extends React.Component {
  render() {
    const store = new TodoListStore();
    return (
      <View>
        <Text> {JSON.stringify(store.todoList.toJSON())}</Text>
      </View>
    );
  }
}

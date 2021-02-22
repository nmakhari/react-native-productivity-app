import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TodoList } from '../screens/TodoStackNavigatorScreens/TodoList';
import { ViewItem } from '../screens/ViewItem';
import { AddItem } from '../screens/TodoStackNavigatorScreens/AddItem';
import { EditItem } from '../screens/TodoStackNavigatorScreens/EditItem';

export interface ITodoStackNavigatorProps {}

type TodoStackNavigatorParamList = {};

export default class TodoStackNavigator extends React.Component<ITodoStackNavigatorProps> {
  stack: any;

  constructor(props: ITodoStackNavigatorProps) {
    super(props);
    this.stack = createStackNavigator<TodoStackNavigatorParamList>();
  }

  render() {
    return (
      <this.stack.Navigator initialRouteName="TodoList">
        <this.stack.Screen name="TodoList" component={TodoList} />
        <this.stack.Screen name="ViewItem" component={ViewItem} />
        <this.stack.Screen name="AddItem" component={AddItem} />
        <this.stack.Screen name="EditItem" component={EditItem} />
      </this.stack.Navigator>
    );
  }
}

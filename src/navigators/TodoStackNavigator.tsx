import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TodoList } from '../screens/TodoStackNavigatorScreens/TodoList';
import { ViewItem } from '../screens/ViewItem';
import { AddItem } from '../screens/TodoStackNavigatorScreens/AddItem';
import { EditItem } from '../screens/TodoStackNavigatorScreens/EditItem';
import { ITodoListStore } from '../../stores/TodoListStore';
import { DisplayItem } from '../components/DisplayList';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from './TabNavigator';
import { RouteProp } from '@react-navigation/native';

type TodoStackNavigatorNavigationProp = MaterialBottomTabNavigationProp<
  TabNavigatorParamList,
  'Todo'
>;

type TodoStackNavigatorRouteProp = RouteProp<TabNavigatorParamList, 'Todo'>;

interface IProps {
  navigation: TodoStackNavigatorNavigationProp;
  route: TodoStackNavigatorRouteProp;
}

export type TodoStackNavigatorParamList = {
  TodoList: { todoListStore: ITodoListStore };
  ViewItem: { item: DisplayItem };
  AddItem: { todoListStore: ITodoListStore };
  EditItem: { todoListStore: ITodoListStore; item: DisplayItem };
};

export default class TodoStackNavigator extends React.Component<IProps> {
  stack: any;

  constructor(props: IProps) {
    super(props);
    this.stack = createStackNavigator<TodoStackNavigatorParamList>();
  }

  render() {
    const todoListStore = this.props.route.params.todoListStore;
    return (
      <this.stack.Navigator initialRouteName="TodoList">
        <this.stack.Screen
          name="TodoList"
          component={TodoList}
          initialParams={{ todoListStore: todoListStore }}
          options={{ headerShown: false }}
        />
        <this.stack.Screen name="ViewItem" component={ViewItem} />
        <this.stack.Screen
          name="AddItem"
          component={AddItem}
          initialParams={{ todoListStore: todoListStore }}
        />
        <this.stack.Screen
          name="EditItem"
          component={EditItem}
          initialParams={{ todoListStore: todoListStore }}
        />
      </this.stack.Navigator>
    );
  }
}

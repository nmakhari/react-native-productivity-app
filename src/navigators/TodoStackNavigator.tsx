import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TodoList } from '../screens/TodoStackNavigatorScreens/TodoList';
import AddTodo from '../screens/TodoStackNavigatorScreens/AddTodo';
import AddGroup from '../screens/TodoStackNavigatorScreens/AddGroup';
import { EditItem } from '../screens/TodoStackNavigatorScreens/EditItem';
import { ITodoListStore } from '../../stores/TodoListStore';
import { DisplayItemType } from '../components/DisplayList';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from './TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Colors } from '../shared/Colors';
import { ProgressState } from '../shared/Utils';

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
  AddTodo: { todoListStore: ITodoListStore; progressState: ProgressState };
  AddGroup: { todoListStore: ITodoListStore; progressState: ProgressState };
  EditItem: { todoListStore: ITodoListStore; item: DisplayItemType };
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
        <this.stack.Screen
          name="AddTodo"
          component={AddTodo}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.Pending,
          }}
          options={{
            title: 'New Todo',
            headerStyle: Styles.navHeader,
            headerTintColor: 'white',
          }}
        />
        <this.stack.Screen
          name="AddGroup"
          component={AddGroup}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.Pending,
          }}
          options={{
            title: 'New Group',
            headerStyle: Styles.navHeader,
            headerTintColor: 'white',
          }}
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

const Styles = StyleSheet.create({
  navHeader: {
    backgroundColor: Colors.primaryGreyDark,
  },
});

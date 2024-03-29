import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { TodoList } from '../screens/TodoStackNavigatorScreens/TodoList';
import UpdateTodo from '../screens/TodoStackNavigatorScreens/UpdateTodo';
import UpdateGroup from '../screens/TodoStackNavigatorScreens/UpdateGroup';
import { ITodoListStore } from '../../stores/TodoListStore';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { MainTabNavigatorParamList } from './MainTabNavigator';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { ProgressState } from '../shared/Utils';
import UpdateReading from '../screens/TodoStackNavigatorScreens/UpdateReading';
import SharedStyles from '../shared/SharedStyles';
import { ExistingTodo } from '../components/TodoForm';
import { ExistingGroup } from '../components/GroupForm';
import { ExistingReading } from '../components/ReadingForm';
import { RootStackNavigatorParamList } from './RootStackNavigator';

export type TodoStackNavigatorNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackNavigatorParamList, 'MainTabNavigator'>,
  MaterialBottomTabNavigationProp<MainTabNavigatorParamList, 'Todo'>
>;

type TodoStackNavigatorRouteProp = RouteProp<MainTabNavigatorParamList, 'Todo'>;

interface IProps {
  navigation: TodoStackNavigatorNavigationProp;
  route: TodoStackNavigatorRouteProp;
}

export type TodoStackNavigatorParamList = {
  TodoList: { todoListStore: ITodoListStore };
  UpdateTodo: {
    todoListStore: ITodoListStore;
    progressState: ProgressState;
    existingTodo?: ExistingTodo;
  };
  UpdateGroup: {
    todoListStore: ITodoListStore;
    existingGroup?: ExistingGroup;
  };
  UpdateReading: {
    todoListStore: ITodoListStore;
    existingReading?: ExistingReading;
  };
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
          name="UpdateTodo"
          component={UpdateTodo}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.Pending,
          }}
          options={{
            title: 'New Todo',
            headerStyle: SharedStyles.navHeader,
            headerTintColor: 'white',
          }}
        />
        <this.stack.Screen
          name="UpdateGroup"
          component={UpdateGroup}
          initialParams={{
            todoListStore: todoListStore,
          }}
          options={{
            title: 'New Group',
            headerStyle: SharedStyles.navHeader,
            headerTintColor: 'white',
          }}
        />
        <this.stack.Screen
          name="UpdateReading"
          component={UpdateReading}
          initialParams={{
            todoListStore: todoListStore,
          }}
          options={{
            title: 'New Reading',
            headerStyle: SharedStyles.navHeader,
            headerTintColor: 'white',
          }}
        />
      </this.stack.Navigator>
    );
  }
}

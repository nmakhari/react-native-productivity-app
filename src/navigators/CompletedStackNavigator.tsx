import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { CompletedList } from '../screens/CompletedStackNavigatorScreens/CompletedList';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { MainTabNavigatorParamList } from './MainTabNavigator';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { ITodoListStore } from '../../stores/TodoListStore';
import { ProgressState } from '../shared/Utils';
import { ExistingGroup } from '../components/GroupForm';
import { ExistingTodo } from '../components/TodoForm';
import { ExistingReading } from '../components/ReadingForm';
import SharedStyles from '../shared/SharedStyles';
import UpdateTodo from '../screens/CompletedStackNavigatorScreens/UpdateTodo';
import UpdateGroup from '../screens/CompletedStackNavigatorScreens/UpdateGroup';
import UpdateReading from '../screens/CompletedStackNavigatorScreens/UpdateReading';
import { RootStackNavigatorParamList } from './RootStackNavigator';

export type CompletedStackNavigatorNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackNavigatorParamList, 'MainTabNavigator'>,
  MaterialBottomTabNavigationProp<MainTabNavigatorParamList, 'Completed'>
>;

type CompletedStackNavigatorRouteProp = RouteProp<
  MainTabNavigatorParamList,
  'Completed'
>;

interface IProps {
  navigation: CompletedStackNavigatorNavigationProp;
  route: CompletedStackNavigatorRouteProp;
}

export type CompletedStackNavigatorParamsList = {
  CompletedList: { todoListStore: ITodoListStore };
  UpdateTodo: {
    todoListStore: ITodoListStore;
    progressState: ProgressState;
    existingTodo?: ExistingTodo;
  };
  UpdateGroup: { todoListStore: ITodoListStore; existingGroup?: ExistingGroup };
  UpdateReading: {
    todoListStore: ITodoListStore;
    existingReading?: ExistingReading;
  };
};

export class CompletedStackNavigator extends React.Component<IProps> {
  stack: any;

  constructor(props: IProps) {
    super(props);
    this.stack = createStackNavigator<CompletedStackNavigatorParamsList>();
  }

  render() {
    const todoListStore = this.props.route.params.todoListStore;
    return (
      <this.stack.Navigator initialRouteName="CompletedList">
        <this.stack.Screen
          name="CompletedList"
          component={CompletedList}
          initialParams={{ todoListStore: todoListStore }}
          options={{ headerShown: false }}
        />
        <this.stack.Screen
          name="UpdateTodo"
          component={UpdateTodo}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.Complete,
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

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { InProgressList } from '../screens/InProgressStackNavigatorScreens/InProgressList';
import { MainTabNavigatorParamList } from './MainTabNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import SharedStyles from '../shared/SharedStyles';
import { ProgressState } from '../shared/Utils';
import UpdateTodo from '../screens/InProgressStackNavigatorScreens/UpdateTodo';
import UpdateGroup from '../screens/InProgressStackNavigatorScreens/UpdateGroup';
import UpdateReading from '../screens/InProgressStackNavigatorScreens/UpdateReading';
import { ExistingTodo } from '../components/TodoForm';
import { ExistingGroup } from '../components/GroupForm';
import { ExistingReading } from '../components/ReadingForm';

type InProgressStackNavigatorNavigationProp = MaterialBottomTabNavigationProp<
  MainTabNavigatorParamList,
  'InProgress'
>;

type InProgressStackNavigatorRouteProp = RouteProp<
  MainTabNavigatorParamList,
  'InProgress'
>;

interface IProps {
  navigation: InProgressStackNavigatorNavigationProp;
  route: InProgressStackNavigatorRouteProp;
}

export type InProgressStackNavigatorParamsList = {
  InProgressList: { todoListStore: ITodoListStore };
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

export default class InProgressStackNavigator extends React.Component<IProps> {
  stack: any;

  constructor(props: IProps) {
    super(props);
    this.stack = createStackNavigator<InProgressStackNavigatorParamsList>();
  }

  render() {
    const todoListStore = this.props.route.params.todoListStore;
    return (
      <this.stack.Navigator initialRouteName="InProgressList">
        <this.stack.Screen
          name="InProgressList"
          component={InProgressList}
          initialParams={{ todoListStore: todoListStore }}
          options={{ headerShown: false }}
        />
        <this.stack.Screen
          name="UpdateTodo"
          component={UpdateTodo}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.InProgress,
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

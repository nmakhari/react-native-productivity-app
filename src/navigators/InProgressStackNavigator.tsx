import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { InProgressList } from '../screens/InProgressStackNavigatorScreens/InProgressList';
import { TabNavigatorParamList } from './TabNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import SharedStyles from '../shared/SharedStyles';
import { ProgressState } from '../shared/Utils';
import AddTodo from '../screens/InProgressStackNavigatorScreens/AddTodo';
import AddGroup from '../screens/InProgressStackNavigatorScreens/AddGroup';
import AddReading from '../screens/InProgressStackNavigatorScreens/AddReading';

type InProgressStackNavigatorNavigationProp = MaterialBottomTabNavigationProp<
  TabNavigatorParamList,
  'InProgress'
>;

type InProgressStackNavigatorRouteProp = RouteProp<
  TabNavigatorParamList,
  'InProgress'
>;

interface IProps {
  navigation: InProgressStackNavigatorNavigationProp;
  route: InProgressStackNavigatorRouteProp;
}

export type InProgressStackNavigatorParamsList = {
  InProgressList: { todoListStore: ITodoListStore };
  AddTodo: { todoListStore: ITodoListStore; progressState: ProgressState };
  AddGroup: { todoListStore: ITodoListStore; progressState: ProgressState };
  AddReading: { todoListStore: ITodoListStore; progressState: ProgressState };
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
          name="AddTodo"
          component={AddTodo}
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
          name="AddGroup"
          component={AddGroup}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.InProgress,
          }}
          options={{
            title: 'New Group',
            headerStyle: SharedStyles.navHeader,
            headerTintColor: 'white',
          }}
        />
        <this.stack.Screen
          name="AddReading"
          component={AddReading}
          initialParams={{
            todoListStore: todoListStore,
            progressState: ProgressState.InProgress,
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

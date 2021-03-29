import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { InProgressList } from '../screens/InProgressStackNavigatorScreens/InProgressList';
import { TabNavigatorParamList } from './TabNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { RouteProp } from '@react-navigation/native';

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
      </this.stack.Navigator>
    );
  }
}

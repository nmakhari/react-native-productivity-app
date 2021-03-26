import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { ViewItem } from '../screens/ViewItem';
import { InProgressList } from '../screens/InProgressStackNavigatorScreens/InProgressList';
import { TabNavigatorParamList } from './TabNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { DisplayItem } from '../components/DisplayList';

type InProgressStackNavigatorNavigationProp = MaterialBottomTabNavigationProp<
  TabNavigatorParamList,
  'InProgress'
>;

type InProgressStackNavigatorRouteProp = RouteProp<
  TabNavigatorParamList,
  'InProgress'
>;

export interface IInProgressStackNavigatorProps {
  navigation: InProgressStackNavigatorNavigationProp;
  route: InProgressStackNavigatorRouteProp;
}

export type InProgressStackNavigatorParamsList = {
  InProgressList: { todoListStore: ITodoListStore };
  ViewItem: { item: DisplayItem };
};

export default class InProgressStackNavigator extends React.Component<IInProgressStackNavigatorProps> {
  stack: any;

  constructor(props: IInProgressStackNavigatorProps) {
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
        <this.stack.Screen name="ViewItem" component={ViewItem} />
      </this.stack.Navigator>
    );
  }
}

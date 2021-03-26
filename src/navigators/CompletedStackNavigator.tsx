import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ViewItem } from '../screens/ViewItem';
import { CompletedList } from '../screens/CompletedStackNavigatorScreens/CompletedList';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from './TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { ITodoListStore } from '../../stores/TodoListStore';
import { DisplayItem } from '../components/DisplayList';

type CompletedStackNavigatorNavigationProp = MaterialBottomTabNavigationProp<
  TabNavigatorParamList,
  'Completed'
>;

type CompletedStackNavigatorRouteProp = RouteProp<
  TabNavigatorParamList,
  'Completed'
>;

interface IProps {
  navigation: CompletedStackNavigatorNavigationProp;
  route: CompletedStackNavigatorRouteProp;
}

export type CompletedStackNavigatorParamsList = {
  CompletedList: { todoListStore: ITodoListStore };
  ViewItem: { item: DisplayItem };
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
        <this.stack.Screen name="ViewItem" component={ViewItem} />
      </this.stack.Navigator>
    );
  }
}

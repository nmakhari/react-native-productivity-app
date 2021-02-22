import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { ViewItem } from '../screens/ViewItem';
import { InProgressList } from '../screens/InProgressStackNavigatorScreens/InProgressList';

export interface IInProgressStackNavigatorProps {
  readonly todoListStore: ITodoListStore;
}

type InProgressStackNavigatorParamsList = {};

export default class InProgressStackNavigator extends React.Component<IInProgressStackNavigatorProps> {
  stack: any;

  constructor(props: IInProgressStackNavigatorProps) {
    super(props);
    this.stack = createStackNavigator<InProgressStackNavigatorParamsList>();
  }

  render() {
    return (
      <this.stack.Navigator initialRouteName="InProgressList">
        <this.stack.Screen name="InProgressList" component={InProgressList} />
        <this.stack.Screen name="ViewItem" component={ViewItem} />
      </this.stack.Navigator>
    );
  }
}

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ViewItem } from '../screens/ViewItem';
import { CompletedList } from '../screens/CompletedStackNavigatorScreens/CompletedList';

export interface ICompletedStackNavigatorProps {}

type CompletedStackNavigatorParamsList = {};

export default class CompletedStackNavigator extends React.Component<ICompletedStackNavigatorProps> {
  stack: any;

  constructor(props: ICompletedStackNavigatorProps) {
    super(props);
    this.stack = createStackNavigator<CompletedStackNavigatorParamsList>();
  }

  render() {
    return (
      <this.stack.Navigator initialRouteName="CompletedList">
        <this.stack.Screen name="CompletedList" component={CompletedList} />
        <this.stack.Screen name="ViewItem" component={ViewItem} />
      </this.stack.Navigator>
    );
  }
}

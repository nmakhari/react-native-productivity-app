import React from 'react';
import { View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';
import { computed } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections } from '../../shared/Utils';
import SharedStyles from '../../shared/SharedStyles';

type CompletedListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CompletedStackNavigatorParamsList, 'CompletedList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type CompletedListScreenRouteProp = RouteProp<
  CompletedStackNavigatorParamsList,
  'CompletedList'
>;

interface IProps {
  navigation: CompletedListScreenNavigationProp;
  route: CompletedListScreenRouteProp;
}

export class CompletedList extends React.Component<IProps> {
  render() {
    return (
      <View style={SharedStyles.listRoot}>
        <DisplayList data={this.completedListData} />
      </View>
    );
  }

  @computed
  private get completedListData(): IDisplayItemSection[] {
    const todoListStore = this.props.route.params.todoListStore;
    const todos = todoListStore.completedTodos;
    const groups = todoListStore.completedGroups;
    const readings = todoListStore.completedReadings;

    return formatSections(todos, groups, readings);
  }
}

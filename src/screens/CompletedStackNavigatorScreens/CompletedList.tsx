import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';
import { computed } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import formatSections from '../../shared/FormatSections';
import { Colors } from '../../shared/Colors';

type CompletedListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CompletedStackNavigatorParamsList, 'CompletedList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type CompletedListScreenRouteProp = RouteProp<
  CompletedStackNavigatorParamsList,
  'CompletedList'
>;

export interface ICompletedListProps {
  navigation: CompletedListScreenNavigationProp;
  route: CompletedListScreenRouteProp;
}

export class CompletedList extends React.Component<ICompletedListProps> {
  render() {
    return (
      <View style={Styles.root}>
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

const Styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 15,
    backgroundColor: Colors.primaryGrey,
  },
});

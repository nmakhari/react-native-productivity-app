import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';
import { computed } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import formatSections from '../../shared/FormatSections';
import { Colors } from '../../shared/Colors';

type InProgressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'InProgressList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type InProgressListScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'InProgressList'
>;

export interface IInProgressListProps {
  navigation: InProgressScreenNavigationProp;
  route: InProgressListScreenRouteProp;
}

export class InProgressList extends React.Component<IInProgressListProps> {
  render() {
    return (
      <View style={Styles.root}>
        <DisplayList data={this.inProgressListData} />
      </View>
    );
  }

  @computed
  private get inProgressListData(): IDisplayItemSection[] {
    const todoListStore = this.props.route.params.todoListStore;
    const todos = todoListStore.inProgressTodos;
    const groups = todoListStore.inProgressGroups;
    const readings = todoListStore.inProgressReadings;

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

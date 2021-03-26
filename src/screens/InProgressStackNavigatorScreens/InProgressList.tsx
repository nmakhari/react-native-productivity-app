import React from 'react';
import { View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';
import { computed } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections } from '../../shared/Utils';
import SharedStyles from '../../shared/SharedStyles';

type InProgressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'InProgressList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type InProgressListScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'InProgressList'
>;

interface IProps {
  navigation: InProgressScreenNavigationProp;
  route: InProgressListScreenRouteProp;
}

export class InProgressList extends React.Component<IProps> {
  render() {
    return (
      <View style={SharedStyles.listRoot}>
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

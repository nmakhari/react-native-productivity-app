import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import formatSections from '../../shared/FormatSections';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../shared/Colors';

type TodoListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'TodoList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type TodoListScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
  'TodoList'
>;

export interface ITodoListProps {
  navigation: TodoListScreenNavigationProp;
  route: TodoListScreenRouteProp;
}

@observer
export class TodoList extends React.Component<ITodoListProps> {
  render() {
    return (
      <View style={Styles.root}>
        <DisplayList data={this.todoListData} />
      </View>
    );
  }

  @computed
  private get todoListData(): IDisplayItemSection[] {
    const todoListStore = this.props.route.params.todoListStore;
    const todos = todoListStore.pendingTodos;
    const groups = todoListStore.pendingGroups;
    const readings = todoListStore.pendingReadings;

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

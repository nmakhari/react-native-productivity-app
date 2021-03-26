import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections } from '../../shared/Utils';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import SharedStyles from '../../shared/SharedStyles';
import { View } from 'react-native';

type TodoListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'TodoList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type TodoListScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
  'TodoList'
>;

interface IProps {
  navigation: TodoListScreenNavigationProp;
  route: TodoListScreenRouteProp;
}

@observer
export class TodoList extends React.Component<IProps> {
  render() {
    return (
      <View style={SharedStyles.listRoot}>
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

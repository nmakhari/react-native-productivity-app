import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections, ProgressState } from '../../shared/Utils';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import SharedStyles from '../../shared/SharedStyles';
import { View } from 'react-native';
import AddItemFABGroup from '../../components/AddItemFABGroup';

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
  @observable private isFABOpen: boolean;

  constructor(props: IProps) {
    super(props);
    makeObservable(this);
    runInAction(() => {
      this.isFABOpen = false;
    });
  }

  render() {
    return (
      <View style={SharedStyles.listRoot}>
        <DisplayList data={this.todoListData} />
        <AddItemFABGroup
          open={this.isFABOpen}
          onPress={this.openFAB}
          onClosePressed={this.closeFAB}
          onTodoPressed={this.onCreateTodoPressed}
          onGroupPressed={this.onCreateGroupPressed}
          onReadingPressed={this.onCreateReadingPressed}
        />
      </View>
    );
  }

  @action
  private openFAB = () => {
    this.isFABOpen = true;
  };

  @action
  private closeFAB = () => {
    this.isFABOpen = false;
  };

  private onCreateTodoPressed = () => {
    console.log('Todo pressed');
    this.props.navigation.navigate('AddTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Pending,
    });
    this.closeFAB();
  };

  private onCreateGroupPressed = () => {
    console.log('Group pressed');
    this.props.navigation.navigate('AddGroup', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Pending,
    });
    this.closeFAB();
  };

  private onCreateReadingPressed = () => {
    console.log('Reading pressed');
    this.props.navigation.navigate('AddReading', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Pending,
    });
    this.closeFAB();
  };

  @computed
  private get todoListData(): IDisplayItemSection[] {
    const todoListStore = this.props.route.params.todoListStore;
    const todos = todoListStore.pendingTodos;
    const groups = todoListStore.pendingGroups;
    const readings = todoListStore.pendingReadings;

    return formatSections(todos, groups, readings);
  }
}

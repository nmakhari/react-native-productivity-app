import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
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
import { ITodo } from '../../../db/Todo';
import { IGroup } from '../../../db/Groups';
import { IReading } from '../../../db/Readings';

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
  @observable private todoListData: IDisplayItemSection[];

  private todos: Realm.Results<ITodo & Realm.Object>;
  private groups: Realm.Results<IGroup & Realm.Object>;
  private readings: Realm.Results<IReading & Realm.Object>;

  constructor(props: IProps) {
    super(props);
    makeObservable(this);
    const { todoListStore } = props.route.params;
    this.todos = todoListStore.pendingTodos;
    this.groups = todoListStore.pendingGroups;
    this.readings = todoListStore.pendingReadings;
    runInAction(() => {
      this.isFABOpen = false;
      this.todoListData = formatSections(
        this.todos,
        this.groups,
        this.readings,
      );
    });
  }
  // TODO: Create data formatting for each section independently so that only the changed section is recalculated
  componentDidMount() {
    this.todos.addListener(() => this.onDataChanged());
    this.groups.addListener(() => this.onDataChanged());
    this.readings.addListener(() => this.onDataChanged());
  }

  componentWillUnmount() {
    this.todos.removeListener;
    this.groups.removeListener;
    this.readings.removeListener;
  }

  // toJS needs to be applied to the mobx observable array in order to work properly with SectionList
  render() {
    return (
      <View style={SharedStyles.listRoot}>
        <DisplayList
          todoListStore={this.props.route.params.todoListStore}
          data={toJS(this.todoListData)}
          progressState={ProgressState.Pending}
        />
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

  @action
  private onDataChanged(): void {
    console.log('recalculating todolist data');
    this.todoListData = formatSections(this.todos, this.groups, this.readings);
  }
}

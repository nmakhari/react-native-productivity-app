import React from 'react';
import { View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';
import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections, ProgressState } from '../../shared/Utils';
import SharedStyles from '../../shared/SharedStyles';
import { ITodo } from '../../../db/Todo';
import { IGroup } from '../../../db/Groups';
import { IReading } from '../../../db/Readings';
import { observer } from 'mobx-react';

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

@observer
export class CompletedList extends React.Component<IProps> {
  @observable private completedListData: IDisplayItemSection[];
  private todos: Realm.Results<ITodo & Realm.Object>;
  private groups: Realm.Results<IGroup & Realm.Object>;
  private readings: Realm.Results<IReading & Realm.Object>;

  constructor(props: IProps) {
    super(props);
    makeObservable(this);
    const { todoListStore } = props.route.params;
    this.todos = todoListStore.completedTodos;
    this.groups = todoListStore.completedGroups;
    this.readings = todoListStore.completedReadings;
    runInAction(() => {
      this.completedListData = formatSections(
        this.todos,
        this.groups,
        this.readings,
      );
    });
  }

  // Todo: Create data formatting for each section independently so that only the changed section is recalculated
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
  render() {
    return (
      <View style={SharedStyles.listRoot}>
        <DisplayList
          todoListStore={this.props.route.params.todoListStore}
          data={toJS(this.completedListData)}
          progressState={ProgressState.Complete}
          onEditTodoPressed={this.onEditTodoPressed}
          onEditGroupPressed={this.onEditGroupPressed}
          onEditReadingPressed={this.onEditReadingPressed}
        />
      </View>
    );
  }

  private onEditTodoPressed = (todo: ITodo) => {
    console.log('Edit Todo Pressed');
    this.props.navigation.navigate('UpdateTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Complete,
      existingTodo: {
        id: todo.id,
        initialValues: { name: todo.name, description: todo.description },
      },
    });
  };

  private onEditGroupPressed = (group: IGroup) => {
    console.log('Edit Group Pressed');
    this.props.navigation.navigate('UpdateGroup', {
      todoListStore: this.props.route.params.todoListStore,
      existingGroup: {
        id: group.id,
        creationDate: group.creationDate,
        pointsCompleted: group.pointsCompleted,
        pointsTotal: group.pointsTotal,
        items: group.items,
        initialValues: {
          name: group.name,
          description: group.description,
        },
      },
    });
  };

  private onEditReadingPressed = (reading: IReading) => {
    console.log('Edit Reading Pressed');
    this.props.navigation.navigate('UpdateReading', {
      todoListStore: this.props.route.params.todoListStore,
      existingReading: {
        id: reading.id,
        creationDate: reading.creationDate,
        readings: reading.readings,
        initialValues: {
          name: reading.name,
          pagesTotal: reading.pagesTotal.toString(),
          pagesComplete: reading.pagesComplete.toString(),
        },
      },
    });
  };

  @action
  private onDataChanged(): void {
    console.log('recalculating completedListData data');
    this.completedListData = formatSections(
      this.todos,
      this.groups,
      this.readings,
    );
  }
}

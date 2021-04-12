import React from 'react';
import { View } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';
import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections, ProgressState } from '../../shared/Utils';
import SharedStyles from '../../shared/SharedStyles';
import { ITodo } from '../../../db/Todo';
import { IGroup } from '../../../db/Groups';
import { IReading } from '../../../db/Readings';
import { observer } from 'mobx-react';
import AddItemFABGroup from '../../components/AddItemFABGroup';

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

@observer
export class InProgressList extends React.Component<IProps> {
  @observable private isFABOpen: boolean;
  @observable private inProgressListData: IDisplayItemSection[];

  private todos: Realm.Results<ITodo & Realm.Object>;
  private groups: Realm.Results<IGroup & Realm.Object>;
  private readings: Realm.Results<IReading & Realm.Object>;

  constructor(props: IProps) {
    super(props);
    makeObservable(this);
    const { todoListStore } = props.route.params;
    this.todos = todoListStore.inProgressTodos;
    this.groups = todoListStore.inProgressGroups;
    this.readings = todoListStore.inProgressReadings;
    runInAction(() => {
      this.isFABOpen = false;
      this.inProgressListData = formatSections(
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
          data={toJS(this.inProgressListData)}
          progressState={ProgressState.InProgress}
          onEditTodoPressed={this.onEditTodoPressed}
          onEditGroupPressed={this.onEditGroupPressed}
          onEditReadingPressed={this.onEditReadingPressed}
        />
        <AddItemFABGroup
          open={this.isFABOpen}
          onPress={this.openFAB}
          onClosePressed={this.closeFAB}
          onTodoPressed={this.onCreateTodoPressed}
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
    this.props.navigation.navigate('UpdateTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.InProgress,
    });
    this.closeFAB();
  };

  private onEditTodoPressed = (todo: ITodo) => {
    console.log('Edit Todo Pressed');
    this.props.navigation.navigate('UpdateTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.InProgress,
      existingTodo: {
        id: todo.id,
        initialValues: { name: todo.name, description: todo.description },
      },
    });
    this.closeFAB();
  };

  private onCreateGroupPressed = () => {
    console.log('Create Group pressed');
    this.props.navigation.navigate('UpdateGroup', {
      todoListStore: this.props.route.params.todoListStore,
    });
    this.closeFAB();
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
    this.closeFAB();
  };

  private onCreateReadingPressed = () => {
    console.log('Create Reading Pressed');
    this.props.navigation.navigate('UpdateReading', {
      todoListStore: this.props.route.params.todoListStore,
    });
    this.closeFAB();
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
    this.closeFAB();
  };

  @action
  private onDataChanged(): void {
    console.log('recalculating inProgressList data');
    this.inProgressListData = formatSections(
      this.todos,
      this.groups,
      this.readings,
    );
  }
}

import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import { formatSections, ProgressState } from '../../shared/Utils';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  TodoStackNavigatorNavigationProp,
  TodoStackNavigatorParamList,
} from '../../navigators/TodoStackNavigator';
import { RouteProp } from '@react-navigation/native';
import SharedStyles from '../../shared/SharedStyles';
import { View } from 'react-native';
import AddItemFABGroup from '../../components/AddItemFABGroup';
import { ITodo } from '../../../db/Todo';
import { IGroup } from '../../../db/Groups';
import { IReading } from '../../../db/Readings';

type TodoListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'TodoList'>,
  TodoStackNavigatorNavigationProp
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
          onGroupPressed={this.onGroupPressed}
          onReadingPressed={this.onReadingPressed}
          progressState={ProgressState.Pending}
          onEditTodoPressed={this.onEditTodoPressed}
          onEditGroupPressed={this.onEditGroupPressed}
          onEditReadingPressed={this.onEditReadingPressed}
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
    console.log('Create Todo pressed');
    this.props.navigation.navigate('UpdateTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Pending,
    });
    this.closeFAB();
  };

  private onGroupPressed = (group: IGroup) => {
    console.log('Group Pressed');
    this.props.navigation.navigate('ChildTabNavigator', {
      todoListStore: this.props.route.params.todoListStore,
      groupId: group.id,
    });
  };

  private onReadingPressed = (reading: IReading) => {
    console.log('Reading Pressed');
    this.props.navigation.navigate('ChildTabNavigator', {
      todoListStore: this.props.route.params.todoListStore,
      readingId: reading.id,
    });
  };

  private onEditTodoPressed = (todo: ITodo) => {
    console.log('Edit Todo Pressed');
    this.props.navigation.navigate('UpdateTodo', {
      todoListStore: this.props.route.params.todoListStore,
      progressState: ProgressState.Pending,
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
    console.log('recalculating todolist data');
    this.todoListData = formatSections(this.todos, this.groups, this.readings);
  }
}

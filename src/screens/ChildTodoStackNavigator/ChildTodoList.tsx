import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native';
import { IGroupTodo } from '../../../db/Groups';
import { IReadingTodo } from '../../../db/Readings';
import AddItemFABGroup from '../../components/AddItemFABGroup';
import DisplayList, { IDisplayItemSection } from '../../components/DisplayList';
import {
  ChildTodoStackNavigatorNavigationProp,
  ChildTodoStackNavigatorParamList,
} from '../../navigators/ChildTodoStackNavigator';
import SharedStyles from '../../shared/SharedStyles';
import { formatSections, ProgressState } from '../../shared/Utils';

type ChildTodoListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ChildTodoStackNavigatorParamList, 'ChildTodoList'>,
  ChildTodoStackNavigatorNavigationProp
>;

type ChildTodoListScreenRouteProp = RouteProp<
  ChildTodoStackNavigatorParamList,
  'ChildTodoList'
>;

interface IProps {
  navigation: ChildTodoListScreenNavigationProp;
  route: ChildTodoListScreenRouteProp;
}

@observer
export class ChildTodoList extends React.Component<IProps> {
  @observable private isFABOpen: boolean;
  @observable private todoListData: IDisplayItemSection[];

  private groupTodos?: Realm.Results<IGroupTodo & Realm.Object>;
  private readingTodos?: Realm.Results<IReadingTodo & Realm.Object>;

  constructor(props: IProps) {
    super(props);
    makeObservable(this);
    const { todoListStore, groupId, readingId } = props.route.params;
    runInAction(() => {
      this.isFABOpen = false;
      if (groupId && groupId > -1) {
        this.groupTodos = todoListStore.getPendingGroupTodos(groupId);
      }
      if (readingId && readingId > -1) {
        this.readingTodos = todoListStore.getPendingReadingTodos(readingId);
      }
      this.todoListData = formatSections(
        undefined,
        undefined,
        undefined,
        this.groupTodos,
        this.readingTodos,
      );
    });
  }

  componentDidMount() {
    if (this.groupTodos) {
      this.groupTodos.addListener(() => this.onDataChanged());
    }
    if (this.readingTodos) {
      this.readingTodos.addListener(() => this.onDataChanged());
    }
  }

  componentWillUnmount() {
    if (this.groupTodos) {
      this.groupTodos.removeListener;
    }
    if (this.readingTodos) {
      this.readingTodos.removeListener;
    }
  }

  render() {
    return (
      <View style={SharedStyles.listRoot}>
        <DisplayList
          todoListStore={this.props.route.params.todoListStore}
          data={toJS(this.todoListData)}
          progressState={ProgressState.Pending}
          onEditGroupTodoPressed={this.onEditGroupTodoPressed}
          onEditReadingTodoPressed={this.onEditReadingTodoPressed}
        />
        <AddItemFABGroup
          open={this.isFABOpen}
          onPress={this.openFAB}
          onClosePressed={this.closeFAB}
          onGroupTodoPressed={
            this.groupTodos ? this.onCreateGroupTodoPressed : undefined
          }
          onReadingTodoPressed={
            this.readingTodos ? this.onCreateReadingTodoPressed : undefined
          }
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

  private onCreateGroupTodoPressed = () => {
    console.log('Create Group Todo Pressed');
    const { todoListStore, groupId } = this.props.route.params;
    this.props.navigation.navigate('UpdateGroupTodo', {
      todoListStore: todoListStore,
      progressState: ProgressState.Pending,
      parentGroupId: groupId ?? -1,
    });
    this.closeFAB();
  };

  private onCreateReadingTodoPressed = () => {
    console.log('Create Reading Todo Pressed');
    const { todoListStore, readingId } = this.props.route.params;
    this.props.navigation.navigate('UpdateReadingTodo', {
      todoListStore: todoListStore,
      progressState: ProgressState.Pending,
      parentReadingId: readingId ?? -1,
    });
    this.closeFAB();
  };

  private onEditGroupTodoPressed = (groupTodo: IGroupTodo) => {
    console.log('Edit group todo pressed');
    const { todoListStore, groupId } = this.props.route.params;
    this.props.navigation.navigate('UpdateGroupTodo', {
      todoListStore: todoListStore,
      parentGroupId: groupId ?? -1,
      progressState: ProgressState.Pending,
      existingGroupTodo: {
        id: groupTodo.id,
        group: groupTodo.group,
        initialValues: {
          name: groupTodo.name,
          points: groupTodo.points.toString(),
        },
      },
    });
  };

  private onEditReadingTodoPressed = (readingTodo: IReadingTodo) => {
    console.log('Edit reading todo pressed');
    const { todoListStore, readingId } = this.props.route.params;
    this.props.navigation.navigate('UpdateReadingTodo', {
      todoListStore: todoListStore,
      parentReadingId: readingId ?? -1,
      progressState: ProgressState.Pending,
      existingReadingTodo: {
        id: readingTodo.id,
        reading: readingTodo.reading,
        initialValues: {
          name: readingTodo.name,
          pageStart: readingTodo.pageStart.toString(),
          pageEnd: readingTodo.pageEnd.toString(),
        },
      },
    });
  };

  @action
  private onDataChanged(): void {
    console.log('recalculating child todolist data');
    this.todoListData = formatSections(
      undefined,
      undefined,
      undefined,
      this.groupTodos,
      this.readingTodos,
    );
  }
}

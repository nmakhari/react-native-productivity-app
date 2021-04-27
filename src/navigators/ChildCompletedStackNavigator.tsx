import React from 'react';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { ITodoListStore } from '../../stores/TodoListStore';
import { ChildTabNavigatorParamList } from './ChildTabNavigator';
import { RootStackNavigatorParamList } from './RootStackNavigator';
import { ProgressState } from '../shared/Utils';
import { ExistingGroupTodo } from '../components/GroupTodoForm';
import SharedStyles from '../shared/SharedStyles';
import UpdateGroupTodo from '../screens/ChildCompletedStackNavigator/UpdateGroupTodo';
import { ChildCompletedList } from '../screens/ChildCompletedStackNavigator/ChildCompletedList';

export type ChildCompletedStackNavigatorNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackNavigatorParamList, 'ChildTabNavigator'>,
  MaterialBottomTabNavigationProp<ChildTabNavigatorParamList, 'ChildInProgress'>
>;

type ChildCompletedStackNavigatorRouteProp = RouteProp<
  ChildTabNavigatorParamList,
  'ChildInProgress'
>;

interface IProps {
  navigation: ChildCompletedStackNavigatorNavigationProp;
  route: ChildCompletedStackNavigatorRouteProp;
}

export type ChildCompletedStackNavigatorParamList = {
  ChildCompletedList: {
    todoListStore: ITodoListStore;
    groupId?: number;
    readingId?: number;
  };
  UpdateGroupTodo: {
    todoListStore: ITodoListStore;
    progressState: ProgressState;
    parentGroupId: number;
    existingGroupTodo?: ExistingGroupTodo;
  };
  // UpdateReadingTodo: {
  //     todoListStore: ITodoListStore;
  //     progressState: ProgressState;
  //     parentReadingId: number;
  //     existingReadingTodo?: ExistingReadingTodo;
  // };
};

const Stack = createStackNavigator<ChildCompletedStackNavigatorParamList>();

const ChildCompletedStackNavigator: React.FunctionComponent<IProps> = ({
  route,
}) => {
  const { todoListStore, groupId, readingId } = route.params;

  return (
    <Stack.Navigator initialRouteName="ChildCompletedList">
      <Stack.Screen
        name="ChildCompletedList"
        component={ChildCompletedList}
        initialParams={{
          todoListStore: todoListStore,
          groupId: groupId,
          readingId: readingId,
        }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateGroupTodo"
        component={UpdateGroupTodo}
        initialParams={{
          todoListStore: todoListStore,
          progressState: ProgressState.Complete,
          parentGroupId: groupId,
        }}
        options={{
          title: 'Group Todo',
          headerStyle: SharedStyles.navHeader,
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

/*
    <Stack.Screen
        name="UpdateGroupTodo"
        component={ChildTodoList}
        initialParams={{ todoListStore: todoListStore, progressState: ProgressState.InProgress }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateReadingTodo"
        component={ChildTodoList}
        initialParams={{ todoListStore: todoListStore, progressState: ProgressState.InProgress, parentReadingId: readingId }}
        options={{ headerShown: false }}
      />
*/

export default ChildCompletedStackNavigator;

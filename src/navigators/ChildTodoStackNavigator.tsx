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
import UpdateGroupTodo from '../screens/ChildTodoStackNavigator/UpdateGroupTodo';
import { ChildTodoList } from '../screens/ChildTodoStackNavigator/ChildTodoList';
import SharedStyles from '../shared/SharedStyles';
import { ExistingReadingTodo } from '../components/ReadingTodoForm';
import UpdateReadingTodo from '../screens/ChildTodoStackNavigator/UpdateReadingTodo';

export type ChildTodoStackNavigatorNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackNavigatorParamList, 'ChildTabNavigator'>,
  MaterialBottomTabNavigationProp<ChildTabNavigatorParamList, 'ChildTodo'>
>;

type ChildTodoStackNavigatorRouteProp = RouteProp<
  ChildTabNavigatorParamList,
  'ChildTodo'
>;

interface IProps {
  navigation: ChildTodoStackNavigatorNavigationProp;
  route: ChildTodoStackNavigatorRouteProp;
}

export type ChildTodoStackNavigatorParamList = {
  ChildTodoList: {
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
  UpdateReadingTodo: {
    todoListStore: ITodoListStore;
    progressState: ProgressState;
    parentReadingId: number;
    existingReadingTodo?: ExistingReadingTodo;
  };
};

const Stack = createStackNavigator<ChildTodoStackNavigatorParamList>();

const ChildTodoStackNavigator: React.FunctionComponent<IProps> = ({
  route,
}) => {
  const { todoListStore, groupId, readingId } = route.params;

  return (
    <Stack.Navigator initialRouteName="ChildTodoList">
      <Stack.Screen
        name="ChildTodoList"
        component={ChildTodoList}
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
          progressState: ProgressState.Pending,
          parentGroupId: groupId,
        }}
        options={{
          title: 'Group Todo',
          headerStyle: SharedStyles.navHeader,
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen
        name="UpdateReadingTodo"
        component={UpdateReadingTodo}
        initialParams={{
          todoListStore: todoListStore,
          progressState: ProgressState.Pending,
          parentReadingId: readingId,
        }}
        options={{
          title: 'Reading Todo',
          headerStyle: SharedStyles.navHeader,
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChildTodoStackNavigator;

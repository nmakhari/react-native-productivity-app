import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import GroupTodoForm from '../../components/GroupTodoForm';
import { ChildInProgressStackNavigatorParamList } from '../../navigators/ChildInProgressStackNavigator';
import { ChildTabNavigatorParamList } from '../../navigators/ChildTabNavigator';

type UpdateGroupTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ChildInProgressStackNavigatorParamList,
    'UpdateGroupTodo'
  >,
  MaterialBottomTabNavigationProp<ChildTabNavigatorParamList>
>;

type UpdateGroupTodoScreenRouteProp = RouteProp<
  ChildInProgressStackNavigatorParamList,
  'UpdateGroupTodo'
>;

interface IProps {
  navigation: UpdateGroupTodoScreenNavigationProp;
  route: UpdateGroupTodoScreenRouteProp;
}

const UpdateGroupTodo: React.FunctionComponent<IProps> = ({
  navigation,
  route,
}) => {
  const {
    todoListStore,
    progressState,
    existingGroupTodo,
    parentGroupId,
  } = route.params;

  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <GroupTodoForm
      todoListStore={todoListStore}
      progressState={progressState}
      parentGroupId={parentGroupId}
      onFormSubmit={onFormSubmit}
      existingGroupTodo={existingGroupTodo}
    />
  );
};

export default UpdateGroupTodo;

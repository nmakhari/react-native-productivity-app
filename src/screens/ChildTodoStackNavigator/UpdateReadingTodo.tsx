import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import ReadingTodoForm from '../../components/ReadingTodoForm';
import { ChildTabNavigatorParamList } from '../../navigators/ChildTabNavigator';
import { ChildTodoStackNavigatorParamList } from '../../navigators/ChildTodoStackNavigator';

type UpdateReadingTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<ChildTodoStackNavigatorParamList, 'UpdateReadingTodo'>,
  MaterialBottomTabNavigationProp<ChildTabNavigatorParamList>
>;

type UpdateReadingTodoScreenRouteProp = RouteProp<
  ChildTodoStackNavigatorParamList,
  'UpdateReadingTodo'
>;

interface IProps {
  navigation: UpdateReadingTodoScreenNavigationProp;
  route: UpdateReadingTodoScreenRouteProp;
}

const UpdateReadingTodo: React.FunctionComponent<IProps> = ({
  navigation,
  route,
}) => {
  const {
    todoListStore,
    progressState,
    existingReadingTodo,
    parentReadingId,
  } = route.params;

  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <ReadingTodoForm
      todoListStore={todoListStore}
      progressState={progressState}
      parentReadingId={parentReadingId}
      onFormSubmit={onFormSubmit}
      existingReadingTodo={existingReadingTodo}
    />
  );
};

export default UpdateReadingTodo;

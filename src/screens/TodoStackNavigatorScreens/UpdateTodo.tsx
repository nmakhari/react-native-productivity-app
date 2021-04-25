import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainTabNavigatorParamList } from '../../navigators/MainTabNavigator';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import TodoForm from '../../components/TodoForm';

type UpdateTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'UpdateTodo'>,
  MaterialBottomTabNavigationProp<MainTabNavigatorParamList>
>;

type UpdateTodoScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
  'UpdateTodo'
>;

interface IProps {
  navigation: UpdateTodoScreenNavigationProp;
  route: UpdateTodoScreenRouteProp;
}

const UpdateTodo: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore, progressState, existingTodo } = route.params;
  const onFormSubmit = () => {
    navigation.pop();
  };
  return (
    <TodoForm
      todoListStore={todoListStore}
      progressState={progressState}
      onFormSubmit={onFormSubmit}
      existingTodo={existingTodo}
    />
  );
};

export default UpdateTodo;

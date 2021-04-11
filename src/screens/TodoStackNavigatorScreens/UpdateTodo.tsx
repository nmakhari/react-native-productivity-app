import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';
import TodoForm from '../../components/TodoForm';

type AddTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'UpdateTodo'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddTodoScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
  'UpdateTodo'
>;

interface IProps {
  navigation: AddTodoScreenNavigationProp;
  route: AddTodoScreenRouteProp;
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

import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import TodoForm from '../../components/TodoForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';

type UpdateTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'UpdateTodo'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type UpdateTodoScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
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

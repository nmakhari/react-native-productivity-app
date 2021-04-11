import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import TodoForm from '../../components/TodoForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';

type AddTodoScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'AddTodo'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddTodoScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'AddTodo'
>;

interface IProps {
  navigation: AddTodoScreenNavigationProp;
  route: AddTodoScreenRouteProp;
}

const AddTodo: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore, progressState } = route.params;
  const onFormSubmit = () => {
    navigation.pop();
  };
  return (
    <TodoForm
      todoListStore={todoListStore}
      progressState={progressState}
      onFormSubmit={onFormSubmit}
    />
  );
};

export default AddTodo;

import React, { FunctionComponent } from 'react';
import Card from './Card';
import { ITodo } from '../../db/Todo';
import { TodoState, getTodoState } from '../shared/GetTodoState';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { StyleSheet } from 'react-native';

export interface ITodoCardProps {
  todo: ITodo;
  // TODO: Add additional functionality for onPress and sliding
}

const TodoCard: FunctionComponent<ITodoCardProps> = ({ todo }) => {
  const state = getTodoState(todo);
  return <Card title={todo.name} rightContent={getRightContent(state)} />;
};

function getRightContent(state: TodoState): JSX.Element {
  switch (state) {
    case TodoState.Pending:
      return (
        <MaterialCommunityIcons
          name="format-list-checkbox"
          color={Colors.secondaryGreen}
          size={40}
          style={Styles.icon}
        />
      );
    case TodoState.InProgress:
      return (
        <MaterialCommunityIcons
          name="progress-check"
          color={Colors.secondaryGreen}
          size={40}
          style={Styles.icon}
        />
      );
    case TodoState.Complete:
      return (
        <MaterialCommunityIcons
          name="check-circle-outline"
          color={Colors.secondaryGreen}
          size={40}
          style={Styles.icon}
        />
      );
  }
}

export default TodoCard;

const Styles = StyleSheet.create({
  icon: {
    paddingTop: 10,
  },
});

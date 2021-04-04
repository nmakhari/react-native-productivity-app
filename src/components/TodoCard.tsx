import React, { FunctionComponent } from 'react';
import Card from './Card';
import { ITodo } from '../../db/Todo';
import { ProgressState, getTodoState } from '../shared/Utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { StyleSheet } from 'react-native';

interface IProps {
  todo: ITodo;
  onPress: (todo: ITodo) => void;
  // TODO: add functionality for sliding
}
const TodoCard: FunctionComponent<IProps> = ({ todo, onPress }) => {
  const onPressTriggered = () => {
    onPress(todo);
  };

  const state = getTodoState(todo);
  return (
    <Card
      title={todo.name}
      description={todo.description}
      rightContent={getRightContent(state)}
      onPress={onPressTriggered}
    />
  );
};

function getRightContent(state: ProgressState): JSX.Element {
  switch (state) {
    case ProgressState.Pending:
      return (
        <MaterialCommunityIcons
          name="format-list-checkbox"
          color={Colors.secondaryGreen}
          size={40}
          style={Styles.icon}
        />
      );
    case ProgressState.InProgress:
      return (
        <MaterialCommunityIcons
          name="progress-check"
          color={Colors.secondaryGreen}
          size={40}
          style={Styles.icon}
        />
      );
    case ProgressState.Complete:
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

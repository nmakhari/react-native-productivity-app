import React, { FunctionComponent } from 'react';
import Card from './Card';
import { ITodo } from '../../db/Todo';
import { ProgressState } from '../shared/Utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { StyleSheet } from 'react-native';

interface IProps {
  todo: ITodo;
  onPress: (todo: ITodo) => void;
  progressState: ProgressState;
  onSwipableLeftOpen?: () => void;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const TodoCard: FunctionComponent<IProps> = ({
  todo,
  onPress,
  progressState,
  onSwipableLeftOpen,
  onEditPressed,
  onDeletePressed,
}) => {
  const onPressTriggered = () => {
    onPress(todo);
  };

  return (
    <Card
      title={todo.name}
      description={todo.description}
      rightContent={getRightContent(progressState)}
      onPress={onPressTriggered}
      progressState={progressState}
      onSwipableLeftOpen={onSwipableLeftOpen}
      onEditPressed={onEditPressed}
      onDeletePressed={onDeletePressed}
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

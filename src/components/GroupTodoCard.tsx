import React, { FunctionComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProgressState } from '../shared/Utils';
import { Colors } from '../shared/Colors';
import Card from './Card';
import { IGroupTodo } from '../../db/Groups';

interface IProps {
  groupTodo: IGroupTodo;
  onPress: (groupTodo: IGroupTodo) => void;
  progressState: ProgressState;
  onSwipableLeftOpen?: () => void;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const GroupTodoCard: FunctionComponent<IProps> = ({
  groupTodo,
  onPress,
  progressState,
  onSwipableLeftOpen,
  onEditPressed,
  onDeletePressed,
}) => {
  const onPressTriggered = () => {
    onPress(groupTodo);
  };

  return (
    <Card
      title={groupTodo.name}
      rightContent={<Text style={Styles.pointText}>{groupTodo.points}</Text>}
      onPress={onPressTriggered}
      progressState={progressState}
      onSwipableLeftOpen={onSwipableLeftOpen}
      onEditPressed={onEditPressed}
      onDeletePressed={onDeletePressed}
    />
  );
};

export default GroupTodoCard;

const Styles = StyleSheet.create({
  pointText: {
    color: Colors.secondaryGreen,
    fontSize: 25,
    paddingTop: 10,
  },
});

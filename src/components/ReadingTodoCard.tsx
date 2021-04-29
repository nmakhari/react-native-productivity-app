import React, { FunctionComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ProgressState } from '../shared/Utils';
import { Colors } from '../shared/Colors';
import Card from './Card';
import { IReadingTodo } from '../../db/Readings';

interface IProps {
  readingTodo: IReadingTodo;
  onPress: (readingTodo: IReadingTodo) => void;
  progressState: ProgressState;
  onSwipableLeftOpen?: () => void;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const ReadingTodoCard: FunctionComponent<IProps> = ({
  readingTodo,
  onPress,
  progressState,
  onSwipableLeftOpen,
  onEditPressed,
  onDeletePressed,
}) => {
  const onPressTriggered = () => {
    onPress(readingTodo);
  };

  return (
    <Card
      title={readingTodo.name}
      rightContent={
        <Text style={Styles.pointText}>
          {readingTodo.pageStart} - {readingTodo.pageEnd}
        </Text>
      }
      onPress={onPressTriggered}
      progressState={progressState}
      onSwipableLeftOpen={onSwipableLeftOpen}
      onEditPressed={onEditPressed}
      onDeletePressed={onDeletePressed}
    />
  );
};

export default ReadingTodoCard;

const Styles = StyleSheet.create({
  pointText: {
    color: Colors.secondaryGreen,
    fontSize: 25,
    paddingTop: 10,
  },
});

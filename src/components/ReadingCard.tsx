import React, { FunctionComponent } from 'react';
import Card from './Card';
import { IReading } from '../../db/Readings';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import SharedStyles from '../shared/SharedStyles';
import { Text } from 'react-native';
import { ProgressState } from '../shared/Utils';

interface IProps {
  reading: IReading;
  onPress: (reading: IReading) => void;
  onLongPress: (reading: IReading) => void;
  progressState: ProgressState;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const ReadingCard: FunctionComponent<IProps> = ({
  reading,
  onPress,
  onLongPress,
  progressState,
  onEditPressed,
  onDeletePressed,
}) => {
  const onLongPressTriggered = () => {
    onLongPress(reading);
  };

  const onPressTriggered = () => {
    onPress(reading);
  };

  return (
    <Card
      title={reading.name}
      logo={getLogo()}
      rightContent={getRightContent(reading)}
      onPress={onPressTriggered}
      onLongPress={onLongPressTriggered}
      progressState={progressState}
      onEditPressed={onEditPressed}
      onDeletePressed={onDeletePressed}
    />
  );
};

const getRightContent = (reading: IReading) => {
  const amountCompleted =
    reading.pagesTotal === 0
      ? 0
      : (reading.pagesComplete / reading.pagesTotal) * 100;
  return (
    <AnimatedCircularProgress
      size={80}
      width={7}
      fill={amountCompleted}
      tintColor={Colors.secondaryGreen}
      rotation={0}
      backgroundWidth={10}
      backgroundColor={Colors.primaryGrey}
      children={(fill) => {
        return (
          <Text style={SharedStyles.circularProgressChildText}>
            {reading.pagesComplete}/{reading.pagesTotal}
          </Text>
        );
      }}
    />
  );
};

const getLogo = () => {
  return (
    <MaterialCommunityIcons
      name="book-open-page-variant"
      color={Colors.secondaryGreen}
      size={20}
    />
  );
};

export default ReadingCard;

import React, { FunctionComponent } from 'react';
import Card from './Card';
import { IReading } from '../../db/Readings';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import SharedStyles from '../shared/SharedStyles';
import { Text } from 'react-native';

interface IProps {
  reading: IReading;
  onLongPress: (reading: IReading) => void;
  // TODO: add functionality for sliding
}

const ReadingCard: FunctionComponent<IProps> = ({ reading, onLongPress }) => {
  const onLongPressTriggered = () => {
    onLongPress(reading);
  };

  return (
    <Card
      title={reading.name}
      logo={getLogo()}
      rightContent={getRightContent(reading)}
      onLongPress={onLongPressTriggered}
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

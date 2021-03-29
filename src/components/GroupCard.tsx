import React, { FunctionComponent } from 'react';
import Card from './Card';
import { IGroup } from '../../db/Groups';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { Text } from 'react-native';
import SharedStyles from '../shared/SharedStyles';

interface IProps {
  group: IGroup;
  onLongPress: (group: IGroup) => void;
  // TODO: add functionality for sliding
}

const GroupCard: FunctionComponent<IProps> = ({ group, onLongPress }) => {
  const onLongPressTriggered = () => {
    onLongPress(group);
  };

  return (
    <Card
      title={group.name}
      description={group.description}
      logo={getLogo()}
      rightContent={getRightContent(group)}
      onLongPress={onLongPressTriggered}
    />
  );
};

const getRightContent = (group: IGroup) => {
  const amountCompleted =
    group.pointsTotal === 0
      ? 0
      : (group.pointsCompleted / group.pointsTotal) * 100;
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
            {group.pointsCompleted}/{group.pointsTotal}
          </Text>
        );
      }}
    />
  );
};

const getLogo = () => {
  return (
    <MaterialCommunityIcons
      name="lightbulb-group"
      color={Colors.secondaryGreen}
      size={20}
    />
  );
};

export default GroupCard;

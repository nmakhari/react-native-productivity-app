import React, { FunctionComponent } from 'react';
import Card from './Card';
import { IGroup } from '../../db/Groups';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { Text } from 'react-native';
import SharedStyles from '../shared/SharedStyles';
import { ProgressState } from '../shared/Utils';

interface IProps {
  group: IGroup;
  onLongPress: (group: IGroup) => void;
  progressState: ProgressState;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}

const GroupCard: FunctionComponent<IProps> = ({
  group,
  onLongPress,
  progressState,
  onEditPressed,
  onDeletePressed,
}) => {
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
      progressState={progressState}
      onEditPressed={onEditPressed}
      onDeletePressed={onDeletePressed}
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

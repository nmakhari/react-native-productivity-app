import React, { FunctionComponent } from 'react';
import Card from './Card';
import { IGroup } from '../../db/Groups';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { Text } from 'react-native';
import SharedStyles from '../shared/SharedStyles';

export interface IGroupCardProps {
  group: IGroup;
  // TODO: Add additional functionality for onPress and sliding
}

const GroupCard: FunctionComponent<IGroupCardProps> = ({ group }) => {
  return (
    <Card
      title={group.name}
      description={group.description}
      logo={getLogo()}
      rightContent={getRightContent(group)}
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
      size={60}
      width={7}
      fill={amountCompleted}
      tintColor={Colors.secondaryGreen}
      rotation={0}
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

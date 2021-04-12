import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import GroupForm from '../../components/GroupForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';

type UpdateGroupScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'UpdateGroup'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type UpdateGroupScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'UpdateGroup'
>;

interface IProps {
  navigation: UpdateGroupScreenNavigationProp;
  route: UpdateGroupScreenRouteProp;
}

const UpdateGroup: React.FunctionComponent<IProps> = ({
  navigation,
  route,
}) => {
  const { todoListStore, existingGroup } = route.params;

  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <GroupForm
      todoListStore={todoListStore}
      onFormSubmit={onFormSubmit}
      existingGroup={existingGroup}
    />
  );
};

export default UpdateGroup;

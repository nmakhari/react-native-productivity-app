import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import GroupForm from '../../components/GroupForm';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';
import { MainTabNavigatorParamList } from '../../navigators/MainTabNavigator';

type UpdateGroupScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CompletedStackNavigatorParamsList, 'UpdateGroup'>,
  MaterialBottomTabNavigationProp<MainTabNavigatorParamList>
>;

type UpdateGroupScreenRouteProp = RouteProp<
  CompletedStackNavigatorParamsList,
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

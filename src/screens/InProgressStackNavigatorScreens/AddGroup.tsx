import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import GroupForm from '../../components/GroupForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';

type AddGroupScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'AddGroup'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddGroupScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'AddGroup'
>;

interface IProps {
  navigation: AddGroupScreenNavigationProp;
  route: AddGroupScreenRouteProp;
}

const AddGroup: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore } = route.params;

  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <GroupForm todoListStore={todoListStore} onFormSubmit={onFormSubmit} />
  );
};

export default AddGroup;

import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import ReadingForm from '../../components/ReadingForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';

type UpdateReadingScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'UpdateReading'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type UpdateReadingScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'UpdateReading'
>;

interface IProps {
  navigation: UpdateReadingScreenNavigationProp;
  route: UpdateReadingScreenRouteProp;
}

const UpdateReading: React.FunctionComponent<IProps> = ({
  navigation,
  route,
}) => {
  const { todoListStore, existingReading } = route.params;
  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <ReadingForm
      todoListStore={todoListStore}
      onFormSubmit={onFormSubmit}
      existingReading={existingReading}
    />
  );
};

export default UpdateReading;

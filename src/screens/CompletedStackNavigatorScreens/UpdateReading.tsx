import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import ReadingForm from '../../components/ReadingForm';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';
import { MainTabNavigatorParamList } from '../../navigators/MainTabNavigator';

type UpdateReadingScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CompletedStackNavigatorParamsList, 'UpdateReading'>,
  MaterialBottomTabNavigationProp<MainTabNavigatorParamList>
>;

type UpdateReadingScreenRouteProp = RouteProp<
  CompletedStackNavigatorParamsList,
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

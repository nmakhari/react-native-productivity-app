import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import ReadingForm from '../../components/ReadingForm';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';

type AddReadingScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'AddReading'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddReadingScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'AddReading'
>;

interface IProps {
  navigation: AddReadingScreenNavigationProp;
  route: AddReadingScreenRouteProp;
}

const AddReading: React.FunctionComponent<IProps> = ({ navigation, route }) => {
  const { todoListStore } = route.params;
  const onFormSubmit = () => {
    navigation.pop();
  };

  return (
    <ReadingForm todoListStore={todoListStore} onFormSubmit={onFormSubmit} />
  );
};

export default AddReading;

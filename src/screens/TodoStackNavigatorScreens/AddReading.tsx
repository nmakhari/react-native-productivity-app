import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import ReadingForm from '../../components/ReadingForm';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { TodoStackNavigatorParamList } from '../../navigators/TodoStackNavigator';

type AddReadingScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TodoStackNavigatorParamList, 'AddReading'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type AddReadingScreenRouteProp = RouteProp<
  TodoStackNavigatorParamList,
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

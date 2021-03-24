import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '../../shared/Colors';
import Card from '../../components/Card';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { InProgressStackNavigatorParamsList } from '../../navigators/InProgressStackNavigator';

type InProgressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<InProgressStackNavigatorParamsList, 'InProgressList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type InProgressListScreenRouteProp = RouteProp<
  InProgressStackNavigatorParamsList,
  'InProgressList'
>;

export interface IInProgressListProps {
  navigation: InProgressScreenNavigationProp;
  route: InProgressListScreenRouteProp;
}

export class InProgressList extends React.Component<IInProgressListProps> {
  render() {
    return (
      <>
        <Text>InProgressList screen</Text>
        <Card
          title={'InProgressList'}
          description={'InProgressList description'}
          rightContent={
            <Text style={Styles.rightContent}>InProgress RIGHT</Text>
          }
        />
      </>
    );
  }
}

const Styles = StyleSheet.create({
  rightContent: {
    color: Colors.secondaryGreen,
  },
});

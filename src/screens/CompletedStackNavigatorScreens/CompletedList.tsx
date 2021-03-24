import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Card from '../../components/Card';
import { Colors } from '../../shared/Colors';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { TabNavigatorParamList } from '../../navigators/TabNavigator';
import { RouteProp } from '@react-navigation/native';
import { CompletedStackNavigatorParamsList } from '../../navigators/CompletedStackNavigator';

type CompletedListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CompletedStackNavigatorParamsList, 'CompletedList'>,
  MaterialBottomTabNavigationProp<TabNavigatorParamList>
>;

type TodoListScreenRouteProp = RouteProp<
  CompletedStackNavigatorParamsList,
  'CompletedList'
>;

export interface ICompletedListProps {
  navigation: CompletedListScreenNavigationProp;
  route: TodoListScreenRouteProp;
}

export class CompletedList extends React.Component {
  render() {
    return (
      <>
        <Text>CompletedList Screen</Text>
        <Card
          title={'CompletedList'}
          description={'CompletedList description'}
          rightContent={
            <Text style={Styles.rightContent}>CompletedList RIGHT</Text>
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

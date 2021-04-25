import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { FunctionComponent } from 'react';
import TodoStackNavigator from './TodoStackNavigator';
import InProgressStackNavigator from './InProgressStackNavigator';
import { CompletedStackNavigator } from './CompletedStackNavigator';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { ITodoListStore } from '../../stores/TodoListStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackNavigatorParamList } from './RootStackNavigator';
import { RouteProp } from '@react-navigation/native';

type MainTabNavigatorNavigationProp = StackNavigationProp<
  RootStackNavigatorParamList,
  'MainTabNavigator'
>;

type MainTabNavigatorRouteProp = RouteProp<
  RootStackNavigatorParamList,
  'MainTabNavigator'
>;

interface IProps {
  navigation: MainTabNavigatorNavigationProp;
  route: MainTabNavigatorRouteProp;
}

export type MainTabNavigatorParamList = {
  Todo: { todoListStore: ITodoListStore };
  InProgress: { todoListStore: ITodoListStore };
  Completed: { todoListStore: ITodoListStore };
};

const Tab = createMaterialBottomTabNavigator<MainTabNavigatorParamList>();

const MainTabNavigator: FunctionComponent<IProps> = ({ route }) => {
  const todoListStore = route.params.todoListStore;

  return (
    <Tab.Navigator
      initialRouteName="Todo"
      shifting={true}
      activeColor={Colors.secondaryGreen}
      inactiveColor={Colors.secondaryGreenLight}
      barStyle={Styles.NavigationBar}>
      <Tab.Screen
        name="Todo"
        component={TodoStackNavigator}
        initialParams={{ todoListStore: todoListStore }}
        options={{
          tabBarLabel: 'Todo',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons
              name="format-list-checkbox"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="InProgress"
        component={InProgressStackNavigator}
        initialParams={{ todoListStore: todoListStore }}
        options={{
          tabBarLabel: 'In Progress',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons
              name="progress-check"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedStackNavigator}
        initialParams={{ todoListStore: todoListStore }}
        options={{
          tabBarLabel: 'Done',
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons
              name="check-circle-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const Styles = StyleSheet.create({
  NavigationBar: {
    backgroundColor: Colors.primaryGreyDark,
  },
});

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { FunctionComponent } from 'react';
import TodoStackNavigator from './TodoStackNavigator';
import InProgressStackNavigator from './InProgressStackNavigator';
import { CompletedStackNavigator } from './CompletedStackNavigator';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../shared/Colors';
import { ITodoListStore, TodoListStore } from '../../stores/TodoListStore';

export type TabNavigatorParamList = {
  Todo: { todoListStore: ITodoListStore };
  InProgress: { todoListStore: ITodoListStore };
  Completed: { todoListStore: ITodoListStore };
};

const Tab = createMaterialBottomTabNavigator<TabNavigatorParamList>();

const TabNavigator: FunctionComponent = () => {
  const todoListStore = new TodoListStore();

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

export default TabNavigator;

const Styles = StyleSheet.create({
  NavigationBar: {
    backgroundColor: Colors.primaryGrey,
  },
});

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import TodoStackNavigator from './TodoStackNavigator';
import InProgressStackNavigator from './InProgressStackNavigator';
import CompletedStackNavigator from './CompletedStackNavigator';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default class TabNatigator extends React.Component {
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Todo"
        shifting={true}
        activeColor="#00e676"
        inactiveColor="#66ffa6"
        barStyle={Styles.NavigationBar}>
        <Tab.Screen
          name="Todo"
          component={TodoStackNavigator}
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
          options={{
            tabBarLabel: 'Progress',
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
  }
}

const Styles = StyleSheet.create({
  NavigationBar: {
    backgroundColor: '#424242',
  },
});

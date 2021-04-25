import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ITodoListStore, TodoListStore } from '../../stores/TodoListStore';
import MainTabNavigator from './MainTabNavigator';
import ChildTabNavigator from './ChildTabNavigator';
import SharedStyles from '../shared/SharedStyles';

export type RootStackNavigatorParamList = {
  MainTabNavigator: { todoListStore: ITodoListStore };
  ChildTabNavigator: {
    todoListStore: ITodoListStore;
    groupId?: number;
    readingId?: number;
  };
};

const Stack = createStackNavigator<RootStackNavigatorParamList>();
const todoListStore = new TodoListStore();

const RootStackNavigator: React.FunctionComponent = () => {
  return (
    <Stack.Navigator initialRouteName="MainTabNavigator">
      <Stack.Screen
        name="MainTabNavigator"
        component={MainTabNavigator}
        initialParams={{ todoListStore: todoListStore }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChildTabNavigator"
        component={ChildTabNavigator}
        initialParams={{
          todoListStore: todoListStore,
        }}
        options={{
          title: '',
          headerStyle: SharedStyles.navHeader,
          headerTintColor: 'white',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;

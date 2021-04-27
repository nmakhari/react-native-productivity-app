import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../shared/Colors';
import { ITodoListStore } from '../../stores/TodoListStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackNavigatorParamList } from './RootStackNavigator';
import { RouteProp } from '@react-navigation/native';
import ChildTodoStackNavigator from './ChildTodoStackNavigator';
import ChildInProgressStackNavigator from './ChildInProgressStackNavigator';
import ChildCompletedStackNavigator from './ChildCompletedStackNavigator';

type ChildTabNavigatorNavigationProp = StackNavigationProp<
  RootStackNavigatorParamList,
  'ChildTabNavigator'
>;

type ChildTabNavigatorRouteProp = RouteProp<
  RootStackNavigatorParamList,
  'ChildTabNavigator'
>;

interface IProps {
  navigation: ChildTabNavigatorNavigationProp;
  route: ChildTabNavigatorRouteProp;
}

export type ChildTabNavigatorParamList = {
  ChildTodo: {
    todoListStore: ITodoListStore;
    groupId?: number;
    readingId?: number;
  };
  ChildInProgress: {
    todoListStore: ITodoListStore;
    groupId?: number;
    readingId?: number;
  };
  ChildCompleted: {
    todoListStore: ITodoListStore;
    groupId?: number;
    readingId?: number;
  };
};

const Tab = createMaterialBottomTabNavigator<ChildTabNavigatorParamList>();

const ChildTabNavigator: FunctionComponent<IProps> = ({ route }) => {
  const { todoListStore, groupId, readingId } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="ChildTodo"
      shifting={true}
      activeColor={Colors.secondaryGreen}
      inactiveColor={Colors.secondaryGreenLight}
      barStyle={Styles.NavigationBar}>
      <Tab.Screen
        name="ChildTodo"
        component={ChildTodoStackNavigator}
        initialParams={{
          todoListStore: todoListStore,
          groupId: groupId,
          readingId: readingId,
        }}
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
        name="ChildInProgress"
        component={ChildInProgressStackNavigator}
        initialParams={{
          todoListStore: todoListStore,
          groupId: groupId,
          readingId: readingId,
        }}
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
        name="ChildCompleted"
        component={ChildCompletedStackNavigator}
        initialParams={{
          todoListStore: todoListStore,
          groupId: groupId,
          readingId: readingId,
        }}
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

export default ChildTabNavigator;

const Styles = StyleSheet.create({
  NavigationBar: {
    backgroundColor: Colors.primaryGreyDark,
  },
});

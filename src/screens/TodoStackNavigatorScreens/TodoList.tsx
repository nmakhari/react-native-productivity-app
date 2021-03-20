import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import { Colors } from '../../shared/Colors';

export class TodoList extends React.Component {
  render() {
    return (
      <>
        <Text>TODOLIST Screen</Text>
        <Card
          title={'TodoList'}
          description={'Todo description'}
          rightContent={<Text style={Styles.rightContent}>TODO RIGHT</Text>}
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

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Card from '../../components/Card';
import { Colors } from '../../shared/Colors';

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

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '../../shared/Colors';
import Card from '../../components/Card';

export class InProgressList extends React.Component {
  render() {
    return (
      <>
        <Text>InProgressList SCREEN</Text>
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

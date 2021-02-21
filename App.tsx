import 'react-native-gesture-handler';
import React from 'react';
import {Text} from 'react-native';
import {observer} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';

@observer
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Text>APP.TSX</Text>
      </NavigationContainer>
    );
  }
}

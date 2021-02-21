import 'react-native-gesture-handler';
import React from 'react';
import { observer } from 'mobx-react';
import { NavigationContainer } from '@react-navigation/native';
import TabNatigator from './src/navigators/TabNavigator';

@observer
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <TabNatigator />
      </NavigationContainer>
    );
  }
}

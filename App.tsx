import 'react-native-gesture-handler';
import React from 'react';
import { observer } from 'mobx-react';
import { NavigationContainer } from '@react-navigation/native';
import TabNatigator from './src/navigators/TabNavigator';
import { Colors } from './src/shared/Colors';

@observer
export default class App extends React.Component {
  render() {
    // setting the theme color the same as the background color prevents white
    // flashes when navigating
    return (
      <NavigationContainer
        theme={{ colors: { background: Colors.primaryGreyDark } }}>
        <TabNatigator />
      </NavigationContainer>
    );
  }
}
